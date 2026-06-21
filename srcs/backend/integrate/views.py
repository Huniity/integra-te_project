from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny
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


class JogoViewSet(ModelViewSet):
    """
    ViewSet for managing Jogo instances.
    """

    queryset = Jogo.objects.all().order_by("-criado_em")
    serializer_class = JogosSerializers
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class LivroViewSet(ModelViewSet):
    """
    ViewSet for managing Livro instances.
    """

    queryset = Livro.objects.all().order_by("-criado_em")
    serializer_class = LivroSerializers
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class ExercicioViewSet(ModelViewSet):
    """
    ViewSet for managing Exercicio instances.
    """

    queryset = Exercicio.objects.all()
    serializer_class = ExercicioSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class AulaViewSet(ModelViewSet):
    """
    ViewSet for managing Aula instances.
    """

    queryset = Aula.objects.all().order_by("-created_at")
    serializer_class = AulaSerializer
    permission_classes = [
        AllowAny
    ]  # TODO: restrict writes to IsAdminUser after login is built
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class DescarregarViewSet(ModelViewSet):
    """
    ViewSet for managing downloadable content (Conteudo) instances.
    """

    queryset = (
        Conteudo.objects.filter(tipo="pdf")
        .select_related("tema", "tema__disciplina")
        .order_by("-criado_em")
    )
    serializer_class = ConteudoItemSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        """
        Save a new downloadable content instance with the type set to 'pdf' and descarregavel set to True.
        """
        serializer.save(tipo="pdf", descarregavel=True)

    def perform_update(self, serializer):
        """
        Update an existing downloadable content instance with the type set to 'pdf' and descarregavel set to True.
        """
        serializer.save(tipo="pdf", descarregavel=True)


class VideosViewSet(ModelViewSet):
    """
    ViewSet for managing video content (Conteudo) instances.
    """

    queryset = (
        Conteudo.objects.filter(tipo="video")
        .select_related("tema", "tema__disciplina")
        .order_by("-criado_em")
    )
    serializer_class = ConteudoItemSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        """
        Save a new video content instance with the type set to 'video'.
        """
        serializer.save(tipo="video")

    def perform_update(self, serializer):
        """
        Update an existing video content instance with the type set to 'video'.
        """
        serializer.save(tipo="video")
