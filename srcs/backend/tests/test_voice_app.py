import os
import uuid
from io import BytesIO
from unittest.mock import patch, MagicMock

from django.test import TestCase
from rest_framework.test import APIClient

from voice_search.models import ObjectVector


TRANSCRIBE_URL = "/api/v1/voice/transcribe/"
REROUTE_URL = "/api/v1/voice/reroute/"
AUDIO_FILE_PATH = os.path.join(os.path.dirname(__file__), "audio_test.webm")

DUMMY_VECTOR = [1.0] + [0.0] * 383  # 384-dim unit vector for test records


def make_object_vector(
    label="Matemática",
    route="/aprender/matematica",
    model_type="disciplina",
    vector=None,
):
    """
    Helper function to create an ObjectVector instance with default values. This is used in tests to populate the database with a known vector for testing the reroute functionality.
     - label: The label for the object (default "Matemática").
     - route: The route associated with the object (default "/aprender/matematica").
     - model_type: The type of the model (default "disciplina").
     - vector: The embedding vector to use (default is a dummy unit vector).
     Returns the created ObjectVector instance.
    """
    return ObjectVector.objects.create(
        object_id=uuid.uuid4(),
        model_type=model_type,
        label=label,
        route=route,
        embedding=vector or DUMMY_VECTOR,
    )


class TranscribeTests(TestCase):
    """
    Test suite for the transcribe endpoint, which allows users to upload audio and receive a transcript. The tests cover protocol compliance (HTTP methods, authentication) and functionality (returning a transcript for valid audio input).
    """

    def setUp(self):
        """
        Set up the test client for making API requests in the tests.
        """
        self.client = APIClient()

    def test_endpoint_is_public(self):
        """
        Test that the transcribe endpoint is publicly accessible without authentication.
        """
        response = self.client.post(TRANSCRIBE_URL, {}, format="multipart")
        self.assertNotEqual(response.status_code, 401)

    def test_no_audio_returns_400(self):
        """
        Test that if no audio file is provided, the transcribe endpoint returns a 400 Bad Request status.
        """
        response = self.client.post(TRANSCRIBE_URL, {}, format="multipart")
        self.assertEqual(response.status_code, 400)

    def test_get_not_allowed(self):
        """
        Test that the transcribe endpoint only allows POST requests and returns a 405 Method Not Allowed status for GET requests.
        """
        response = self.client.get(TRANSCRIBE_URL)
        self.assertEqual(response.status_code, 405)

    @patch("voice_search.views.load_whisper")
    def test_returns_transcript(self, mock_load_whisper):
        """
        Test that the transcribe endpoint returns a transcript for valid audio input.
        """
        mock_model = MagicMock()
        mock_model.transcribe.return_value = {"text": "Quero aprender matemática."}
        mock_load_whisper.return_value = mock_model

        dummy = BytesIO(b"fake audio")
        dummy.name = "recording.webm"
        response = self.client.post(
            TRANSCRIBE_URL, {"audio": dummy}, format="multipart"
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("transcript", response.json())
        self.assertEqual(response.json()["transcript"], "Quero aprender matemática.")

    def test_real_audio(self):
        """
        Test that the transcribe endpoint can process a real audio file and return a transcript. This test requires the presence of 'audio_test.webm' in the same directory as this test file. If the file is not found, the test will be skipped.
         The test reads the audio file, uploads it to the transcribe endpoint, and checks that a transcript is returned in the response.
        """
        if not os.path.exists(AUDIO_FILE_PATH):
            self.skipTest("audio_test.webm not found.")

        with open(AUDIO_FILE_PATH, "rb") as f:
            response = self.client.post(
                TRANSCRIBE_URL, {"audio": f}, format="multipart"
            )

        self.assertEqual(response.status_code, 200)
        self.assertIn("transcript", response.json())
        print(f"\n  Transcript: '{response.json()['transcript']}'")


class RerouteTests(TestCase):
    """
    Test suite for the reroute endpoint, which takes a transcript and returns the most relevant route and search results based on vector similarity. The tests cover protocol compliance (HTTP methods, authentication) and functionality (returning correct routes and results based on the transcript).
    """

    def setUp(self):
        self.client = APIClient()
        encode_result = MagicMock()
        encode_result.tolist.return_value = DUMMY_VECTOR
        self.mock_embedder = MagicMock()
        self.mock_embedder.encode.return_value = encode_result

    # Protocol Compliance

    @patch("voice_search.views.load_embedder")
    def test_is_public(self, mock_load_embedder):
        """
        Test that the reroute endpoint is publicly accessible without authentication.
        """
        mock_load_embedder.return_value = self.mock_embedder
        response = self.client.post(
            REROUTE_URL, {"transcript": "matemática"}, format="json"
        )
        self.assertNotEqual(response.status_code, 401)

    def test_get_not_allowed(self):
        """
        Test that the reroute endpoint only allows POST requests and returns a 405 Method Not Allowed status for GET requests.
        """
        response = self.client.get(REROUTE_URL)
        self.assertEqual(response.status_code, 405)

    def test_missing_transcript_returns_400(self):
        """
        Test that if no transcript is provided, the reroute endpoint returns a 400 Bad Request status.
        """
        response = self.client.post(REROUTE_URL, {}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_empty_transcript_returns_400(self):
        """
        Test that if an empty transcript is provided, the reroute endpoint returns a 400 Bad Request status.
        """
        response = self.client.post(REROUTE_URL, {"transcript": "  "}, format="json")
        self.assertEqual(response.status_code, 400)

    # Result Shape

    @patch("voice_search.views.load_embedder")
    def test_returns_route_and_results(self, mock_load_embedder):
        """
        Test that the reroute endpoint returns a response containing a 'route' and 'results' field when given a valid transcript.
        """
        mock_load_embedder.return_value = self.mock_embedder
        make_object_vector()

        response = self.client.post(
            REROUTE_URL, {"transcript": "matemática"}, format="json"
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("route", data)
        self.assertIn("results", data)

    @patch("voice_search.views.load_embedder")
    def test_result_items_have_label_route_distance(self, mock_load_embedder):
        """
        Test that each item in the 'results' list contains 'label', 'route', and 'distance' fields.
        """
        mock_load_embedder.return_value = self.mock_embedder
        make_object_vector()

        response = self.client.post(
            REROUTE_URL, {"transcript": "matemática"}, format="json"
        )
        result = response.json()["results"][0]

        self.assertIn("label", result)
        self.assertIn("route", result)
        self.assertIn("distance", result)

    # Behaviour

    @patch("voice_search.views.load_embedder")
    def test_empty_db_returns_default_route(self, mock_load_embedder):
        """
        Test that if the database has no ObjectVector entries, the reroute endpoint returns a default route of "/" and an empty results list.
         This test mocks the embedder to return a known vector and ensures that when there are no entries in the database, the response contains the expected default values.
         The test checks that the 'route' field in the response is "/" and that the 'results' list is empty.
         This verifies that the endpoint handles the case of an empty database gracefully without errors.
        """
        mock_load_embedder.return_value = self.mock_embedder

        response = self.client.post(
            REROUTE_URL, {"transcript": "qualquer coisa"}, format="json"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["route"], "/")
        self.assertEqual(response.json()["results"], [])

    @patch("voice_search.views.load_embedder")
    def test_top_param_limits_results(self, mock_load_embedder):
        """
        Test that the 'top' query parameter limits the number of results returned by the reroute endpoint.
        """
        mock_load_embedder.return_value = self.mock_embedder
        for i in range(5):
            make_object_vector(
                label=f"Item {i}", route=f"/route/{i}", model_type="disciplina"
            )

        response = self.client.post(
            f"{REROUTE_URL}?top=2", {"transcript": "teste"}, format="json"
        )

        self.assertLessEqual(len(response.json()["results"]), 2)

    @patch("voice_search.views.load_embedder")
    def test_top_route_matches_first_result(self, mock_load_embedder):
        """
        Test that the 'route' field in the response matches the route of the first item in the 'results' list, which should be the closest match based on embedding similarity.
        This test creates a known ObjectVector entry in the database and mocks the embedder to return a vector that would match that entry. It then checks that the 'route' field in the response is the same as the 'route' of the first result, ensuring that the endpoint correctly identifies and returns the closest matching content.
        """
        mock_load_embedder.return_value = self.mock_embedder
        make_object_vector(label="Matemática", route="/aprender/matematica")

        response = self.client.post(
            f"{REROUTE_URL}?top=3", {"transcript": "matemática"}, format="json"
        )

        data = response.json()
        self.assertEqual(data["route"], data["results"][0]["route"])
