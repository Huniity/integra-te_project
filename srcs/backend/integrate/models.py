from django.db import models
import uuid


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
    ("texto", "Texto"),
    ("imagem", "Imagem"),
    ("video", "Vídeo"),
    ("pdf", "PDF"),
)

DIFICULDADE = (
    ("basico", "Básico"),
    ("intermedio", "Intermédio"),
    ("avancado", "Avançado"),
)


class Disciplina(models.Model):
    """
    Model representing a discipline.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=200)
    slug = models.SlugField(max_length=500)
    desc = models.CharField(max_length=500)

    def __str__(self):
        return self.nome


class Tema(models.Model):
    """
    Model representing a subject theme.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=200)
    desc = models.TextField()
    ano_escolar = models.CharField(max_length=200, choices=ANO_ESCOLAR)
    seccao = models.CharField(max_length=200, choices=SECCAO)
    slug = models.SlugField(max_length=500)

    class Meta:
        unique_together = ("disciplina", "slug", "seccao")

    def __str__(self):
        return self.titulo


class Conteudo(models.Model):
    """
    Model representing content.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tema = models.ForeignKey(Tema, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=200, choices=TIPO)
    titulo = models.CharField(max_length=200)
    corpo = models.TextField()
    ficheiro = models.FileField(upload_to="conteudos/", null=True, blank=True)
    url_externa = models.URLField(max_length=500, null=True, blank=True)
    thumbnail = models.ImageField(upload_to="thumbnails/", null=True, blank=True)
    dificuldade = models.CharField(
        max_length=200, choices=DIFICULDADE, null=True, blank=True
    )
    descarregavel = models.BooleanField(default=False)
    publicado = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo


class Jogo(models.Model):
    """
    Model representing a game.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    disciplina = models.ForeignKey(
        Disciplina, on_delete=models.CASCADE, null=True, blank=True
    )
    titulo = models.CharField(max_length=200)
    descricao = models.CharField(max_length=500)
    faixa_etaria = models.CharField(max_length=200, blank=True)
    subject_id = models.CharField(max_length=200, blank=True)
    level = models.IntegerField(null=True, blank=True)
    thumbnail_url = models.CharField(max_length=500, blank=True)
    video_url = models.URLField(max_length=500, null=True, blank=True)
    url_externa = models.URLField(max_length=500, null=True, blank=True)
    ficheiro = models.FileField(upload_to="jogos/", null=True, blank=True)
    publicado = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo


class Livro(models.Model):
    """
    Model representing a book.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titulo = models.CharField(max_length=200)
    autor = models.CharField(max_length=200)
    faixa_etaria = models.CharField(max_length=200)
    resumo = models.CharField(max_length=1000)
    temas = models.CharField(max_length=500, blank=True)
    capa = models.ImageField(upload_to="capas/", null=True, blank=True)
    ficheiro = models.FileField(upload_to="livros/", null=True, blank=True)
    publicado = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo


class Exercicio(models.Model):
    """
    Model representing an exercise.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    level = models.IntegerField()
    subject_id = models.CharField(max_length=200)
    title_color = models.CharField(max_length=200, default="text-blue-600")
    icon_img = models.CharField(max_length=500, blank=True)
    path = models.CharField(max_length=500, blank=True)
    description = models.TextField(blank=True)
    pdf_url = models.URLField(max_length=500, null=True, blank=True)
    thumbnail_url = models.CharField(max_length=500, blank=True)
    video_url = models.URLField(max_length=500, null=True, blank=True)
    ficheiro = models.FileField(upload_to="exercicios/", null=True, blank=True)
    publicado = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class Aula(models.Model):
    """
    Model representing a lesson.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    subject_id = models.CharField(max_length=200)
    level = models.IntegerField()
    description = models.TextField(blank=True)
    video_url = models.URLField(max_length=500, null=True, blank=True)
    thumbnail_url = models.CharField(max_length=500, blank=True)
    ficheiro = models.FileField(upload_to="aulas/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    publicado = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class MaterialOriginal(models.Model):
    """
    Model representing original material.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titulo = models.CharField(max_length=200)
    autor = models.CharField(max_length=200)
    descricao = models.TextField()
    ficheiro = models.FileField(upload_to="materiais_originais/", null=True, blank=True)
    url_externa = models.URLField(max_length=500, null=True, blank=True)
    descarregavel = models.BooleanField(default=False)
    publicado = models.BooleanField(default=False)

    def __str__(self):
        """
        Return the title of the original material.
        """
        return self.titulo
