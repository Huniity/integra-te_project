from django.apps import AppConfig
import os
import sys


class VoiceSearchConfig(AppConfig):
    """
    Configuration for the voice_search app.
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "voice_search"

    def ready(self):
        """
        Preload voice models on server startup to avoid first-request latency.
        Disabled by setting VOICE_PRELOAD_MODELS=False.
        """
        preload_enabled = os.getenv("VOICE_PRELOAD_MODELS", "True").lower() in {
            "1",
            "true",
            "yes",
            "on",
        }
        if not preload_enabled:
            return

        is_runserver = len(sys.argv) > 1 and sys.argv[1] == "runserver"
        if is_runserver and os.environ.get("RUN_MAIN") != "true":
            return

        from voice_search.views import load_embedder, load_whisper

        load_embedder()
        load_whisper()
