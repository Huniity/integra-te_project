from django.apps import AppConfig


def ready(self):
    """
    Load the embedder and whisper models when the app is ready to ensure they are available for use.
    Avoids cold start issues by pre-loading the models when the application starts.
    """
    from voice_search.views import load_embedder, load_whisper

    load_embedder()
    load_whisper()


class VoiceSearchConfig(AppConfig):
    """
    Configuration for the voice_search app.
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "voice_search"
