from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import AllowAny

from .models import (
    Disciplina,
    Tema,
    Jogo,
    Livro,
    Exercicio,
    Aula,
)

from .serializers import (
    DisciplinaSerializer,
    TemaSerializer,
    JogosSerializers,
    LivroSerializers,
    ExercicioSerializer,
    AulaSerializer,
)


class DisciplinaViewSet(ReadOnlyModelViewSet):
    queryset = Disciplina.objects.all()
    serializer_class = DisciplinaSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"


class TemaViewSet(ReadOnlyModelViewSet):
    queryset = Tema.objects.all()
    serializer_class = TemaSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"


class JogoViewSet(ReadOnlyModelViewSet):
    queryset = Jogo.objects.filter(publicado=True)
    serializer_class = JogosSerializers
    permission_classes = [AllowAny]


class LivroViewSet(ReadOnlyModelViewSet):
    queryset = Livro.objects.filter(publicado=True)
    serializer_class = LivroSerializers
    permission_classes = [AllowAny]


class ExercicioViewSet(ReadOnlyModelViewSet):
    queryset = Exercicio.objects.filter(publicado=True)
    serializer_class = ExercicioSerializer
    permission_classes = [AllowAny]


class AulaViewSet(ReadOnlyModelViewSet):
    queryset = Aula.objects.filter(publicado=True)
    serializer_class = AulaSerializer
    permission_classes = [AllowAny]
