import os
import tempfile
from functools import lru_cache

from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

from pgvector.django import CosineDistance
from voice_search.models import ObjectVector


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

    return whisper.load_model("base")


@api_view(["POST"])
@permission_classes([AllowAny])
def reroute(request):
    transcript = request.data.get("transcript", "").strip()
    if not transcript:
        return Response({"error": "No transcript."}, status=400)

    vector = load_embedder().encode(transcript, normalize_embeddings=True).tolist()

    result = (
        ObjectVector.objects.annotate(distance=CosineDistance("embedding", vector))
        .order_by("distance")
        .first()
    )

    if not result:
        return Response({"route": "/"})

    return Response(
        {
            "route": result.route,
            "label": result.label,
            "distance": round(result.distance, 4),
        }
    )


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
