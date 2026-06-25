from rest_framework import serializers
from .models import (
    Disciplina,
    Tema,
    Conteudo,
    Jogo,
    Livro,
    Exercicio,
    Aula,
)


class DisciplinaSerializer(serializers.ModelSerializer):
    """
    Serializer for Disciplina model.
    """

    class Meta:
        model = Disciplina
        fields = ("id", "nome", "slug", "desc")


class TemaSerializer(serializers.ModelSerializer):
    """
    Serializer for Tema model.
    """

    disciplina_nome = serializers.CharField(source="disciplina.nome", read_only=True)

    class Meta:
        model = Tema
        fields = (
            "id",
            "titulo",
            "slug",
            "desc",
            "ano_escolar",
            "seccao",
            "disciplina",
            "disciplina_nome",
        )


class ConteudoSerializer(serializers.ModelSerializer):
    """
    Serializer for Conteudo model.
    """

    ficheiro_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()

    def get_ficheiro_url(self, obj):
        """
        Returns the URL of the file associated with the Conteudo instance.
        If the file exists, its URL is returned; otherwise, None is returned.
        """
        if obj.ficheiro:
            return obj.ficheiro.url
        return None

    def get_thumbnail_url(self, obj):
        """
        Returns the URL of the thumbnail associated with the Conteudo instance.
        If the thumbnail exists, its URL is returned; otherwise, None is returned.
        """
        if obj.thumbnail:
            return obj.thumbnail.url
        return None

    class Meta:
        """
        Meta class for the ConteudoSerializer.
        Specifies the model and fields to be serialized.
        """

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


class JogosSerializers(serializers.ModelSerializer):
    """
    Serializer for Jogo model.
    """

    disciplina_nome = serializers.CharField(
        source="disciplina.nome", read_only=True, default=""
    )
    disciplina_slug = serializers.CharField(
        source="disciplina.slug", read_only=True, default=""
    )
    subjectId = serializers.CharField(
        source="subject_id", allow_blank=True, required=False
    )
    thumbnailUrl = serializers.SerializerMethodField()
    thumbnail = serializers.ImageField(required=False, allow_null=True, write_only=True)
    thumbnailUrlInput = serializers.CharField(
        source="thumbnail_url", allow_blank=True, required=False, write_only=True
    )
    videoUrl = serializers.URLField(source="video_url", allow_null=True, required=False)
    ficheiro_url = serializers.SerializerMethodField()
    ficheiro = serializers.FileField(required=False, allow_null=True, write_only=True)
    createdBy = serializers.CharField(
        source="created_by.username", read_only=True, default=None
    )
    updatedBy = serializers.CharField(
        source="updated_by.username", read_only=True, default=None
    )

    def get_thumbnailUrl(self, obj):
        if obj.thumbnail:
            return obj.thumbnail.url
        return obj.thumbnail_url or None

    def get_ficheiro_url(self, obj):
        if obj.ficheiro:
            return obj.ficheiro.url
        return obj.url_externa or None

    class Meta:
        model = Jogo
        fields = (
            "id",
            "disciplina",
            "titulo",
            "descricao",
            "faixa_etaria",
            "subjectId",
            "level",
            "thumbnailUrl",
            "thumbnailUrlInput",
            "thumbnail",
            "videoUrl",
            "url_externa",
            "ficheiro",
            "publicado",
            "criado_em",
            "disciplina_nome",
            "disciplina_slug",
            "ficheiro_url",
            "createdBy",
            "updatedBy",
        )
        extra_kwargs = {
            "disciplina": {"allow_null": True, "required": False},
            "faixa_etaria": {"required": False, "allow_blank": True},
            "url_externa": {"allow_null": True, "required": False, "allow_blank": True},
            "level": {"allow_null": True, "required": False},
        }


class LivroSerializers(serializers.ModelSerializer):
    """
    Serializer for Livro model.
    """

    capa_url = serializers.SerializerMethodField()
    ficheiro_url = serializers.SerializerMethodField()
    capa = serializers.ImageField(required=False, allow_null=True, write_only=True)
    ficheiro = serializers.FileField(required=False, allow_null=True, write_only=True)
    createdBy = serializers.CharField(
        source="created_by.username", read_only=True, default=None
    )
    updatedBy = serializers.CharField(
        source="updated_by.username", read_only=True, default=None
    )

    def get_capa_url(self, obj):
        """
        Returns the URL of the cover image associated with the Livro instance.
        If the cover image exists, its URL is returned; otherwise, None is returned.
        """
        if obj.capa:
            return obj.capa.url
        return None

    def get_ficheiro_url(self, obj):
        """
        Returns the URL of the file associated with the Livro instance.
        If the file exists, its URL is returned; otherwise, None is returned.
        """
        if obj.ficheiro:
            return obj.ficheiro.url
        return None

    class Meta:
        """
        Meta class for the LivroSerializers.
        Specifies the model and fields to be serialized, along with extra keyword arguments for certain fields.
        """

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
            "capa",
            "capa_url",
            "ficheiro",
            "ficheiro_url",
            "createdBy",
            "updatedBy",
        )
        extra_kwargs = {
            "autor": {"required": False, "allow_blank": True},
            "resumo": {"required": False, "allow_blank": True},
            "temas": {"required": False, "allow_blank": True},
        }


class ConteudoItemSerializer(serializers.ModelSerializer):
    """
    Serializer for Conteudo items (PDFs, videos). Supports both read and write.
    """

    ficheiro_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    disciplina_slug = serializers.CharField(
        source="tema.disciplina.slug", read_only=True
    )
    disciplina_nome = serializers.CharField(
        source="tema.disciplina.nome", read_only=True
    )
    tema_titulo = serializers.CharField(source="tema.titulo", read_only=True)
    ficheiro = serializers.FileField(required=False, allow_null=True, write_only=True)
    thumbnail = serializers.ImageField(required=False, allow_null=True, write_only=True)
    createdBy = serializers.CharField(
        source="created_by.username", read_only=True, default=None
    )
    updatedBy = serializers.CharField(
        source="updated_by.username", read_only=True, default=None
    )

    def get_ficheiro_url(self, obj):
        """
        Returns the URL of the file associated with the Conteudo instance.
        If the file exists, its URL is returned; otherwise, None is returned.
        """
        if obj.ficheiro:
            return obj.ficheiro.url
        return None

    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            return obj.thumbnail.url
        return None

    class Meta:
        """
        Meta class for the ConteudoItemSerializer.
        Specifies the model and fields to be serialized, along with extra keyword arguments for certain fields.
        """

        model = Conteudo
        fields = (
            "id",
            "tema",
            "titulo",
            "tipo",
            "corpo",
            "dificuldade",
            "url_externa",
            "descarregavel",
            "publicado",
            "criado_em",
            "ficheiro",
            "ficheiro_url",
            "thumbnail",
            "thumbnail_url",
            "disciplina_slug",
            "disciplina_nome",
            "tema_titulo",
            "createdBy",
            "updatedBy",
        )
        extra_kwargs = {
            "url_externa": {"allow_null": True, "required": False, "allow_blank": True},
            "dificuldade": {"allow_null": True, "required": False, "allow_blank": True},
            "corpo": {"required": False, "allow_blank": True},
            "tipo": {"required": False},
        }


class ContactoSerializers(serializers.Serializer):
    """
    Serializer for Contacto model.
    """

    nome = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    mensagem = serializers.CharField()


class ExercicioSerializer(serializers.ModelSerializer):
    """
    Serializer for Exercicio model.
    """

    subjectId = serializers.CharField(source="subject_id")
    titleColor = serializers.CharField(
        source="title_color", required=False, allow_blank=True
    )
    iconImg = serializers.CharField(source="icon_img", required=False, allow_blank=True)
    pdfUrl = serializers.URLField(source="pdf_url", allow_null=True, required=False)
    thumbnailUrl = serializers.SerializerMethodField()
    thumbnail = serializers.ImageField(required=False, allow_null=True, write_only=True)
    thumbnailUrlInput = serializers.CharField(
        source="thumbnail_url", allow_blank=True, required=False, write_only=True
    )
    videoUrl = serializers.URLField(source="video_url", allow_null=True, required=False)
    ficheiro = serializers.FileField(required=False, allow_null=True, write_only=True)
    ficheiro_url = serializers.SerializerMethodField()
    createdBy = serializers.CharField(
        source="created_by.username", read_only=True, default=None
    )
    updatedBy = serializers.CharField(
        source="updated_by.username", read_only=True, default=None
    )

    def get_thumbnailUrl(self, obj):
        if obj.thumbnail:
            return obj.thumbnail.url
        return obj.thumbnail_url or None

    def get_ficheiro_url(self, obj):
        if obj.ficheiro:
            return obj.ficheiro.url
        return obj.pdf_url or None

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
            "thumbnailUrl",
            "thumbnailUrlInput",
            "thumbnail",
            "videoUrl",
            "ficheiro",
            "ficheiro_url",
            "publicado",
            "createdBy",
            "updatedBy",
        )
        extra_kwargs = {
            "path": {"required": False, "allow_blank": True},
            "description": {"required": False, "allow_blank": True},
        }


class AulaSerializer(serializers.ModelSerializer):
    """
    Serializer for Aula model.
    """

    subjectId = serializers.CharField(source="subject_id")
    videoUrl = serializers.URLField(source="video_url", allow_null=True, required=False)
    thumbnailUrl = serializers.SerializerMethodField()
    thumbnail = serializers.ImageField(required=False, allow_null=True, write_only=True)
    thumbnailUrlInput = serializers.CharField(
        source="thumbnail_url", allow_blank=True, required=False, write_only=True
    )
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    ficheiro = serializers.FileField(required=False, allow_null=True, write_only=True)
    ficheiro_url = serializers.SerializerMethodField()
    createdBy = serializers.CharField(
        source="created_by.username", read_only=True, default=None
    )
    updatedBy = serializers.CharField(
        source="updated_by.username", read_only=True, default=None
    )

    def get_thumbnailUrl(self, obj):
        if obj.thumbnail:
            return obj.thumbnail.url
        return obj.thumbnail_url or None

    def get_ficheiro_url(self, obj):
        if obj.ficheiro:
            return obj.ficheiro.url
        return None

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
            "thumbnailUrlInput",
            "thumbnail",
            "ficheiro",
            "ficheiro_url",
            "createdAt",
            "publicado",
            "createdBy",
            "updatedBy",
        )
