from rest_framework import serializers
from .models import (
    Disciplina,
    Tema,
    Conteudo,  # noqa
    Jogo,  # noqa
    Livro,  # noqa
    MaterialOriginal,  # noqa
)


class DisciplinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disciplina
        fields = "id", "nome", "slug", "desc"


class TemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tema
        fields = "id", "nome", "slug", "desc"
