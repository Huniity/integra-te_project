from rest_framework import serializers
from .models import (
    Disciplina,
    Tema,
    Conteudo,
    Jogo,
    Livro,
    MaterialOriginal,
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


class LivroSerializers(serializers.ModelSerializer):
    class Meta:
        model = Livro
        fields = "temas (SerializermethodField)", "capa_url"


class MaterialOriginalSerializers(serializers.ModelSerializer):
    class Meta:
        model = MaterialOriginal
        fields = "ficheito_url", "url_externa", "descartavel"


class ContactoSerializers(serializers.Serializer):
    nome = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    mensagem = serializers.CharField()
