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
    print("A eliminar dados antigos...")
    Exercicio.objects.all().delete()
    Aula.objects.all().delete()
    Conteudo.objects.all().delete()
    Tema.objects.all().delete()
    Jogo.objects.all().delete()
    Livro.objects.all().delete()
    Disciplina.objects.all().delete()


def seed_database():
    print("A criar dados reais para o 2º Ciclo (Portugal)...")

    # ── Disciplinas ──────────────────────────────────────────────────────────────
    matematica = Disciplina.objects.create(
        id="1e8b9c3e-9f1a-4c5b-8d2a-1234567890ab",
        nome="Matemática",
        slug="matematica",
        desc="Matemática para o 2º Ciclo (5º e 6º anos). Foco no desenvolvimento do raciocínio numérico, geométrico e algébrico.",
    )
    portugues = Disciplina.objects.create(
        id="2f9c8d4e-7a2b-4c6d-9e3f-abcdef123456",
        nome="Português",
        slug="portugues",
        desc="Português para o 2º Ciclo. Domínios da Leitura, Escrita, Gramática e Educação Literária segundo as Metas Curriculares.",
    )
    ciencias = Disciplina.objects.create(
        id="3a7d6e5f-8c9b-4d7e-9f4a-abcdef654321",
        nome="Ciências Naturais",
        slug="ciencias-naturais",
        desc="Ciências Naturais para o 2º Ciclo. Estudo da biodiversidade, ecossistemas, solo, água e processos vitais do corpo humano.",
    )

    # ── Temas ────────────────────────────────────────────────────────────────────
    # MATEMÁTICA
    t_num_operacoes = Tema.objects.create(
        id="4b6c5d7e-9f8a-4e7f-8d5b-abcdef789012",
        disciplina=matematica,
        titulo="Números e Operações",
        desc="Estudo de números naturais, primos e compostos, frações, dízimas, múltiplos e divisores.",
        ano_escolar="5º Ano",
        seccao="aprender",
        slug="numeros-e-operacoes",
    )
    t_geometria = Tema.objects.create(
        id="0a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
        disciplina=matematica,
        titulo="Geometria e Medida",
        desc="Áreas de figuras planas, perímetros, volumes de prismas e classificação de ângulos.",
        ano_escolar="6º Ano",
        seccao="aprender",
        slug="geometria-e-medida",
    )
    t_algebra = Tema.objects.create(
        id="1b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e",
        disciplina=matematica,
        titulo="Álgebra e Funções",
        desc="Sequências numéricas, propriedades de regularidade e introdução às equações do 1º grau.",
        ano_escolar="6º Ano",
        seccao="aprender",
        slug="algebra-e-funcoes",
    )
    t_dados = Tema.objects.create(
        id="7e8f9a0b-1c2d-4e3f-9a0b-1c2d3e4f5a6b",
        disciplina=matematica,
        titulo="Organização e Tratamento de Dados",
        desc="Leitura e construção de gráficos, e cálculo de medidas de tendência central como a média e a moda.",
        ano_escolar="5º Ano",
        seccao="aprender",
        slug="organizacao-e-tratamento-de-dados",
    )

    # PORTUGUÊS
    t_gramatica = Tema.objects.create(
        id="5c7d6e8f-9a0b-4f8e-9f6c-abcdef890123",
        disciplina=portugues,
        titulo="Gramática e Sintaxe",
        desc="Classes de palavras (nomes, verbos, determinantes) e funções sintáticas da frase.",
        ano_escolar="5º Ano",
        seccao="aprender",
        slug="gramatica-e-sintaxe",
    )
    t_literatura = Tema.objects.create(
        id="2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f",
        disciplina=portugues,
        titulo="Educação Literária",
        desc="Estudo e interpretação de contos tradicionais e obras recomendadas pelo PNL.",
        ano_escolar="6º Ano",
        seccao="aprender",
        slug="educacao-literaria",
    )

    # CIÊNCIAS NATURAIS
    t_ecossistemas = Tema.objects.create(
        id="6d8e7f9e-0a1b-4e9f-0e7d-abcdef901234",
        disciplina=ciencias,
        titulo="Ecossistemas e Biodiversidade",
        desc="Interações bióticas e abióticas, teias alimentares e proteção das espécies em Portugal.",
        ano_escolar="5º Ano",
        seccao="aprender",
        slug="ecossistemas-e-biodiversidade",
    )
    t_corpo_humano = Tema.objects.create(
        id="3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a",
        disciplina=ciencias,
        titulo="Processos Vitais no Organismo Humano",
        desc="Anatomia e fisiologia dos sistemas digestivo, respiratório, circulatório e excretor.",
        ano_escolar="6º Ano",
        seccao="aprender",
        slug="processos-vitais-humano",
    )

    # ── Conteúdos em Texto, Vídeos e PDFs ──────────────────────────────────────
    Conteudo.objects.bulk_create(
        [
            # --- TEXTO ---
            Conteudo(
                tema=t_num_operacoes,
                tipo="texto",
                titulo="Critérios de Divisibilidade por 3 e por 9",
                corpo="Um número inteiro é divisível por 3 se a soma de todos os seus algarismos resultar num múltiplo de 3. Da mesma forma, é divisível por 9 se a soma dos seus algarismos for um múltiplo de 9. Exemplo: No número 243, somamos 2 + 4 + 3 = 9. Como 9 é múltiplo de 3 e de 9, o número 243 divide-se exatamente por ambos.",
                dificuldade="basico",
                publicado=True,
            ),
            Conteudo(
                tema=t_gramatica,
                tipo="texto",
                titulo="Funções Sintáticas: O Complemento Direto e Indireto",
                corpo="O Complemento Direto (CD) responde à pergunta 'O quê?' ou 'Quem?' feita ao verbo. Exemplo: 'O João leu o livro.' (leu o quê? -> o livro). O Complemento Indireto (CI) responde à pergunta 'A quem?' ou 'Para quem?'. Exemplo: 'O João deu um presente à mãe.' (deu a quem? -> à mãe).",
                dificuldade="intermedio",
                publicado=True,
            ),
            Conteudo(
                tema=t_ecossistemas,
                tipo="texto",
                titulo="Produtores, Consumidores e Decompositores",
                corpo="Num ecossistema, os seres vivos dividem-se conforme a obtenção de energia: 1) Produtores: Seres autotróficos que produzem o seu próprio alimento via fotossíntese (plantas e algas). 2) Consumidores: Seres heterotróficos que se alimentam de outros seres vivos (herbívoros e carnívoros). 3) Decompositores: Reciclam a matéria orgânica transformando-a em sais minerais (fungos e bactérias).",
                dificuldade="basico",
                publicado=True,
            ),
            Conteudo(
                tema=t_corpo_humano,
                tipo="texto",
                titulo="A Digestão Química na Boca, Estômago e Intestino",
                corpo="A digestão desdobra os alimentos em nutrientes: Na boca, a amilase salivar digere o amido. No estômago, o suco gástrico (ácido clorídrico e pepsina) foca-se nas proteínas. No intestino delgado, a bílis (vinda do fígado) emulsiona as gorduras, enquanto os sucos pancreático e intestinal completam a transformação em quilo.",
                dificuldade="avancado",
                publicado=True,
            ),
            Conteudo(
                tema=t_dados,
                tipo="texto",
                titulo="Média, Moda e Amplitude: Resumir um Conjunto de Dados",
                corpo="Para resumir um conjunto de dados usamos três medidas principais. A média aritmética obtém-se somando todos os valores e dividindo pelo número de valores. A moda é o valor que ocorre com mais frequência. A amplitude é a diferença entre o maior e o menor valor, e dá-nos uma ideia da dispersão dos dados. Exemplo: nas notas 12, 14, 14, 16, 18, a média é (12+14+14+16+18)/5 = 14.8; a moda é 14; a amplitude é 18-12 = 6.",
                dificuldade="basico",
                publicado=True,
            ),
            Conteudo(
                tema=t_literatura,
                tipo="texto",
                titulo="Contos Tradicionais: Estrutura e Valores",
                corpo="Os contos tradicionais portugueses transmitem-se de geração em geração e seguem normalmente uma estrutura simples: situação inicial, um problema ou desafio, peripécias e um desfecho que restabelece o equilíbrio. Muitos incluem elementos fantásticos (fadas, animais que falam, objetos mágicos) e veiculam valores como a coragem, a honestidade e a generosidade. Ao analisares um conto tradicional, identifica sempre estes elementos e reflete sobre a lição ou moral que a história transmite.",
                dificuldade="intermedio",
                publicado=True,
            ),
            Conteudo(
                tema=t_geometria,
                tipo="texto",
                titulo="Diferença entre Área e Perímetro",
                corpo="O perímetro corresponde à medida do contorno de uma figura geométrica plana (soma de todos os seus lados). A área corresponde à medida da superfície interna delimitada por esse contorno. Unidades típicas: o perímetro mede-se em metros (m) ou centímetros (cm), enquanto a área usa metros quadrados (m²) ou centímetros quadrados (cm²).",
                dificuldade="basico",
                publicado=True,
            ),
            # --- VÍDEOS (YouTube, links reais verificados) ---
            Conteudo(
                tema=t_algebra,
                tipo="video",
                titulo="Vídeo: Equações Lineares - introdução",
                corpo="Aula sobre equações lineares: incógnitas, organização de termos e resolução passo a passo. O vídeo avança também para sistemas lineares, podendo ser usado por partes conforme o nível da turma.",
                url_externa="https://www.youtube.com/watch?v=o7eM1cIErYU",
                dificuldade="intermedio",
                publicado=True,
            ),
            Conteudo(
                tema=t_ecossistemas,
                tipo="video",
                titulo="Vídeo: O que são cadeias alimentares?",
                corpo="Aula de revisão sobre produtores, consumidores, decompositores, níveis tróficos e sentido das setas numa cadeia alimentar.",
                url_externa="https://www.youtube.com/watch?v=H85bQekIelc",
                dificuldade="basico",
                publicado=True,
            ),
            Conteudo(
                tema=t_corpo_humano,
                tipo="video",
                titulo="Vídeo: Sistema Digestivo",
                corpo="O Troll explica o percurso dos alimentos pelo sistema digestivo, da boca ao intestino, de forma simples e visual.",
                url_externa="https://www.youtube.com/watch?v=gcGMM4LxiOY",
                dificuldade="basico",
                publicado=True,
            ),
            Conteudo(
                tema=t_corpo_humano,
                tipo="video",
                titulo="Vídeo: Sistema Respiratório",
                corpo="O Troll explica o trajeto do ar desde as fossas nasais até aos pulmões e a função das trocas gasosas.",
                url_externa="https://www.youtube.com/watch?v=s0qMNqBulVY",
                dificuldade="basico",
                publicado=True,
            ),
            Conteudo(
                tema=t_corpo_humano,
                tipo="video",
                titulo="Vídeo: Sistema Circulatório",
                corpo="O Troll explica como o coração bombeia o sangue através dos vasos sanguíneos por todo o corpo.",
                url_externa="https://www.youtube.com/watch?v=woQ3fJfWL5g",
                dificuldade="basico",
                publicado=True,
            ),
            Conteudo(
                tema=t_corpo_humano,
                tipo="video",
                titulo="Vídeo: Sistema Excretor",
                corpo="O Troll explica como os rins filtram o sangue e como se forma a urina no sistema urinário.",
                url_externa="https://www.youtube.com/watch?v=r_wLndqXVnE",
                dificuldade="basico",
                publicado=True,
            ),
            # --- PDFS (Provas de Aferição oficiais do IAVE, ficheiros reais em staticfiles/media/pdfs/) ---
            Conteudo(
                tema=t_num_operacoes,
                tipo="pdf",
                titulo="Prova de Aferição: Matemática (2023)",
                corpo="Prova de Aferição oficial do IAVE (Instituto de Avaliação Educativa), com questões reais de Matemática para o 2º Ciclo. Inclui critérios de correção.",
                url_externa="/media/pdfs/prova-afericao-matematica-2023.pdf",
                dificuldade="intermedio",
                descarregavel=True,
                publicado=True,
            ),
            Conteudo(
                tema=t_geometria,
                tipo="pdf",
                titulo="Prova de Aferição: Matemática e Ciências Naturais",
                corpo="Prova de Aferição oficial do IAVE combinando Matemática e Ciências Naturais, com exercícios reais usados em escolas portuguesas.",
                url_externa="/media/pdfs/prova-afericao-matematica-ciencias-5ano.pdf",
                dificuldade="avancado",
                descarregavel=True,
                publicado=True,
            ),
            Conteudo(
                tema=t_gramatica,
                tipo="pdf",
                titulo="Prova de Aferição: Português e Estudo do Meio",
                corpo="Prova de Aferição oficial do IAVE combinando Português e Estudo do Meio, com textos e questões reais de interpretação e gramática.",
                url_externa="/media/pdfs/prova-afericao-portugues-estudo-do-meio.pdf",
                dificuldade="intermedio",
                descarregavel=True,
                publicado=True,
            ),
        ]
    )

    # ── Livros (15 obras reais da literatura infantojuvenil portuguesa) ────────
    Livro.objects.bulk_create(
        [
            Livro(
                titulo="O Cavaleiro da Dinamarca",
                autor="Sophia de Mello Breyner Andresen",
                faixa_etaria="9-12",
                resumo="A jornada de um cavaleiro que viaja da Dinamarca à Palestina, regressando na noite de Natal.",
                publicado=True,
            ),
            Livro(
                titulo="A Menina do Mar",
                autor="Sophia de Mello Breyner Andresen",
                faixa_etaria="6-9",
                resumo="A belíssima amizade entre um rapaz que vive em terra e uma menina do mundo submarino.",
                publicado=True,
            ),
            Livro(
                titulo="O Principezinho",
                autor="Antoine de Saint-Exupéry",
                faixa_etaria="6-9",
                resumo="As lições sobre amizade, amor e humanidade dadas por um pequeno príncipe que habita o Asteroide B-612.",
                publicado=True,
            ),
            Livro(
                titulo="História de uma Gaivota e do Gato que a Ensinou a Voar",
                autor="Luis Sepúlveda",
                faixa_etaria="4-6",
                resumo="Zorbas, um gato grande, preto e gordo, assume a promessa de criar uma pequena cria de gaivota órfã.",
                publicado=True,
            ),
            Livro(
                titulo="Rosa, Minha Irmã Rosa",
                autor="Alice Vieira",
                faixa_etaria="4-6",
                resumo="A história de Mariana e os seus ciúmes e adaptação face à chegada da sua nova irmã bebé, Rosa.",
                publicado=True,
            ),
            Livro(
                titulo="Chocolate à Chuva",
                autor="Alice Vieira",
                faixa_etaria="9-12",
                resumo="A pré-adolescência de Mariana e os dilemas escolares, familiares e amizades na Lisboa dos anos 80/90.",
                publicado=True,
            ),
            Livro(
                titulo="A Maior Flor do Mundo",
                autor="José Saramago",
                faixa_etaria="4-6",
                resumo="Um conto infantil do Nobel português que exalta o heroísmo das crianças e a proteção da natureza.",
                publicado=True,
            ),
            Livro(
                titulo="Os Piratas",
                autor="Manuel António Pina",
                faixa_etaria="6-9",
                resumo="Uma narrativa fantástica e teatral onde a infância e o imaginário marítimo se cruzam de forma genial.",
                publicado=True,
            ),
            Livro(
                titulo="O Segredo do Rio",
                autor="Miguel Sousa Tavares",
                faixa_etaria="6-9",
                resumo="A amizade invulgar entre um rapaz do campo e uma carpa que vive num rio límpido e escondido.",
                publicado=True,
            ),
            Livro(
                titulo="A Saga de Hans",
                autor="Sophia de Mello Breyner Andresen",
                faixa_etaria="9-12",
                resumo="Um conto literário focado no desejo de liberdade e na paixão pelos mares e navegação.",
                publicado=True,
            ),
            Livro(
                titulo="Grau Minusculo",
                autor="Alves Redol",
                faixa_etaria="9-12",
                resumo="Clássico da literatura portuguesa focado nas realidades rurais sob o olhar de uma criança.",
                publicado=True,
            ),
            Livro(
                titulo="O Tubarão na Banheira",
                autor="David Machado",
                faixa_etaria="4-6",
                resumo="Uma divertida história sobre a imaginação de um rapaz que decide abrigar um predador do mar em casa.",
                publicado=True,
            ),
            Livro(
                titulo="Contos Tradicionais Portugueses",
                autor="Teófilo Braga",
                faixa_etaria="6-9",
                resumo="Compilação de fábulas e narrativas do folclore nacional, essenciais para a Educação Literária.",
                publicado=True,
            ),
            Livro(
                titulo="A Viagem do Elefante (Adaptada)",
                autor="José Saramago",
                faixa_etaria="9-12",
                resumo="As peripécias de Salomão, um elefante oferecido pelo rei D. João III ao Arquiduque Máximo da Áustria.",
                publicado=True,
            ),
            Livro(
                titulo="Manolito Gafotas",
                autor="Elvira Lindo",
                faixa_etaria="4-6",
                resumo="As hilariantes aventuras urbanas de um rapaz de óculos grandes e o seu quotidiano em família.",
                publicado=True,
            ),
        ]
    )

    # ── Jogos: 15 atividades, ligadas a categorias reais e verificadas do Wordwall ──
    # Wordwall (wordwall.net) é uma plataforma real internacional de jogos/quizzes
    # criados por professores. Não há um jogo individual estável por tópico, por
    # isso usamos a página de categoria real (pt-pt) de cada disciplina — verificado
    # com curl que cada URL responde 200.
    WW_MATEMATICA = "https://wordwall.net/pt-pt/community/matem%C3%A1tica/6%C2%BA"
    WW_PORTUGUES = "https://wordwall.net/pt-pt/community/portugu%C3%AAs/6%C2%BA-ano"
    WW_ESTUDO_DO_MEIO = "https://wordwall.net/pt-pt/community/estudo-meio"

    Jogo.objects.bulk_create(
        [
            Jogo(
                disciplina=matematica,
                titulo="Múltiplos e divisores",
                descricao="Escolhe a resposta correta em desafios sobre múltiplos, divisores, números primos, M.D.C. e m.m.c.",
                faixa_etaria="4-6",
                subject_id="matematica",
                level=1,
                url_externa=WW_MATEMATICA,
                publicado=True,
            ),
            Jogo(
                disciplina=matematica,
                titulo="Frações equivalentes",
                descricao="Compara, simplifica e identifica frações equivalentes em quizzes interativos.",
                faixa_etaria="4-6",
                subject_id="matematica",
                level=1,
                url_externa=WW_MATEMATICA,
                publicado=True,
            ),
            Jogo(
                disciplina=matematica,
                titulo="Ângulos e triângulos",
                descricao="Classifica ângulos e usa propriedades básicas dos triângulos.",
                faixa_etaria="6-9",
                subject_id="matematica",
                level=1,
                url_externa=WW_MATEMATICA,
                publicado=True,
            ),
            Jogo(
                disciplina=matematica,
                titulo="Equações simples",
                descricao="Resolve equações curtas usando operações inversas.",
                faixa_etaria="6-9",
                subject_id="matematica",
                level=2,
                url_externa=WW_MATEMATICA,
                publicado=True,
            ),
            Jogo(
                disciplina=matematica,
                titulo="Áreas, perímetros e volumes",
                descricao="Aplica fórmulas essenciais em situações rápidas e visuais.",
                faixa_etaria="9-12",
                subject_id="matematica",
                level=2,
                url_externa=WW_MATEMATICA,
                publicado=True,
            ),
            Jogo(
                disciplina=portugues,
                titulo="Classes de palavras",
                descricao="Identifica nomes, verbos, adjetivos, determinantes e pronomes.",
                faixa_etaria="4-6",
                subject_id="portugues",
                level=1,
                url_externa=WW_PORTUGUES,
                publicado=True,
            ),
            Jogo(
                disciplina=portugues,
                titulo="Funções sintáticas",
                descricao="Distingue sujeito, predicado e complementos em frases simples.",
                faixa_etaria="9-12",
                subject_id="portugues",
                level=2,
                url_externa=WW_PORTUGUES,
                publicado=True,
            ),
            Jogo(
                disciplina=portugues,
                titulo="Verbos e tempos verbais",
                descricao="Reconhece presente, passado e futuro do indicativo.",
                faixa_etaria="4-6",
                subject_id="portugues",
                level=1,
                url_externa=WW_PORTUGUES,
                publicado=True,
            ),
            Jogo(
                disciplina=portugues,
                titulo="Pontuação e discurso",
                descricao="Escolhe sinais de pontuação e formas de introduzir falas.",
                faixa_etaria="6-9",
                subject_id="portugues",
                level=1,
                url_externa=WW_PORTUGUES,
                publicado=True,
            ),
            Jogo(
                disciplina=portugues,
                titulo="O Cavaleiro da Dinamarca",
                descricao="Revê personagens, viagem, promessa e temas centrais da obra.",
                faixa_etaria="9-12",
                subject_id="portugues",
                level=2,
                url_externa=WW_PORTUGUES,
                publicado=True,
            ),
            Jogo(
                disciplina=ciencias,
                titulo="Relações bióticas e cadeias alimentares",
                descricao="Classifica relações e identifica níveis tróficos.",
                faixa_etaria="6-9",
                subject_id="estudo-do-meio",
                level=1,
                url_externa=WW_ESTUDO_DO_MEIO,
                publicado=True,
            ),
            Jogo(
                disciplina=ciencias,
                titulo="Sistema digestivo",
                descricao="Ordena órgãos e reconhece funções da digestão.",
                faixa_etaria="9-12",
                subject_id="estudo-do-meio",
                level=2,
                url_externa=WW_ESTUDO_DO_MEIO,
                publicado=True,
            ),
            Jogo(
                disciplina=ciencias,
                titulo="Sistema respiratório",
                descricao="Segue o trajeto do ar e compreende a hematose pulmonar.",
                faixa_etaria="9-12",
                subject_id="estudo-do-meio",
                level=2,
                url_externa=WW_ESTUDO_DO_MEIO,
                publicado=True,
            ),
            Jogo(
                disciplina=ciencias,
                titulo="Roda dos Alimentos",
                descricao="Relaciona grupos alimentares, nutrientes e escolhas equilibradas.",
                faixa_etaria="4-6",
                subject_id="estudo-do-meio",
                level=1,
                url_externa=WW_ESTUDO_DO_MEIO,
                publicado=True,
            ),
            Jogo(
                disciplina=ciencias,
                titulo="Fotossíntese e plantas",
                descricao="Identifica matérias-primas, produtos e condições da fotossíntese.",
                faixa_etaria="6-9",
                subject_id="estudo-do-meio",
                level=1,
                url_externa=WW_ESTUDO_DO_MEIO,
                publicado=True,
            ),
        ]
    )

    # ── Aulas (vídeos reais verificados + aulas completas em texto) ─────────────
    # Aulas sem vídeo usam video_url="". A descrição contém matéria suficiente
    # para funcionar como uma pequena aula autónoma dentro da plataforma.
    # As 3 marcadas "VÍDEO + PDF" demonstram que uma Aula pode ter os dois ao
    # mesmo tempo (campo `ficheiro`, que aponta para um PDF real em /media/pdfs/).
    Aula.objects.bulk_create(
        [
            # MATEMÁTICA
            Aula(
                title="Introdução às Equações do 1.º Grau",
                subject_id="matematica",
                level=2,
                description=(
                    "VÍDEO + PDF. Uma equação é uma igualdade que contém um valor desconhecido, "
                    "representado normalmente por x. Resolver a equação significa descobrir o valor que torna a igualdade verdadeira. "
                    "Princípio fundamental: tudo o que se faz num membro deve ser feito no outro. Exemplo: x + 7 = 15. "
                    "Subtraímos 7 aos dois membros e obtemos x = 8. Confirmação: 8 + 7 = 15. "
                    "Outro exemplo mais complexo: 3x - 4 = 11. Primeiro somamos 4 a ambos os membros: 3x = 15. "
                    "Depois dividimos ambos os membros por 3: x = 5. Verificação: 3 × 5 - 4 = 15 - 4 = 11. "
                    "Na aula, começa por identificar a incógnita, simplifica cada membro, isola a incógnita e verifica a solução. "
                    "O vídeo introduz equações lineares e sistemas, e o PDF em anexo é uma Prova de Aferição oficial do IAVE com "
                    "exercícios reais de matemática para praticares o que aprendeste."
                ),
                video_url="https://www.youtube.com/watch?v=o7eM1cIErYU",
                ficheiro="pdfs/prova-afericao-matematica-2023.pdf",
                publicado=True,
            ),
            Aula(
                title="Frações: significado, equivalência e simplificação",
                subject_id="matematica",
                level=1,
                description=(
                    "AULA EM TEXTO. Uma fração representa uma ou mais partes iguais de uma unidade. O numerador indica quantas partes "
                    "foram consideradas e o denominador indica em quantas partes iguais a unidade foi dividida. Frações equivalentes "
                    "representam a mesma quantidade: 1/2 = 2/4 = 3/6. Para obter uma fração equivalente, multiplica ou divide o numerador "
                    "e o denominador pelo mesmo número diferente de zero. Simplificar é escrever a fração equivalente com termos menores. "
                    "Exemplo: 12/18 divide-se por 6 e fica 2/3. Para comparar frações com o mesmo denominador, compara diretamente os "
                    "numeradores: quanto maior o numerador, maior a fração. Para comparar frações com denominadores diferentes, "
                    "reduz primeiro ao mesmo denominador através do mínimo múltiplo comum. Pratica também a conversão entre frações "
                    "impróprias e números mistos: 7/3 corresponde a 2 inteiros e 1/3."
                ),
                video_url="",
                publicado=True,
            ),
            Aula(
                title="Múltiplos, divisores, números primos, M.D.C. e m.m.c.",
                subject_id="matematica",
                level=1,
                description=(
                    "AULA EM TEXTO. Os múltiplos de um número obtêm-se multiplicando-o por números naturais. Os divisores dividem um número "
                    "sem deixar resto. Um número primo tem exatamente dois divisores: 1 e o próprio número. Para calcular o M.D.C., procura "
                    "o maior divisor comum; para o m.m.c., procura o menor múltiplo comum diferente de zero. Exemplo: divisores de 12: "
                    "1, 2, 3, 4, 6 e 12; divisores de 18: 1, 2, 3, 6, 9 e 18; logo M.D.C.(12,18)=6. Usa o M.D.C. em problemas "
                    "de agrupamento (por exemplo, repartir 12 lápis e 18 cadernos em grupos iguais sem sobrar nada) e o m.m.c. em "
                    "acontecimentos que se repetem periodicamente (por exemplo, dois autocarros que partem da mesma estação a cada "
                    "12 e 18 minutos, respetivamente — voltam a partir juntos de 36 em 36 minutos)."
                ),
                video_url="",
                publicado=True,
            ),
            Aula(
                title="Áreas e perímetros de figuras planas",
                subject_id="matematica",
                level=1,
                description=(
                    "AULA EM TEXTO. O perímetro mede o contorno e obtém-se somando os comprimentos dos lados. A área mede a superfície interior. "
                    "Retângulo: A = comprimento × largura. Quadrado: A = lado × lado. Triângulo: A = base × altura ÷ 2. Paralelogramo: "
                    "A = base × altura. As unidades de perímetro são lineares, como cm e m; as unidades de área são quadradas, como cm² e m². "
                    "Exemplo: um triângulo com base 8 cm e altura 5 cm tem área 20 cm². Exemplo de perímetro: um retângulo com 6 cm de "
                    "comprimento e 4 cm de largura tem perímetro 2 × (6+4) = 20 cm. Não confundas as duas grandezas: dois retângulos "
                    "podem ter o mesmo perímetro e áreas diferentes, dependendo de como as medidas se distribuem entre comprimento e largura."
                ),
                video_url="",
                publicado=True,
            ),
            Aula(
                title="Volumes de cubos e prismas retangulares",
                subject_id="matematica",
                level=2,
                description=(
                    "AULA EM TEXTO. O volume mede o espaço ocupado por um sólido. Num prisma retangular, V = comprimento × largura × altura. "
                    "Num cubo, V = lado³. Exemplo: uma caixa com 6 cm de comprimento, 4 cm de largura e 3 cm de altura tem volume "
                    "6 × 4 × 3 = 72 cm³. Distingue volume de capacidade: 1 dm³ corresponde a 1 litro. Antes de calcular, confirma que todas "
                    "as medidas estão na mesma unidade — se uma medida estiver em metros e outra em centímetros, converte primeiro. "
                    "Pratica também o cálculo inverso: se conheceres o volume e duas dimensões, divide para encontrar a terceira."
                ),
                video_url="",
                publicado=True,
            ),
            Aula(
                title="Proporcionalidade direta e constante de proporcionalidade",
                subject_id="matematica",
                level=2,
                description=(
                    "AULA EM TEXTO. Duas grandezas são diretamente proporcionais quando, ao multiplicar uma por um número, a outra é multiplicada "
                    "pelo mesmo número. A razão y/x mantém-se constante. Exemplo: se 3 cadernos custam 6 euros, cada caderno custa 2 euros; "
                    "logo 5 cadernos custam 10 euros. Organiza os dados numa tabela, calcula a constante de proporcionalidade e usa-a para encontrar "
                    "valores desconhecidos. Nem toda relação que aumenta é proporcional: a razão tem de permanecer constante — por exemplo, a "
                    "idade de uma pessoa e a sua altura aumentam ambas com o tempo, mas não são diretamente proporcionais."
                ),
                video_url="",
                publicado=True,
            ),
            Aula(
                title="Média aritmética, moda e amplitude",
                subject_id="matematica",
                level=1,
                description=(
                    "AULA EM TEXTO. A média aritmética calcula-se somando todos os valores e dividindo pelo número de valores. A moda é o valor "
                    "mais frequente. A amplitude é a diferença entre o maior e o menor valor. Exemplo: 4, 6, 6, 8. Média = 24 ÷ 4 = 6; "
                    "moda = 6; amplitude = 8 − 4 = 4. Usa estas medidas para resumir conjuntos de dados, mas observa sempre se existem valores "
                    "muito afastados (outliers) que possam distorcer a média — nesses casos, a moda pode ser uma medida mais representativa."
                ),
                video_url="",
                publicado=True,
            ),
            # PORTUGUÊS
            Aula(
                title="Classes de palavras: nome, adjetivo, determinante e pronome",
                subject_id="portugues",
                level=1,
                description=(
                    "AULA EM TEXTO. O nome designa seres, objetos, lugares, sentimentos ou ideias. O adjetivo atribui características ao nome. "
                    "O determinante surge antes do nome e ajuda a identificá-lo; o pronome substitui ou acompanha um nome para evitar repetições. "
                    "Na frase 'Aquela menina simpática trouxe o seu livro', menina e livro são nomes, aquela e o seu são determinantes e simpática "
                    "é adjetivo. Reescreve frases substituindo grupos nominais por pronomes adequados, evitando repetições desnecessárias num texto."
                ),
                video_url="",
                publicado=True,
            ),
            Aula(
                title="Verbos: pessoa, número, tempo e modo",
                subject_id="portugues",
                level=1,
                description=(
                    "AULA EM TEXTO. O verbo exprime ação, estado ou acontecimento. Varia em pessoa, número, tempo e modo. No modo indicativo, "
                    "o presente apresenta factos atuais ou habituais; o pretérito perfeito apresenta ações concluídas; o pretérito imperfeito "
                    "apresenta ações habituais ou prolongadas no passado; o futuro apresenta ações posteriores. Exemplo: eu estudo, nós estudámos, "
                    "eles estudavam, tu estudarás. Identifica primeiro o infinitivo e depois os valores de cada forma verbal, prestando atenção "
                    "especial aos verbos irregulares como 'ser', 'ter' e 'ir'."
                ),
                video_url="",
                publicado=True,
            ),
            Aula(
                title="Sujeito e predicado: identificação e tipos de sujeito",
                subject_id="portugues",
                level=2,
                description=(
                    "AULA EM TEXTO. O sujeito é o elemento sobre o qual se declara alguma coisa; o predicado contém aquilo que se diz acerca do sujeito. "
                    "O sujeito pode ser simples, composto ou nulo. Exemplo: 'A Ana chegou cedo' tem sujeito simples; 'A Ana e o Rui chegaram cedo' "
                    "tem sujeito composto; 'Chegámos cedo' tem sujeito nulo subentendido: nós. Para identificar o sujeito, localiza o verbo e pergunta "
                    "quem pratica a ação ou de quem se fala, tendo atenção aos verbos impessoais como 'chover', que não têm sujeito."
                ),
                video_url="",
                publicado=True,
            ),
            Aula(
                title="Complemento direto e complemento indireto",
                subject_id="portugues",
                level=2,
                description=(
                    "AULA EM TEXTO. O complemento direto completa o sentido de um verbo sem preposição obrigatória: 'A Rita leu o livro'. Pode ser "
                    "substituído por o, a, os ou as: 'A Rita leu-o'. O complemento indireto é geralmente introduzido pela preposição a e pode ser "
                    "substituído por lhe ou lhes: 'A Rita telefonou à avó' → 'A Rita telefonou-lhe'. Não classifiques apenas através de perguntas; "
                    "confirma sempre com o teste de substituição pronominal, já que algumas perguntas podem induzir em erro."
                ),
                video_url="",
                publicado=True,
            ),
            Aula(
                title="Discurso direto e discurso indireto",
                subject_id="portugues",
                level=1,
                description=(
                    "AULA EM TEXTO. No discurso direto reproduzem-se as palavras da personagem, normalmente com travessão ou aspas. No discurso indireto, "
                    "o narrador integra essas palavras na sua frase. Exemplo direto: A mãe disse: — Fecha a porta. Indireto: A mãe disse que fechasse "
                    "a porta. Na transformação podem mudar pronomes, determinantes, tempos verbais e expressões de tempo e lugar: hoje → naquele dia; "
                    "aqui → ali; amanhã → no dia seguinte. Repara também na mudança do modo verbal: o imperativo do discurso direto passa a "
                    "conjuntivo no discurso indireto."
                ),
                video_url="",
                publicado=True,
            ),
            Aula(
                title="Acentuação: palavras agudas, graves e esdrúxulas",
                subject_id="portugues",
                level=1,
                description=(
                    "AULA EM TEXTO. As palavras agudas têm a sílaba tónica na última sílaba; as graves, na penúltima; as esdrúxulas, na antepenúltima. "
                    "Todas as esdrúxulas são acentuadas. Muitas palavras agudas terminadas em a, e, o, em e ens recebem acento; nas graves, o acento "
                    "surge sobretudo quando a terminação foge ao padrão mais frequente. Separa a palavra em sílabas, identifica a sílaba tónica e só depois "
                    "aplica a regra de acentuação. Exemplos: café (aguda, acentuada), árvore (esdrúxula, acentuada), casa (grave, não acentuada)."
                ),
                video_url="",
                publicado=True,
            ),
            Aula(
                title="Texto narrativo: narrador, personagens, espaço e tempo",
                subject_id="portugues",
                level=1,
                description=(
                    "AULA EM TEXTO. O texto narrativo apresenta acontecimentos organizados numa sequência. Analisa quem conta a história, quem participa, "
                    "onde e quando decorrem os acontecimentos e como se estrutura a ação. O narrador participante usa normalmente a primeira pessoa; "
                    "o narrador não participante conta de fora e usa frequentemente a terceira pessoa. Distingue situação inicial, problema, peripécias, "
                    "momento de maior tensão e desfecho. Justifica sempre as respostas com elementos do texto, citando ou parafraseando passagens concretas."
                ),
                video_url="",
                publicado=True,
            ),
            # CIÊNCIAS NATURAIS
            Aula(
                title="Cadeias alimentares e fluxo de energia",
                subject_id="estudo-do-meio",
                level=1,
                description=(
                    "VÍDEO + PDF. Uma cadeia alimentar representa uma sequência de seres vivos ligados pela alimentação. "
                    "Os produtores fabricam matéria orgânica, normalmente por fotossíntese. Os consumidores obtêm energia alimentando-se de outros "
                    "seres vivos. Os decompositores transformam restos e devolvem sais minerais ao ambiente. As setas apontam do ser que serve de alimento "
                    "para o ser que o consome, indicando a transferência de matéria e energia. Várias cadeias interligadas formam uma teia alimentar, "
                    "mais resistente a perturbações do que uma cadeia isolada. O PDF em anexo é uma Prova de Aferição oficial do IAVE com exercícios "
                    "reais de Matemática e Ciências Naturais."
                ),
                video_url="https://www.youtube.com/watch?v=H85bQekIelc",
                ficheiro="pdfs/prova-afericao-matematica-ciencias-5ano.pdf",
                publicado=True,
            ),
            Aula(
                title="Relações bióticas: competição, predação, parasitismo e mutualismo",
                subject_id="estudo-do-meio",
                level=1,
                description=(
                    "AULA EM TEXTO. As relações bióticas são interações entre seres vivos. Na competição, ambos disputam recursos; na predação, um animal "
                    "captura e mata outro para se alimentar; no parasitismo, o parasita beneficia e prejudica o hospedeiro sem o matar imediatamente; "
                    "no mutualismo, ambos beneficiam. Classifica cada relação observando quem beneficia, quem é prejudicado e se os organismos pertencem "
                    "à mesma espécie ou a espécies diferentes. Exemplo de mutualismo: as abelhas polinizam as flores e alimentam-se do néctar."
                ),
                video_url="",
                publicado=True,
            ),
            Aula(
                title="Fotossíntese e importância das plantas",
                subject_id="estudo-do-meio",
                level=1,
                description=(
                    "AULA EM TEXTO. Na fotossíntese, as plantas produzem matéria orgânica usando água, dióxido de carbono e energia luminosa, libertando oxigénio. "
                    "A água e os sais minerais são absorvidos pelas raízes e transportados até às folhas. O dióxido de carbono entra pelos estomas. "
                    "A clorofila capta energia da luz. As plantas são produtores, iniciam muitas cadeias alimentares, libertam oxigénio e ajudam a regular "
                    "o dióxido de carbono atmosférico, sendo fundamentais para o equilíbrio do planeta."
                ),
                video_url="",
                publicado=True,
            ),
            Aula(
                title="Sistema digestivo e transformação dos alimentos",
                subject_id="estudo-do-meio",
                level=2,
                description=(
                    "VÍDEO. A digestão transforma alimentos em nutrientes capazes de atravessar a parede intestinal. Na boca ocorre mastigação e começa "
                    "a digestão do amido. O bolo alimentar passa pelo esófago graças aos movimentos peristálticos. No estômago forma-se o quimo. No intestino "
                    "delgado atuam a bílis e os sucos pancreático e intestinal; aí ocorre a maior parte da absorção. No intestino grosso absorve-se água e formam-se "
                    "as fezes. Distingue digestão mecânica, digestão química e absorção."
                ),
                video_url="https://www.youtube.com/watch?v=gcGMM4LxiOY",
                publicado=True,
            ),
            Aula(
                title="Sistema respiratório e hematose pulmonar",
                subject_id="estudo-do-meio",
                level=2,
                description=(
                    "VÍDEO + PDF. O ar entra pelas fossas nasais, passa pela faringe, laringe, traqueia, brônquios e bronquíolos e chega aos alvéolos. "
                    "Na hematose pulmonar, o oxigénio passa do ar alveolar para o sangue e o dióxido de carbono passa do sangue para os alvéolos. "
                    "Na inspiração, o diafragma contrai e desce, aumentando o volume da caixa torácica; na expiração, relaxa e sobe. O sistema respiratório "
                    "trabalha em conjunto com o sistema circulatório. O PDF em anexo é uma Prova de Aferição oficial do IAVE de Português e Estudo do Meio."
                ),
                video_url="https://www.youtube.com/watch?v=s0qMNqBulVY",
                ficheiro="pdfs/prova-afericao-portugues-estudo-do-meio.pdf",
                publicado=True,
            ),
            Aula(
                title="Circulação sanguínea: coração, vasos e dois circuitos",
                subject_id="estudo-do-meio",
                level=2,
                description=(
                    "VÍDEO. O coração impulsiona o sangue através de artérias, veias e capilares. Na pequena circulação, o sangue sai do ventrículo direito, "
                    "vai aos pulmões e regressa oxigenado à aurícula esquerda. Na grande circulação, sai do ventrículo esquerdo, distribui oxigénio e nutrientes "
                    "pelo organismo e regressa à aurícula direita. As artérias afastam o sangue do coração; as veias conduzem-no até ao coração. "
                    "Nos capilares ocorrem trocas com as células."
                ),
                video_url="https://www.youtube.com/watch?v=woQ3fJfWL5g",
                publicado=True,
            ),
            Aula(
                title="Sistema excretor e formação da urina",
                subject_id="estudo-do-meio",
                level=2,
                description=(
                    "VÍDEO. O sistema urinário elimina substâncias tóxicas e regula a quantidade de água e sais no organismo. Os rins filtram o sangue "
                    "e formam a urina. Os ureteres conduzem a urina até à bexiga, onde fica armazenada; a uretra leva-a para o exterior. A excreção não é "
                    "apenas urinária: os pulmões eliminam dióxido de carbono e vapor de água, e a pele elimina água e sais através do suor."
                ),
                video_url="https://www.youtube.com/watch?v=r_wLndqXVnE",
                publicado=True,
            ),
        ]
    )

    # ── Exercícios (15 fichas práticas, ligadas às Provas de Aferição reais) ──────
    PDF_MAT_1 = "/media/pdfs/prova-afericao-matematica-2023.pdf"
    PDF_MAT_CIENCIAS = "/media/pdfs/prova-afericao-matematica-ciencias-5ano.pdf"
    PDF_PORT_ESTUDO = "/media/pdfs/prova-afericao-portugues-estudo-do-meio.pdf"

    Exercicio.objects.bulk_create(
        [
            # Matemática
            Exercicio(
                title="Ficha Prática: Máximo Divisor Comum (M.D.C.)",
                level=1,
                subject_id="matematica",
                description="Problemas práticos de aplicação do MDC para divisão de materiais em partes iguais.",
                pdf_url=PDF_MAT_1,
                publicado=True,
            ),
            Exercicio(
                title="Ficha Prática: Áreas de Figuras Planas",
                level=2,
                subject_id="matematica",
                description="Exercícios de cálculo de superfícies compostas (retângulos, quadrados e triângulos).",
                pdf_url=PDF_MAT_1,
                publicado=True,
            ),
            Exercicio(
                title="Ficha Prática: Operações com Números Decimais",
                level=1,
                subject_id="matematica",
                description="Algoritmos da multiplicação e divisão por dízimas, com foco no cálculo mental.",
                pdf_url=PDF_MAT_CIENCIAS,
                publicado=True,
            ),
            Exercicio(
                title="Ficha Prática: Equações Lineares Simples",
                level=2,
                subject_id="matematica",
                description="Exercícios estruturados para transpor problemas de linguagem natural para equações matemáticas.",
                pdf_url=PDF_MAT_1,
                publicado=True,
            ),
            Exercicio(
                title="Ficha Prática: Ângulos e Triângulos",
                level=1,
                subject_id="matematica",
                description="Classificação de ângulos e verificação da soma dos ângulos internos de um triângulo.",
                pdf_url=PDF_MAT_CIENCIAS,
                publicado=True,
            ),
            # Português
            Exercicio(
                title="Ficha Escolar: Compreensão de Texto Contos",
                level=1,
                subject_id="portugues",
                description="Leitura orientada com questionário de interpretação sobre um texto tradicional português.",
                pdf_url=PDF_PORT_ESTUDO,
                publicado=True,
            ),
            Exercicio(
                title="Ficha Escolar: Pronomes Pessoais e Substituição",
                level=1,
                subject_id="portugues",
                description="Exercícios práticos para evitar repetições textuais recorrendo a pronomes oblíquos.",
                pdf_url=PDF_PORT_ESTUDO,
                publicado=True,
            ),
            Exercicio(
                title="Ficha Escolar: Discurso Direto e Indireto",
                level=2,
                subject_id="portugues",
                description="Transposição de narrativas orais e diálogos para o formato de discurso indireto.",
                pdf_url=PDF_PORT_ESTUDO,
                publicado=True,
            ),
            Exercicio(
                title="Ficha Escolar: Sinais de Pontuação Auxiliares",
                level=1,
                subject_id="portugues",
                description="Exercício de aplicação de aspas, parênteses e travessões num texto corrido.",
                pdf_url=PDF_PORT_ESTUDO,
                publicado=True,
            ),
            Exercicio(
                title="Ficha Escolar: Funções Sintáticas do Grupo Nominal",
                level=2,
                subject_id="portugues",
                description="Exercícios para distinguir o Vocativo do Sujeito em frases complexas.",
                pdf_url=PDF_PORT_ESTUDO,
                publicado=True,
            ),
            # Ciências Naturais / Estudo do Meio
            Exercicio(
                title="Ficha de Ciências: Relações Bióticas e Teias",
                level=1,
                subject_id="estudo-do-meio",
                description="Ficha de correspondência de imagens para identificar parasitismo, predação e comensalismo.",
                pdf_url=PDF_MAT_CIENCIAS,
                publicado=True,
            ),
            Exercicio(
                title="Ficha de Ciências: Hematose Pulmonar e Celular",
                level=2,
                subject_id="estudo-do-meio",
                description="Legenda do esquema dos alvéolos pulmonares e perguntas sobre trocas gasosas.",
                pdf_url=PDF_PORT_ESTUDO,
                publicado=True,
            ),
            Exercicio(
                title="Ficha de Ciências: Propriedades e Tipos de Solo",
                level=1,
                subject_id="estudo-do-meio",
                description="Questionário teórico-prático sobre solos permeáveis, impermeáveis e a sua importância agrícola.",
                pdf_url=PDF_MAT_CIENCIAS,
                publicado=True,
            ),
            Exercicio(
                title="Ficha de Ciências: Roda dos Alimentos e Nutrição",
                level=2,
                subject_id="estudo-do-meio",
                description="Elaboração de ementas diárias equilibradas com base nas proporções oficiais da Roda dos Alimentos.",
                pdf_url=PDF_PORT_ESTUDO,
                publicado=True,
            ),
            Exercicio(
                title="Ficha de Ciências: A Fotossíntese e as Folhas",
                level=1,
                subject_id="estudo-do-meio",
                description="Análise de uma experiência laboratorial sobre a influência da luz no crescimento da planta.",
                pdf_url=PDF_MAT_CIENCIAS,
                publicado=True,
            ),
        ]
    )


def main():
    clear_database()
    seed_database()
    print(
        "Base de dados populada com sucesso! Dados reais de Portugal (2º Ciclo) prontos."
    )


if __name__ == "__main__":
    main()
