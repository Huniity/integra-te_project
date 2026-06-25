from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from .models import (
    Conteudo,
    Disciplina,
    Tema,
    Jogo,
    Livro,
    Exercicio,
    Aula,
)

from .serializers import (
    ConteudoItemSerializer,
    DisciplinaSerializer,
    TemaSerializer,
    JogosSerializers,
    LivroSerializers,
    ExercicioSerializer,
    AulaSerializer,
)


class PublishedForAnonymousMixin:
    """
    Anonymous requests only see publicado=True rows. Logged-in users (editors,
    via the dashboard) see everything, drafts included, so they can review and
    edit content before it goes live.
    """

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if not (user and user.is_authenticated):
            qs = qs.filter(publicado=True)
        return qs


class AttributionMixin:
    """
    Stamps created_by/updated_by from the requesting user. Both are nullable,
    so unauthenticated writes (if ever allowed again) simply leave them blank
    instead of failing.
    """

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(created_by=user, updated_by=user)

    def perform_update(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(updated_by=user)


class DisciplinaViewSet(ReadOnlyModelViewSet):
    """
    ViewSet for managing Disciplina instances.
    """

    queryset = Disciplina.objects.all()
    serializer_class = DisciplinaSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"


class TemaViewSet(ReadOnlyModelViewSet):
    """
    ViewSet for managing Tema instances.
    """

    queryset = Tema.objects.all().select_related("disciplina")
    serializer_class = TemaSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"


class JogoViewSet(PublishedForAnonymousMixin, AttributionMixin, ModelViewSet):
    """
    ViewSet for managing Jogo instances.
    """

    queryset = Jogo.objects.all().order_by("-criado_em")
    serializer_class = JogosSerializers
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class LivroViewSet(PublishedForAnonymousMixin, AttributionMixin, ModelViewSet):
    """
    ViewSet for managing Livro instances.
    """

    queryset = Livro.objects.all().order_by("-criado_em")
    serializer_class = LivroSerializers
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class ExercicioViewSet(PublishedForAnonymousMixin, AttributionMixin, ModelViewSet):
    """
    ViewSet for managing Exercicio instances.
    """

    queryset = Exercicio.objects.all()
    serializer_class = ExercicioSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class AulaViewSet(PublishedForAnonymousMixin, AttributionMixin, ModelViewSet):
    """
    ViewSet for managing Aula instances.
    """

    queryset = Aula.objects.all().order_by("-created_at")
    serializer_class = AulaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class DescarregarViewSet(PublishedForAnonymousMixin, ModelViewSet):
    """
    ViewSet for managing downloadable content (Conteudo) instances.
    """

    queryset = (
        Conteudo.objects.filter(tipo="pdf")
        .select_related("tema", "tema__disciplina")
        .order_by("-criado_em")
    )
    serializer_class = ConteudoItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        """
        Save a new downloadable content instance with the type set to 'pdf' and descarregavel set to True.
        """
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(
            tipo="pdf", descarregavel=True, created_by=user, updated_by=user
        )

    def perform_update(self, serializer):
        """
        Update an existing downloadable content instance with the type set to 'pdf' and descarregavel set to True.
        """
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(tipo="pdf", descarregavel=True, updated_by=user)


class VideosViewSet(PublishedForAnonymousMixin, ModelViewSet):
    """
    ViewSet for managing video content (Conteudo) instances.
    """

    queryset = (
        Conteudo.objects.filter(tipo="video")
        .select_related("tema", "tema__disciplina")
        .order_by("-criado_em")
    )
    serializer_class = ConteudoItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        """
        Save a new video content instance with the type set to 'video'.
        """
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(tipo="video", created_by=user, updated_by=user)

    def perform_update(self, serializer):
        """
        Update an existing video content instance with the type set to 'video'.
        """
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(tipo="video", updated_by=user)
