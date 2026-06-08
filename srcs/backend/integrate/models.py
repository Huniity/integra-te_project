from django.db import models

ANO_ESCOLAR = (
    ("1º Ano", "1º Ano"),
    ("2º Ano", "2º Ano"),
    ("3º Ano", "3º Ano"),
    ("4º Ano", "4º Ano"),
    ("5º Ano", "5º Ano"),
    ("6º Ano", "6º Ano"),
)

SECCAO = (
    ("aprender", "Aprender"),
    ("resolver", "Resolver"),
    ("ler", "Ler"),
)

TIPO = (
    ("texto,", "Texto"),
    ("imagem", "Imagem"),
    ("video", "Vídeo"),
    ("pdf", "PDF"),
)

DIFICUADE = (
    ("basico", "Básico"),
    ("intermedio", "Intermédio"),
    ("avancado", "Avançado"),
)


class Disciplinas(models.Model):
    """
    Modelo para as disciplinas
    """

    id = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=500)
    desc = models.CharField(max_length=500)

    def __str__(self):
        """
        Método para retornar o nome da disciplina
        """
        return self.name


class Tema(models.Model):
    """
    Modelo para os temas
    """

    id = models.UUIDField(primary_key=True)
    disciplina = models.ForeignKey(Disciplinas, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=200)
    desc = models.CharField(max_length=500)
    ano_escolar = models.CharField(max_length=200, choices=ANO_ESCOLAR)
    seccao = models.CharField(max_length=200, choices=SECCAO)

    class Meta:
        unique_together = ("disciplina", "slug", "seccao")

    def __str__(self):
        """
        Método para retornar o título do tema
        """
        return self.titulo


class Conteudo(models.Model):
    """
    Modelo para os conteúdos
    """

    id = models.UUIDField(primary_key=True)
    tema = models.ForeignKey(Tema, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=200, choices=TIPO)
    titulo = models.CharField(max_length=200)
    corpo = models.CharField(max_length=500)
    ficheiro = models.FileField(upload_to="conteudos/", null=True, blank=True)
    url_externa = models.URLField(max_length=500, null=True, blank=True)
    thumbnail = models.ImageField(upload_to="thumbnails/", null=True, blank=True)
    dificuldade = models.CharField(
        max_length=200, choices=DIFICUADE, null=True, blank=True
    )
    descarregavel = models.BooleanField(default=False)
    publicado = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """
        Método para retornar o título do conteúdo
        """
        return self.titulo


class Properties(models.Model):
    """
    Modelo para as propriedades dos conteúdos
    """

    has_file = models.BooleanField(default=False)
    is_video = models.BooleanField(default=False)

    def __str__(self):
        """
        Método para retornar a chave da propriedade
        """
        return self.key
