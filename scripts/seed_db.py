import django
from django.core.files.base import ContentFile
from django.utils import timezone

import os
import sys
from datetime import datetime
from pathlib import Path

from integrate.models import (
    Disciplina,
    Tema,
    Conteudo,
    Jogo,
    Livro,
    MaterialOriginal,
)

# Make Django project importable inside Docker
BACKEND_DIR = Path("/app")
sys.path.insert(0, str(BACKEND_DIR))

# Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")


django.setup()


# Tiny valid 1x1 PNG image
DUMMY_IMAGE = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01"
    b"\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde"
    b"\x00\x00\x00\x0cIDATx\x9cc\xf8\xff\xff?\x00\x05"
    b"\xfe\x02\xfeA\x0d\xa4\xb3\x00\x00\x00\x00IEND\xaeB`\x82"
)


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


def add_image(instance, filename):
    instance.image.save(filename, ContentFile(DUMMY_IMAGE), save=True)


def clear_database():
    print("Deleting old sample events...")

    Disciplina.objects.all().delete()
    Tema.objects.all().delete()
    Conteudo.objects.all().delete()
    Jogo.objects.all().delete()
    Livro.objects.all().delete()
    MaterialOriginal.objects.all().delete()


def seed_database():
    print("Creating sample events...")

    def dt(day, hour, minute=0):
        return timezone.make_aware(datetime(2026, 7, day, hour, minute))

    # ── Disciplinas ──────────────────────────────────────────────────────────────
    Disciplina.objects.bulk_create(
        [
            Disciplina(
                id="1e8b9c3e-9f1a-4c5b-8d2a-1234567890ab",
                nome="Matemática",
                slug="matematica",
                desc="Disciplina de Matemática para o ensino básico e secundário.",
            ),
            Disciplina(
                id="2f9c8d4e-7a2b-4c6d-9e3f-abcdef123456",
                nome="Português",
                slug="portugues",
                desc="Disciplina de Português para o ensino básico e secundário.",
            ),
            Disciplina(
                id="3a7d6e5f-8c9b-4d7e-9f4a-abcdef654321",
                nome="Estudo do Meio",
                slug="estudo-do-meio",
                desc="Disciplina de Estudo do Meio para o ensino básico e secundário.",
            ),
        ]
    )

    Tema.objects.bulk_create(
        [
            Tema(
                id="4b6c5d7e-9f8a-4e7f-8d5b-abcdef789012",
                disciplina_id="1e8b9c3e-9f1a-4c5b-8d2a-1234567890ab",
                titulo="Álgebra",
                slug="algebra",
                desc="Tema de Álgebra dentro da disciplina de Matemática.",
                ano_escolar="5",
                seccao="aprender",
                publicado=True,
            ),
            Tema(
                id="5c7d6e8f-9a0b-4f8e-9f6c-abcdef890123",
                disciplina_id="2f9c8d4e-7a2b-4c6d-9e3f-abcdef123456",
                titulo="Gramática",
                slug="gramatica",
                desc="Tema de Gramática dentro da disciplina de Português.",
                ano_escolar="5",
                seccao="aprender",
                publicado=True,
            ),
            Tema(
                id="6d8e7f9e-0a1b-4e9f-0e7d-abcdef901234",
                disciplina_id="3a7d6e5f-8c9b-4d7e-9f4a-abcdef654321",
                titulo="Ecossistemas",
                slug="ecossistemas",
                desc="Tema de Ecossistemas dentro da disciplina de Estudo do Meio.",
                ano_escolar="5",
                seccao="aprender",
                publicado=True,
            ),
        ]
    )

    Conteudo.objects.bulk_create(
        [
            Conteudo(
                id="7e9f0a1b-2c3d-4e5f-6a7b-abcdef345678",
                tema_id="4b6c5d7e-9f8a-4e7f-8d5b-abcdef789012",
                titulo="Equações Lineares",
                corpo="Conteúdo sobre equações lineares dentro do tema de Álgebra.",
                tipo="texto",
                dificuldade="basico",
                publicado=True,
            ),
            Conteudo(
                id="8f0e9f1a-2a3b-4e1f-2e9f-abcdef123456",
                tema_id="5c7d6e8f-9a0b-4f8e-9f6c-abcdef890123",
                titulo="Classes Gramaticais",
                corpo="Conteúdo sobre classes gramaticais dentro do tema de Gramática.",
                tipo="texto",
                dificuldade="basico",
                publicado=True,
            ),
            Conteudo(
                id="9e1f0a2b-3a4b-4e2f-3e0f-abcdef234567",
                tema_id="6d8e7f9e-0a1b-4e9f-0e7d-abcdef901234",
                titulo="Cadeias Alimentares",
                corpo="Conteúdo sobre cadeias alimentares dentro do tema de Ecossistemas.",
                tipo="texto",
                dificuldade="basico",
                publicado=True,
            ),
        ]
    )

    Livro.objects.bulk_create(
        [
            Livro(
                id="a0b1c2d3-e4f5-4a6b-7c8d-9e0f1a2b3c4d",
                titulo="Introdução à Álgebra",
                autor="Maria Silva",
                faixa_etaria="10-12 anos",
                resumo="Livro introdutório sobre conceitos básicos de álgebra para crianças.",
                temas="Álgebra, Matemática, Equações",
                publicado=True,
            ),
            Livro(
                id="b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e",
                titulo="Gramática Simplificada",
                autor="João Santos",
                faixa_etaria="9-11 anos",
                resumo="Livro sobre gramática portuguesa com exemplos práticos.",
                temas="Português, Gramática, Linguagem",
                publicado=True,
            ),
            Livro(
                id="c2d3e4f5-a6b7-4c8d-9e0f-1a2b3c4d5e6f",
                titulo="A Vida nos Ecossistemas",
                autor="Ana Costa",
                faixa_etaria="10-13 anos",
                resumo="Livro sobre a biodiversidade e cadeias alimentares.",
                temas="Ecossistemas, Natureza, Biologia",
                publicado=True,
            ),
        ]
    )

    MaterialOriginal.objects.bulk_create(
        [
            MaterialOriginal(
                id="d3e4f5a6-b7c8-4d9e-0f1a-2b3c4d5e6f7a",
                titulo="Worksheets de Álgebra",
                autor="Pedro Oliveira",
                descricao="Coleção de exercícios práticos sobre álgebra.",
                url_externa="https://example.com/algebra-worksheets",
                descarregavel=True,
                publicado=True,
            ),
            MaterialOriginal(
                id="e4f5a6b7-c8d9-4e0f-1a2b-3c4d5e6f7a8b",
                titulo="Tabela de Regras Gramaticais",
                autor="Carla Mendes",
                descricao="Guia rápido com regras essenciais de gramática portuguesa.",
                url_externa="https://example.com/gramatica-guia",
                descarregavel=True,
                publicado=True,
            ),
            MaterialOriginal(
                id="f5a6b7c8-d9e0-4f1a-2b3c-4d5e6f7a8b9c",
                titulo="Mapa Interativo de Ecossistemas",
                autor="Hugo Ferreira",
                descricao="Material interativo sobre diferentes ecossistemas do mundo.",
                url_externa="https://example.com/mapa-ecossistemas",
                descarregavel=False,
                publicado=True,
            ),
        ]
    )

    Jogo.objects.bulk_create(
        [
            Jogo(
                id="a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
                disciplina_id="1e8b9c3e-9f1a-4c5b-8d2a-1234567890ab",
                titulo="Jogo de Equações",
                tipo="online",
                descricao="Jogo interativo para aprender a resolver equações lineares.",
                faixa_etaria="10-12 anos",
                url_externa="https://example.com/jogo-equacoes",
                publicado=True,
            ),
            Jogo(
                id="b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
                disciplina_id="2f9c8d4e-7a2b-4c6d-9e3f-abcdef123456",
                titulo="Jogo de Gramática",
                tipo="online",
                descricao="Jogo para praticar classes gramaticais e estrutura de frases.",
                faixa_etaria="9-11 anos",
                url_externa="https://example.com/jogo-gramatica",
                publicado=True,
            ),
            Jogo(
                id="c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
                disciplina_id="3a7d6e5f-8c9b-4d7e-9f4a-abcdef654321",
                titulo="Puzzle de Cadeias Alimentares",
                tipo="imprimivel",
                descricao="Jogo imprimível para montar cadeias alimentares.",
                faixa_etaria="10-13 anos",
                publicado=True,
            ),
        ]
    )


def main():
    clear_database()
    seed_database()
    print("Database populated successfully!")


if __name__ == "__main__":
    main()
