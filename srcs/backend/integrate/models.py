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
