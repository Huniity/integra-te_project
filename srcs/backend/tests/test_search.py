from django.test import TestCase
from rest_framework.test import APIClient

from integrate.models import (
    Disciplina,
    Jogo,
    Livro,
    Exercicio,
    Aula,
)

SEARCH_URL = "/api/v1/voice/search/"


def make_disciplina(nome="Matemática", slug="matematica"):
    """
    Helper function to create a Disciplina instance with default values.
    """
    return Disciplina.objects.create(nome=nome, slug=slug, desc="")


class SearchEndpointTests(TestCase):
    """
    Test suite for the search endpoint, which allows users to search for content based on a query string. The tests cover various scenarios including protocol compliance, result shape, and searching across different models (Disciplina, Jogo, Livro, Exercicio, Aula).
    """

    def setUp(self):
        self.client = APIClient()
        self.disc = make_disciplina()

    # Protocol Compliannce

    def test_get_only(self):
        """
        Test that the search endpoint only allows GET requests and returns a 405 Method Not Allowed status for other HTTP methods.
        """
        response = self.client.post(SEARCH_URL, {"q": "mat"})
        self.assertEqual(response.status_code, 405)

    def test_is_public(self):
        """
        Test that the search endpoint is publicly accessible without authentication.
        """
        response = self.client.get(SEARCH_URL, {"q": "mat"})
        self.assertNotEqual(response.status_code, 401)

    def test_short_query_returns_empty(self):
        """
        Test that if the query string is shorter than 2 characters, the search endpoint returns an empty results list.
        """
        response = self.client.get(SEARCH_URL, {"q": "m"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["results"], [])

    def test_missing_q_returns_empty(self):
        """
        Test that if the 'q' query parameter is missing, the search endpoint returns an empty results list.
        """
        response = self.client.get(SEARCH_URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["results"], [])

    # Result Shape

    def test_result_has_label_and_route(self):
        """
        Test that search results contain the expected 'label' and 'route' fields.
        """
        response = self.client.get(SEARCH_URL, {"q": "Mate"})
        self.assertEqual(response.status_code, 200)
        results = response.json()["results"]
        self.assertTrue(len(results) > 0)
        self.assertIn("label", results[0])
        self.assertIn("route", results[0])

    # Disciplina

    def test_finds_disciplina_by_name(self):
        """
        Test that searching for a Disciplina by name returns the correct result.
        """
        response = self.client.get(SEARCH_URL, {"q": "Mate"})
        labels = [r["label"] for r in response.json()["results"]]
        self.assertIn("Matemática", labels)

    def test_disciplina_route(self):
        """
        Test that the route for a Disciplina search result is "/aprender", since there is
        no dedicated per-discipline page to deep-link into.
        """
        response = self.client.get(SEARCH_URL, {"q": "Matemática"})
        routes = [r["route"] for r in response.json()["results"]]
        self.assertIn("/aprender", routes)

    def test_disciplina_case_insensitive(self):
        """
        Test that searching for a Disciplina by name is case-insensitive.
        """
        response = self.client.get(SEARCH_URL, {"q": "matemática"})
        labels = [r["label"] for r in response.json()["results"]]
        self.assertIn("Matemática", labels)

    # Jogo

    def test_finds_jogo(self):
        """
        Test that searching for a Jogo by title returns the correct result.
        """
        Jogo.objects.create(titulo="Jogo de Adição", descricao="", publicado=True)
        response = self.client.get(SEARCH_URL, {"q": "Adição"})
        labels = [r["label"] for r in response.json()["results"]]
        self.assertIn("Jogo de Adição", labels)

    def test_unpublished_jogo_excluded(self):
        """
        Test that unpublished Jogo instances are not included in search results.
        """
        Jogo.objects.create(titulo="Jogo Secreto", descricao="", publicado=False)
        response = self.client.get(SEARCH_URL, {"q": "Secreto"})
        labels = [r["label"] for r in response.json()["results"]]
        self.assertNotIn("Jogo Secreto", labels)

    # Livro

    def test_finds_livro(self):
        """
        Test that searching for a Livro by title returns the correct result.
        """
        Livro.objects.create(
            titulo="O Principezinho",
            autor="Saint-Exupéry",
            faixa_etaria="8+",
            resumo="",
            publicado=True,
        )
        response = self.client.get(SEARCH_URL, {"q": "Princip"})
        labels = [r["label"] for r in response.json()["results"]]
        self.assertIn("O Principezinho", labels)

    # Exercício

    def test_finds_exercicio(self):
        """
        Test that searching for an Exercicio by title returns the correct result.
        """
        Exercicio.objects.create(
            title="Exercício de Multiplicação",
            level=1,
            subject_id="matematica",
            publicado=True,
        )
        response = self.client.get(SEARCH_URL, {"q": "Multiplicação"})
        results = response.json()["results"]
        labels = [r["label"] for r in results]
        self.assertIn("Exercício de Multiplicação", labels)

    def test_exercicio_route_is_resolver(self):
        """
        Test that the route for an Exercicio search result deep-links to that
        exercise's id under "/resolver".
        """
        exercicio = Exercicio.objects.create(
            title="Exercício de Divisão",
            level=1,
            subject_id="matematica",
            publicado=True,
        )
        response = self.client.get(SEARCH_URL, {"q": "Divisão"})
        routes = [r["route"] for r in response.json()["results"]]
        self.assertIn(f"/resolver/{exercicio.id}", routes)

    # Aula

    def test_finds_aula(self):
        """
        Test that searching for an Aula by title returns the correct result.
        """
        Aula.objects.create(
            title="Aula de Frações", subject_id="matematica", level=2, publicado=True
        )
        response = self.client.get(SEARCH_URL, {"q": "Frações"})
        labels = [r["label"] for r in response.json()["results"]]
        self.assertIn("Aula de Frações", labels)

    def test_aula_route_is_aprender(self):
        """
        Test that the route for an Aula search result deep-links to that
        lesson's id under "/aprender".
        """
        aula = Aula.objects.create(
            title="Aula de Geometria", subject_id="matematica", level=2, publicado=True
        )
        response = self.client.get(SEARCH_URL, {"q": "Geometria"})
        routes = [r["route"] for r in response.json()["results"]]
        self.assertIn(f"/aprender/{aula.id}", routes)
