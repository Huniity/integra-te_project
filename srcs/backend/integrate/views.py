from rest_framework.views import ReadOnlyModelViewSet  # noqa
from rest_framework.generics import CreateAPIView  # noqa

from .models import (  # noqa
    Disciplina,  # noqa
    Tema,  # noqa
    Jogo,  # noqa
    Livro,  # noqa
)  # noqa

from .serializers import (  # noqa
    DisciplinaSerializer,  # noqa
    TemaSerializer,  # noqa
    JogosSerializers,  # noqa
    LivroSerializers,  # noqa
)


class DisciplinaViewSet(ReadOnlyModelViewSet):  # noqa
    queryset = Disciplina.objects.all()  # noqa
    serializer_class = DisciplinaSerializer  # noqa
    lookup_field = "slug"  # noqa


class TemaViewSet(ReadOnlyModelViewSet):  # noqa
    queryset = Tema.objects.all()  # noqa
    serializer_class = TemaSerializer  # noqa
    lookup_field = "slug"  # noqa


class JogoViewSet(ReadOnlyModelViewSet):  # noqa
    queryset = Jogo.objects.all()  # noqa
    serializer_class = JogosSerializers  # noqa
    lookup_field = "slug"  # noqa


class LivroViewSet(ReadOnlyModelViewSet):  # noqa
    queryset = Livro.objects.all()  # noqa
    serializer_class = LivroSerializers  # noqa
    lookup_field = "slug"  # noqa
