from rest_framework import serializers
from .models import (
    Disciplina,
    Tema,
    Conteudo,
    Jogo,
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


class ConteudoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conteudo
        fields = "ficheito_url", "thumbnail_url"


class JogosSerializers(serializers.ModelSerializer):
    class Meta:
        model = Jogo
        fields = "ficheito_url", "disciplina (slug) (nome)"
