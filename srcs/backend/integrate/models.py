from django.db import models
import uuid

# Create your models here.

import uuid
from django.db import models


ANO_ESCOLAR = (
    ("1", "1º Ano"),
    ("2", "2º Ano"),
    ("3", "3º Ano"),
    ("4", "4º Ano"),
    ("5", "5º Ano"),
    ("6", "6º Ano"),
)

SECCAO = (
    ("aprender", "Aprender"),
    ("resolver", "Resolver"),
    ("ler", "Ler"),
)

TIPO = (
    ("texto", "Texto"),  # fixed — removed comma inside string
    ("imagem", "Imagem"),
    ("video", "Vídeo"),
    ("pdf", "PDF"),
)

DIFICULDADE = (  # fixed typo
    ("basico", "Básico"),
    ("intermedio", "Intermédio"),
    ("avancado", "Avançado"),
)

TIPOS_JOGO = (
    ("online", "Online"),
    ("imprimivel", "Imprimível"),
)



class Disciplina(models.Model):  # fixed — singular
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    desc = models.TextField(blank=True)

    def __str__(self):
        return self.nome


class Tema(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    disciplina = models.ForeignKey(Disciplina, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200)  # fixed — was missing
    desc = models.TextField(blank=True)
    ano_escolar = models.CharField(max_length=1, choices=ANO_ESCOLAR)
    seccao = models.CharField(max_length=20, choices=SECCAO)
    publicado = models.BooleanField(default=False)

    class Meta:
        unique_together = ("disciplina", "slug", "seccao")

    def __str__(self):
        return self.titulo


class Conteudo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tema = models.ForeignKey(Tema, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=20, choices=TIPO)
    titulo = models.CharField(max_length=200)
    corpo = models.TextField(blank=True)  # fixed — TextField not CharField
    ficheiro = models.FileField(upload_to="conteudos/", null=True, blank=True)
    url_externa = models.URLField(max_length=500, null=True, blank=True)
    thumbnail = models.ImageField(upload_to="thumbnails/", null=True, blank=True)
    dificuldade = models.CharField(
        max_length=20, choices=DIFICULDADE, null=True, blank=True
    )
    descarregavel = models.BooleanField(default=False)
    publicado = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo


class Jogo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    disciplina = models.ForeignKey(
        Disciplina, on_delete=models.SET_NULL, null=True, blank=True
    )
    titulo = models.CharField(max_length=200)
    tipo = models.CharField(
        max_length=20, choices=(("online", "Online"), ("imprimivel", "Imprimível"))
    )
    descricao = models.TextField(blank=True)
    faixa_etaria = models.CharField(max_length=50, blank=True)
    url_externa = models.URLField(max_length=500, null=True, blank=True)
    ficheiro = models.FileField(upload_to="jogos/", null=True, blank=True)
    publicado = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo


class Livro(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titulo = models.CharField(max_length=200)
    autor = models.CharField(max_length=200, blank=True)
    faixa_etaria = models.CharField(max_length=50, blank=True)
    resumo = models.TextField(blank=True)
    temas = models.CharField(max_length=500, blank=True)
    capa = models.ImageField(upload_to="capas/", null=True, blank=True)
    ficheiro = models.FileField(upload_to="livros/", null=True, blank=True)
    publicado = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo


class MaterialOriginal(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titulo = models.CharField(max_length=200)
    autor = models.CharField(max_length=200, blank=True)
    descricao = models.TextField(blank=True)
    ficheiro = models.FileField(upload_to="materiais/", null=True, blank=True)
    url_externa = models.URLField(max_length=500, null=True, blank=True)
    descarregavel = models.BooleanField(default=False)
    publicado = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo
