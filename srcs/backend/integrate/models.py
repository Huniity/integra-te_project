# from django.db import models

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

TIPOS_JOGO = (
    ("online", "Online"),
    ("imprimivel", "Imprimível"),
)


class Disciplina(models.Model):
    """
    Modelo para as disciplinas
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(max_length=200)
    slug = models.SlugField(max_length=500)
    desc = models.CharField(max_length=500)

    def __str__(self):
        """
        Método para retornar o nome da disciplina
        """
        return self.nome


class Tema(models.Model):
    """
    Modelo para os temas
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
        """
        Método para retornar o título do tema
        """
        return self.titulo


class Conteudo(models.Model):
    """
    Modelo para os conteúdos
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
        """
        Método para retornar o título do conteúdo
        """
        return self.titulo


class Jogo(models.Model):
    """
    Modelo para os jogos
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    disciplina = models.ForeignKey(
        Disciplina, on_delete=models.CASCADE, null=True, blank=True
    )
    titulo = models.CharField(max_length=200)
    descricao = models.CharField(max_length=500)
    faixa_etaria = models.CharField(max_length=200)
    url_externa = models.URLField(max_length=500, null=True, blank=True)
    ficheiro = models.FileField(upload_to="jogos/", null=True, blank=True)
    tamanho_kb = models.IntegerField(null=True, blank=True)
    publicado = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """
        Método para retornar o título do jogo
        """
        return self.titulo


class Livro(models.Model):
    """
    Modelo para os livros
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

    """
    falta : temas_list property
    """

    def __str__(self):
        """
        Método para retornar o título do livro
        """
        return self.titulo


class MaterialOriginal(models.Model):
    """
    Modelo para os materiais originais
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
        Método para retornar o título do material original
        """
        return self.titulo
