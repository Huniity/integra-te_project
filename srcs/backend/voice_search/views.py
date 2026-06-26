import os
import tempfile
import unicodedata
from functools import lru_cache

from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes, throttle_classes
from rest_framework.throttling import AnonRateThrottle

from django.db.models import Value
from django.db.models.functions import Lower, Replace

from pgvector.django import CosineDistance
from voice_search.models import ObjectVector
from integrate.models import (
    Disciplina,
    Jogo,
    Livro,
    Exercicio,
    Aula,
)


_ACCENT_MAP = {
    "á": "a",
    "à": "a",
    "â": "a",
    "ã": "a",
    "ä": "a",
    "é": "e",
    "è": "e",
    "ê": "e",
    "ë": "e",
    "í": "i",
    "ì": "i",
    "î": "i",
    "ï": "i",
    "ó": "o",
    "ò": "o",
    "ô": "o",
    "õ": "o",
    "ö": "o",
    "ú": "u",
    "ù": "u",
    "û": "u",
    "ü": "u",
    "ç": "c",
}


def _strip_accents(text: str) -> str:
    """
    Normalize the input text by removing accents and converting to lowercase.
    """
    normalized = unicodedata.normalize("NFKD", text.lower())
    return "".join(c for c in normalized if not unicodedata.combining(c))


def _unaccent(field_name: str):
    """
    Create a Django ORM expression that removes accents from the specified field.
    """
    expr = Lower(field_name)
    for accented, plain in _ACCENT_MAP.items():
        expr = Replace(expr, Value(accented), Value(plain))
    return expr


class SearchThrottle(AnonRateThrottle):
    """
    Throttle anonymous search requests to reduce abuse. Needs its own scope —
    without it, AnonRateThrottle's default scope='anon' makes this share a
    cache key with any other anon-scoped throttle (e.g. LoginThrottle), so
    bursts of search traffic eat into the login rate limit for the same IP.
    """

    scope = "voice_search_anon"
    rate = "20/min"


@lru_cache(maxsize=1)
def load_embedder():
    """
    Load the sentence transformer model for embedding generation with caching to improve performance (Only loads once, subsequent calls return the cached model. Model is 384 dimension, 50+ languages and works with cosine-similarity ).
    """
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")


@lru_cache(maxsize=1)
def load_whisper():
    """
    Load the Whisper model with caching to improve performance (Only loads once, subsequent calls return the cached model. Base is 74M Parameters, 1GB VRAM).
    """
    import whisper

    return whisper.load_model("turbo")


KEYWORD_ROUTES = [
    (
        [
            "exercício",
            "exercicio",
            "exercícios",
            "exercicios",
            "treinar",
            "treino",
            "praticar",
            "prática",
            "pratica",
        ],
        "/resolver",
    ),
    (["jogo", "jogar", "jogos", "brincar", "brincadeira"], "/jogos"),
    (
        [
            "aprender",
            "aula",
            "aulas",
            "estudar",
            "estudo",
            "aprendizagem",
            "matéria",
            "materia",
        ],
        "/aprender",
    ),
    (["vídeo", "video", "vídeos", "videos", "ver vídeo", "ver video"], "/videos"),
    (
        [
            "livro",
            "livros",
            "ler",
            "leitura",
            "história",
            "historia",
            "histórias",
            "historias",
        ],
        "/ler",
    ),
    (
        [
            "descarregar",
            "download",
            "ficha",
            "fichas",
            "pdf",
            "ficheiro",
            "ficheiros",
            "imprimir",
        ],
        "/descarregar",
    ),
    (
        ["contactar", "contacto", "falar", "mensagem", "ajuda", "contactos"],
        "/contactar",
    ),
    (["sobre", "projeto", "projecto", "informação", "informacao"], "/sobre"),
    (["privacidade", "rgpd", "dados", "proteção", "protecao"], "/privacidade"),
    (["faq", "perguntas", "dúvidas", "duvidas", "frequentes"], "/faq"),
]

SUBJECT_KEYWORDS = [
    (
        [
            "português",
            "portugues",
            "portuguesa",
            "gramática",
            "gramatica",
            "leitura",
            "escrita",
            "ortografia",
        ],
        "portugues",
    ),
    (
        [
            "matemática",
            "matematica",
            "matemáticas",
            "matematicas",
            "números",
            "numeros",
            "contas",
            "calcular",
            "cálculo",
            "calculo",
            "geometria",
            "álgebra",
            "algebra",
        ],
        "matematica",
    ),
    (
        [
            "estudo do meio",
            "ciências",
            "ciencias",
            "natureza",
            "ambiente",
            "história",
            "historia",
            "ciência",
            "ciencia",
        ],
        "estudo-do-meio",
    ),
]


def extract_subject(transcript: str):
    """
    Extract the subject from the transcript based on predefined keywords.
    Returns the subject ID if a match is found, otherwise returns None.
    """
    t = transcript.lower()
    for keywords, subject_id in SUBJECT_KEYWORDS:
        if any(kw in t for kw in keywords):
            return subject_id
    return None


def keyword_route(transcript: str):
    """
    Determine the route based on keywords in the transcript. If a keyword is found, return the corresponding route.
    If the route is "/resolver" or "/aprender", also extract the subject and append
    """
    t = transcript.lower()
    for keywords, route in KEYWORD_ROUTES:
        if any(kw in t for kw in keywords):
            subject = extract_subject(transcript)
            if subject and route in ("/resolver", "/aprender"):
                return f"{route}?subject={subject}"
            return route
    return None


@api_view(["POST"])
@permission_classes([AllowAny])
def reroute(request):
    """
    Reroute the user based on the transcribed audio input. Checks keyword rules
    first, then falls back to semantic similarity via embeddings.
    """
    transcript = request.data.get("transcript", "").strip()
    if not transcript:
        return Response({"error": "No transcript."}, status=400)

    forced = keyword_route(transcript)
    if forced:
        return Response(
            {
                "route": forced,
                "results": [{"route": forced, "label": transcript, "distance": 0}],
            }
        )

    vector = load_embedder().encode(transcript, normalize_embeddings=True).tolist()

    top = max(1, min(int(request.query_params.get("top", 1)), 10))

    qs = list(
        ObjectVector.objects.annotate(
            distance=CosineDistance("embedding", vector)
        ).order_by("distance")[:top]
    )

    if not qs:
        return Response({"route": "/", "results": []})

    results = [
        {"route": r.route, "label": r.label, "distance": round(r.distance, 4)}
        for r in qs
    ]
    return Response({"route": results[0]["route"], "results": results})


@api_view(["GET"])
@permission_classes([AllowAny])
@throttle_classes([SearchThrottle])
def search(request):
    """
    Search for content based on a query string by performing accent- and
    case-insensitive containment queries on relevant fields across multiple
    models. Accepts an optional ?exclude=tipo1,tipo2 to skip result types.
    """
    q = request.query_params.get("q", "").strip()
    if len(q) < 2:
        return Response({"results": []})
    top = max(1, min(int(request.query_params.get("top", 8)), 20))
    excluded = {
        t.strip().lower()
        for t in request.query_params.get("exclude", "").split(",")
        if t.strip()
    }
    q_norm = _strip_accents(q)

    results = []

    if "disciplina" not in excluded:
        for obj in Disciplina.objects.annotate(norm=_unaccent("nome")).filter(
            norm__icontains=q_norm
        )[:top]:
            results.append(
                {"label": obj.nome, "route": "/aprender", "type": "disciplina"}
            )

    if "jogo" not in excluded:
        for obj in Jogo.objects.annotate(norm=_unaccent("titulo")).filter(
            norm__icontains=q_norm, publicado=True
        )[:top]:
            results.append(
                {"label": obj.titulo, "route": f"/jogar/{obj.id}", "type": "jogo"}
            )

    if "livro" not in excluded:
        for obj in Livro.objects.annotate(norm=_unaccent("titulo")).filter(
            norm__icontains=q_norm, publicado=True
        )[:top]:
            results.append(
                {"label": obj.titulo, "route": f"/ler/{obj.id}", "type": "livro"}
            )

    if "exercicio" not in excluded:
        for obj in Exercicio.objects.annotate(norm=_unaccent("title")).filter(
            norm__icontains=q_norm, publicado=True
        )[:top]:
            results.append(
                {
                    "label": obj.title,
                    "route": f"/resolver/{obj.id}",
                    "type": "exercicio",
                }
            )

    if "aula" not in excluded:
        for obj in Aula.objects.annotate(norm=_unaccent("title")).filter(
            norm__icontains=q_norm, publicado=True
        )[:top]:
            results.append(
                {"label": obj.title, "route": f"/aprender/{obj.id}", "type": "aula"}
            )

    return Response({"results": results[:top]})


@api_view(["POST"])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser])
def transcribe(request):
    """
    Transcribe the uploaded audio file using the Whisper model.
    """
    audio = request.FILES.get("audio")
    if not audio:
        return Response({"error": "No audio file."}, status=400)

    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp:
        for chunk in audio.chunks():
            tmp.write(chunk)
        tmp_path = tmp.name

    try:
        result = load_whisper().transcribe(
            tmp_path,
            language="pt",
            fp16=False,
            condition_on_previous_text=False,
        )
        return Response({"transcript": result["text"].strip()})
    finally:
        os.unlink(tmp_path)
