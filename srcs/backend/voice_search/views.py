import os
import tempfile
from functools import lru_cache

from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes, throttle_classes
from rest_framework.throttling import AnonRateThrottle

from pgvector.django import CosineDistance
from voice_search.models import ObjectVector
from integrate.models import (
    Disciplina,
    Tema,
    Jogo,
    Livro,
    Exercicio,
    Aula,
)


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
    t = transcript.lower()
    for keywords, subject_id in SUBJECT_KEYWORDS:
        if any(kw in t for kw in keywords):
            return subject_id
    return None


def keyword_route(transcript: str):
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
    Search for content based on a query string by performing case-insensitive containment queries on relevant fields across multiple models.
    """
    q = request.query_params.get("q", "").strip()
    if len(q) < 2:
        return Response({"results": []})
    top = max(1, min(int(request.query_params.get("top", 8)), 20))

    results = []

    for obj in Disciplina.objects.filter(nome__icontains=q)[:top]:
        results.append({"label": obj.nome, "route": "/aprender"})

    for obj in Tema.objects.filter(titulo__icontains=q).select_related("disciplina")[
        :top
    ]:
        results.append({"label": obj.titulo, "route": f"/{obj.seccao}"})

    for obj in Jogo.objects.filter(titulo__icontains=q, publicado=True)[:top]:
        results.append({"label": obj.titulo, "route": f"/jogar/{obj.id}"})

    for obj in Livro.objects.filter(titulo__icontains=q, publicado=True)[:top]:
        results.append({"label": obj.titulo, "route": f"/ler/{obj.id}"})

    for obj in Exercicio.objects.filter(title__icontains=q, publicado=True)[:top]:
        results.append({"label": obj.title, "route": f"/resolver/{obj.id}"})

    for obj in Aula.objects.filter(title__icontains=q, publicado=True)[:top]:
        results.append({"label": obj.title, "route": f"/aprender/{obj.id}"})

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
