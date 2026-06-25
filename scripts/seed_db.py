import os  # noqa
import sys  # noqa
from pathlib import Path  # noqa

import django  # noqa

BACKEND_DIR = Path("/app")  # noqa
sys.path.insert(0, str(BACKEND_DIR))  # noqa
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")  # noqa
django.setup()  # noqa

from integrate.models import (  # noqa
    Disciplina,
    Tema,
    Conteudo,
    Jogo,
    Livro,
    Aula,
    Exercicio,
)


def clear_database():
    print("Deleting old data...")
    Exercicio.objects.all().delete()
    Aula.objects.all().delete()
    Conteudo.objects.all().delete()
    Tema.objects.all().delete()
    Jogo.objects.all().delete()
    Livro.objects.all().delete()
    Disciplina.objects.all().delete()


def seed_database():
    print("Creating sample data...")

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

    # ── Temas ────────────────────────────────────────────────────────────────────
    Tema.objects.bulk_create(
        [
            Tema(
                id="4b6c5d7e-9f8a-4e7f-8d5b-abcdef789012",
                disciplina_id="1e8b9c3e-9f1a-4c5b-8d2a-1234567890ab",
                titulo="Álgebra",
                slug="algebra",
                desc="Tema de Álgebra dentro da disciplina de Matemática.",
                ano_escolar="5º Ano",
                seccao="aprender",
            ),
            Tema(
                id="5c7d6e8f-9a0b-4f8e-9f6c-abcdef890123",
                disciplina_id="2f9c8d4e-7a2b-4c6d-9e3f-abcdef123456",
                titulo="Gramática",
                slug="gramatica",
                desc="Tema de Gramática dentro da disciplina de Português.",
                ano_escolar="5º Ano",
                seccao="aprender",
            ),
            Tema(
                id="6d8e7f9e-0a1b-4e9f-0e7d-abcdef901234",
                disciplina_id="3a7d6e5f-8c9b-4d7e-9f4a-abcdef654321",
                titulo="Ecossistemas",
                slug="ecossistemas",
                desc="Tema de Ecossistemas dentro da disciplina de Estudo do Meio.",
                ano_escolar="5º Ano",
                seccao="aprender",
            ),
        ]
    )

    # ── Conteúdos (texto, vídeo, pdf) ────────────────────────────────────────────
    Conteudo.objects.bulk_create(
        [
            # Texto
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
            # Vídeos (url_externa = YouTube/Vimeo link)
            Conteudo(
                id="aa1f0b2c-4b5c-4f3e-4e1f-abcdef345678",
                tema_id="4b6c5d7e-9f8a-4e7f-8d5b-abcdef789012",
                titulo="Vídeo: Equações Lineares Passo a Passo",
                corpo="",
                tipo="video",
                url_externa="https://www.youtube.com/watch?v=tjih0TnkBUc",
                dificuldade="basico",
                publicado=True,
            ),
            Conteudo(
                id="bb2f0c3d-5c6d-4f4f-5e2f-abcdef456789",
                tema_id="5c7d6e8f-9a0b-4f8e-9f6c-abcdef890123",
                titulo="Vídeo: Classes Gramaticais em 10 Minutos",
                corpo="",
                tipo="video",
                url_externa="https://www.youtube.com/watch?v=tjih0TnkBUc",
                dificuldade="basico",
                publicado=True,
            ),
            Conteudo(
                id="cc3f0d4e-6d7e-4f5f-6e3f-abcdef567890",
                tema_id="6d8e7f9e-0a1b-4e9f-0e7d-abcdef901234",
                titulo="Vídeo: Ecossistemas e Biodiversidade",
                corpo="",
                tipo="video",
                url_externa="https://www.youtube.com/watch?v=tjih0TnkBUc",
                dificuldade="basico",
                publicado=True,
            ),
            # PDFs (descarregáveis)
            Conteudo(
                id="dd4f0e5f-7e8f-4f6f-7e4f-abcdef678901",
                tema_id="4b6c5d7e-9f8a-4e7f-8d5b-abcdef789012",
                titulo="Ficha de Trabalho — Álgebra",
                corpo="",
                tipo="pdf",
                url_externa="https://example.com/pdfs/algebra.pdf",
                dificuldade="basico",
                descarregavel=True,
                publicado=True,
            ),
            Conteudo(
                id="ee5f0f6f-8f9f-4f7f-8e5f-abcdef789012",
                tema_id="5c7d6e8f-9a0b-4f8e-9f6c-abcdef890123",
                titulo="Ficha de Trabalho — Gramática",
                corpo="",
                tipo="pdf",
                url_externa="https://example.com/pdfs/gramatica.pdf",
                dificuldade="basico",
                descarregavel=True,
                publicado=True,
            ),
            Conteudo(
                id="ff6f1f7f-9f0f-4f8f-9e6f-abcdef890123",
                tema_id="6d8e7f9e-0a1b-4e9f-0e7d-abcdef901234",
                titulo="Ficha de Trabalho — Ecossistemas",
                corpo="",
                tipo="pdf",
                url_externa="https://example.com/pdfs/ecossistemas.pdf",
                dificuldade="basico",
                descarregavel=True,
                publicado=True,
            ),
        ]
    )

    # ── Livros ───────────────────────────────────────────────────────────────────
    # faixa_etaria must match frontend filter values: '4-6', '6-9', '9-12'
    Livro.objects.bulk_create(
        [
            Livro(
                id="a0b1c2d3-e4f5-4a6b-7c8d-9e0f1a2b3c4d",
                titulo="Introdução à Álgebra",
                autor="Maria Silva",
                faixa_etaria="9-12",
                resumo="Livro introdutório sobre conceitos básicos de álgebra para crianças.",
                publicado=True,
            ),
            Livro(
                id="b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e",
                titulo="Gramática Simplificada",
                autor="João Santos",
                faixa_etaria="6-9",
                resumo="Livro sobre gramática portuguesa com exemplos práticos.",
                publicado=True,
            ),
            Livro(
                id="c2d3e4f5-a6b7-4c8d-9e0f-1a2b3c4d5e6f",
                titulo="A Vida nos Ecossistemas",
                autor="Ana Costa",
                faixa_etaria="9-12",
                resumo="Livro sobre a biodiversidade e cadeias alimentares.",
                publicado=True,
            ),
            Livro(
                id="d3e4f5a6-b7c8-4d9e-0f1a-2b3c4d5e6f7a",
                titulo="As Aventuras do Ponto e da Vírgula",
                autor="Carla Mendes",
                faixa_etaria="4-6",
                resumo="Uma história divertida sobre pontuação para os mais novos.",
                publicado=True,
            ),
            Livro(
                id="e4f5a6b7-c8d9-4e0f-1a2b-3c4d5e6f7a8b",
                titulo="Contar é Divertido",
                autor="Pedro Oliveira",
                faixa_etaria="4-6",
                resumo="Introdução aos números e contagem para crianças pequenas.",
                publicado=True,
            ),
            Livro(
                id="f5a6b7c8-d9e0-4f1a-2b3c-4d5e6f7a8b9c",
                titulo="O Mundo das Plantas",
                autor="Hugo Ferreira",
                faixa_etaria="6-9",
                resumo="Explora o reino vegetal com ilustrações coloridas.",
                publicado=True,
            ),
        ]
    )

    # ── Jogos ────────────────────────────────────────────────────────────────────
    # faixa_etaria must match frontend filter values: '4-6', '6-9', '9-12'
    Jogo.objects.bulk_create(
        [
            Jogo(
                id="a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
                disciplina_id="1e8b9c3e-9f1a-4c5b-8d2a-1234567890ab",
                titulo="Jogo de Equações",
                descricao="Jogo interativo para aprender a resolver equações lineares.",
                faixa_etaria="9-12",
                url_externa="https://example.com/jogo-equacoes",
                publicado=True,
            ),
            Jogo(
                id="b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
                disciplina_id="2f9c8d4e-7a2b-4c6d-9e3f-abcdef123456",
                titulo="Jogo de Gramática",
                descricao="Jogo para praticar classes gramaticais e estrutura de frases.",
                faixa_etaria="6-9",
                url_externa="https://example.com/jogo-gramatica",
                publicado=True,
            ),
            Jogo(
                id="c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
                disciplina_id="3a7d6e5f-8c9b-4d7e-9f4a-abcdef654321",
                titulo="Puzzle de Cadeias Alimentares",
                descricao="Jogo imprimível para montar cadeias alimentares.",
                faixa_etaria="9-12",
                url_externa="https://example.com/puzzle-cadeias",
                publicado=True,
            ),
            Jogo(
                id="d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a",
                disciplina_id="1e8b9c3e-9f1a-4c5b-8d2a-1234567890ab",
                titulo="Conta Comigo",
                descricao="Jogo de contagem e operações básicas para os mais novos.",
                faixa_etaria="4-6",
                url_externa="https://example.com/conta-comigo",
                publicado=True,
            ),
            Jogo(
                id="e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b",
                disciplina_id="2f9c8d4e-7a2b-4c6d-9e3f-abcdef123456",
                titulo="Sopa de Letras",
                descricao="Encontra palavras escondidas numa grelha de letras.",
                faixa_etaria="6-9",
                url_externa="https://example.com/sopa-letras",
                publicado=True,
            ),
        ]
    )

    # ── Aulas ────────────────────────────────────────────────────────────────────
    Aula.objects.bulk_create(
        [
            Aula(
                title="Introdução às Equações Lineares",
                subject_id="matematica",
                level=1,
                description="Aprende a resolver equações de primeiro grau com exemplos simples.",
                video_url="https://www.youtube.com/watch?v=tjih0TnkBUc",
                publicado=True,
            ),
            Aula(
                title="Sistemas de Equações",
                subject_id="matematica",
                level=2,
                description="Resolução de sistemas de duas equações com duas incógnitas.",
                video_url="https://www.youtube.com/watch?v=tjih0TnkBUc",
                publicado=True,
            ),
            Aula(
                title="Classes de Palavras",
                subject_id="portugues",
                level=1,
                description="Nomes, verbos, adjetivos e advérbios — aprende a identificá-los.",
                video_url="https://www.youtube.com/watch?v=tjih0TnkBUc",
                publicado=True,
            ),
            Aula(
                title="Análise Sintática",
                subject_id="portugues",
                level=2,
                description="Sujeito, predicado e complementos numa frase simples.",
                video_url="https://www.youtube.com/watch?v=tjih0TnkBUc",
                publicado=True,
            ),
            Aula(
                title="Cadeias Alimentares",
                subject_id="estudo-do-meio",
                level=1,
                description="Produtores, consumidores e decompositores no ecossistema.",
                video_url="https://www.youtube.com/watch?v=tjih0TnkBUc",
                publicado=True,
            ),
            Aula(
                title="O Sistema Solar",
                subject_id="estudo-do-meio",
                level=2,
                description="Os planetas, as suas características e as suas órbitas.",
                video_url="https://www.youtube.com/watch?v=tjih0TnkBUc",
                publicado=True,
            ),
        ]
    )

    # ── Exercícios ───────────────────────────────────────────────────────────────
    Exercicio.objects.bulk_create(
        [
            Exercicio(
                title="Equações Simples",
                subject_id="matematica",
                level=1,
                description="Resolve equações de primeiro grau com uma incógnita.",
                pdf_url="https://example.com/pdfs/equacoes-simples.pdf",
                publicado=True,
            ),
            Exercicio(
                title="Frações e Decimais",
                subject_id="matematica",
                level=2,
                description="Converte frações em decimais e resolve operações mistas.",
                pdf_url="https://example.com/pdfs/fracoes-decimais.pdf",
                publicado=True,
            ),
            Exercicio(
                title="Geometria — Áreas e Perímetros",
                subject_id="matematica",
                level=3,
                description="Calcula áreas e perímetros de figuras geométricas planas.",
                pdf_url="https://example.com/pdfs/geometria.pdf",
                publicado=True,
            ),
            Exercicio(
                title="Compreensão de Texto",
                subject_id="portugues",
                level=1,
                description="Lê o texto e responde às perguntas de interpretação.",
                pdf_url="https://example.com/pdfs/compreensao-texto.pdf",
                publicado=True,
            ),
            Exercicio(
                title="Ortografia e Acentuação",
                subject_id="portugues",
                level=2,
                description="Exercícios de ortografia com as regras de acentuação.",
                pdf_url="https://example.com/pdfs/ortografia.pdf",
                publicado=True,
            ),
            Exercicio(
                title="Os Animais e o seu Habitat",
                subject_id="estudo-do-meio",
                level=1,
                description="Associa cada animal ao seu habitat natural.",
                pdf_url="https://example.com/pdfs/animais-habitat.pdf",
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
