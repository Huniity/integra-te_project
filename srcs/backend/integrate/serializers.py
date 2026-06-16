from rest_framework import serializers
from .models import (
    Disciplina,
    Tema,
    Conteudo,
    Jogo,
    Livro,
    MaterialOriginal,
    Exercicio,
    Aula,
)


class DisciplinaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disciplina
        fields = ("id", "nome", "slug", "desc")


class TemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tema
        fields = ("id", "titulo", "slug", "desc", "ano_escolar", "seccao", "disciplina")


class ConteudoSerializer(serializers.ModelSerializer):
    ficheiro_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = Conteudo
        fields = (
            "id",
            "titulo",
            "tipo",
            "corpo",
            "dificuldade",
            "url_externa",
            "descarregavel",
            "publicado",
            "criado_em",
            "ficheiro_url",
            "thumbnail_url",
        )

    def get_ficheiro_url(self, obj):
        request = self.context.get("request")
        if obj.ficheiro and request:
            return request.build_absolute_uri(obj.ficheiro.url)
        return None

    def get_thumbnail_url(self, obj):
        request = self.context.get("request")
        if obj.thumbnail and request:
            return request.build_absolute_uri(obj.thumbnail.url)
        return None


class JogosSerializers(serializers.ModelSerializer):
    disciplina_nome = serializers.CharField(source="disciplina.nome", read_only=True)
    disciplina_slug = serializers.CharField(source="disciplina.slug", read_only=True)
    ficheiro_url = serializers.SerializerMethodField()

    class Meta:
        model = Jogo
        fields = (
            "id",
            "titulo",
            "descricao",
            "faixa_etaria",
            "url_externa",
            "tamanho_kb",
            "publicado",
            "criado_em",
            "disciplina_nome",
            "disciplina_slug",
            "ficheiro_url",
        )

    def get_ficheiro_url(self, obj):
        request = self.context.get("request")
        if obj.ficheiro and request:
            return request.build_absolute_uri(obj.ficheiro.url)
        return None


class LivroSerializers(serializers.ModelSerializer):
    capa_url = serializers.SerializerMethodField()
    ficheiro_url = serializers.SerializerMethodField()

    class Meta:
        model = Livro
        fields = (
            "id",
            "titulo",
            "autor",
            "faixa_etaria",
            "resumo",
            "temas",
            "publicado",
            "criado_em",
            "capa_url",
            "ficheiro_url",
        )

    def get_capa_url(self, obj):
        request = self.context.get("request")
        if obj.capa and request:
            return request.build_absolute_uri(obj.capa.url)
        return None

    def get_ficheiro_url(self, obj):
        request = self.context.get("request")
        if obj.ficheiro and request:
            return request.build_absolute_uri(obj.ficheiro.url)
        return None


class MaterialOriginalSerializers(serializers.ModelSerializer):
    ficheiro_url = serializers.SerializerMethodField()

    class Meta:
        model = MaterialOriginal
        fields = (
            "id",
            "titulo",
            "autor",
            "descricao",
            "url_externa",
            "descarregavel",
            "publicado",
            "ficheiro_url",
        )

    def get_ficheiro_url(self, obj):
        request = self.context.get("request")
        if obj.ficheiro and request:
            return request.build_absolute_uri(obj.ficheiro.url)
        return None


class ContactoSerializers(serializers.Serializer):
    nome = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    mensagem = serializers.CharField()


class ExercicioSerializer(serializers.ModelSerializer):
    subjectId = serializers.CharField(source="subject_id")
    titleColor = serializers.CharField(source="title_color")
    iconImg = serializers.CharField(source="icon_img")
    pdfUrl = serializers.URLField(source="pdf_url", allow_null=True)

    class Meta:
        model = Exercicio
        fields = (
            "id",
            "title",
            "level",
            "subjectId",
            "titleColor",
            "iconImg",
            "path",
            "description",
            "pdfUrl",
        )


class AulaSerializer(serializers.ModelSerializer):
    subjectId = serializers.CharField(source="subject_id")
    videoUrl = serializers.URLField(source="video_url", allow_null=True)
    thumbnailUrl = serializers.CharField(source="thumbnail_url")
    createdAt = serializers.DateTimeField(source="created_at")

    class Meta:
        model = Aula
        fields = (
            "id",
            "title",
            "subjectId",
            "level",
            "description",
            "videoUrl",
            "thumbnailUrl",
            "duration",
            "createdAt",
        )
