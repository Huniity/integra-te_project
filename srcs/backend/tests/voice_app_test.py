import os
from io import BytesIO
from unittest.mock import patch, MagicMock

from django.test import TestCase
from rest_framework.test import APIClient


TRANSCRIBE_URL = "/api/v1/voice/transcribe/"
AUDIO_FILE_PATH = os.path.join(os.path.dirname(__file__), "audio_test.webm")


class TranscribeTests(TestCase):
    def api(self):
        self.client = APIClient()

    def test_endpoint_is_public(self):
        """
        Accessing the endpoint without authentication should not return 401.
        """
        response = self.client.post(TRANSCRIBE_URL, {}, format="multipart")
        self.assertNotEqual(response.status_code, 401)

    def test_no_audio_returns_400(self):
        """
        Missing audio file should return 400.
        """
        response = self.client.post(TRANSCRIBE_URL, {}, format="multipart")
        self.assertEqual(response.status_code, 400)

    def test_get_not_allowed(self):
        """
        GET should return 405.
        """
        response = self.client.get(TRANSCRIBE_URL)
        self.assertEqual(response.status_code, 405)

    @patch("voice_search.views.get_whisper")
    def test_returns_transcript(self, mock_get_whisper):
        """
        Should return transcript text on success.
        """
        mock_model = MagicMock()
        mock_model.transcribe.return_value = {"text": "Quero aprender matemática."}
        mock_get_whisper.return_value = mock_model

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
        Test with a real audio file to check end-to-end functionality.
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
