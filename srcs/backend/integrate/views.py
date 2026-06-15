from rest_framework.views import ReadOnlyModelViewSet
# from rest_framework.generics import CreateAPIView

from .models import (
    Disciplina,
    Tema,
    Jogo,
    Livro,
)

from .serializers import (
    DisciplinaSerializer,
    TemaSerializer,
    JogosSerializers,
    LivroSerializers,
)


class DisciplinaViewSet(ReadOnlyModelViewSet):
    """
    ViewSet para as disciplinas
    """

    queryset = Disciplina.objects.all()
    serializer_class = DisciplinaSerializer
    lookup_field = "slug"


class TemaViewSet(ReadOnlyModelViewSet):
    """
    ViewSet para os temas
    """

    queryset = Tema.objects.all()
    serializer_class = TemaSerializer
    lookup_field = "slug"


class JogoViewSet(ReadOnlyModelViewSet):
    """
    ViewSet para os jogos
    """

    queryset = Jogo.objects.all()
    serializer_class = JogosSerializers
    lookup_field = "slug"


class LivroViewSet(ReadOnlyModelViewSet):
    """
    ViewSet para os livros
    """

    queryset = Livro.objects.all()
    serializer_class = LivroSerializers
    lookup_field = "slug"
