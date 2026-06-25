from django.core.management.base import BaseCommand
from sentence_transformers import SentenceTransformer
from voice_search.models import ObjectVector
from integrate.models import Disciplina, Tema, Conteudo, Jogo, Livro


MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"
# https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2


def build_rows():
    """
    Build rows of content to be embedded. Each row is a dictionary containing the model type, object ID, label, route, and text to be embedded.
    """
    rows = []

    for obj in Disciplina.objects.all():
        rows.append(
            {
                "model_type": "disciplina",
                "object_id": obj.id,
                "label": obj.nome,
                "route": "/aprender",
                "text": f"{obj.nome} {obj.desc or ''}",
            }
        )

    for obj in Tema.objects.all().select_related("disciplina"):
        rows.append(
            {
                "model_type": "tema",
                "object_id": obj.id,
                "label": obj.titulo,
                "route": f"/{obj.seccao}",
                "text": f"{obj.titulo} {obj.desc or ''} {obj.disciplina.nome} ano {obj.ano_escolar}",
            }
        )

    for obj in Conteudo.objects.filter(publicado=True).select_related(
        "tema__disciplina"
    ):
        rows.append(
            {
                "model_type": "conteudo",
                "object_id": obj.id,
                "label": obj.titulo,
                "route": f"/{obj.tema.seccao}",
                "text": f"{obj.titulo} {(obj.corpo or '')[:300]} {obj.tema.titulo}",
            }
        )

    for obj in Jogo.objects.filter(publicado=True).select_related("disciplina"):
        disciplina_nome = obj.disciplina.nome if obj.disciplina else ""
        rows.append(
            {
                "model_type": "jogo",
                "object_id": obj.id,
                "label": obj.titulo,
                "route": f"/jogar/{obj.id}",
                "text": f"{obj.titulo} {obj.descricao or ''} {disciplina_nome}",
            }
        )

    for obj in Livro.objects.filter(publicado=True):
        rows.append(
            {
                "model_type": "livro",
                "object_id": obj.id,
                "label": obj.titulo,
                "route": f"/ler/{obj.id}",
                "text": f"{obj.titulo} {obj.autor or ''} {obj.resumo or ''} {obj.temas or ''}",
            }
        )

    return rows


class Command(BaseCommand):
    """
    Django management command to embed all content into the ObjectVector table.
    """

    help = "Embed all content into the ObjectVector table."

    def handle(self, *args, **options):
        """
        Load the embedding model, build rows of content, compute embeddings, and store them in the database.
        """
        self.stdout.write(f"Loading model {MODEL_NAME}")
        model = SentenceTransformer(MODEL_NAME)

        rows = build_rows()
        self.stdout.write(f"Embedding {len(rows)} objects...")

        object_string = [r["text"] for r in rows]
        embeddings = model.encode(
            object_string, normalize_embeddings=True, show_progress_bar=True
        )

        for row, vector in zip(rows, embeddings):
            ObjectVector.objects.update_or_create(
                model_type=row["model_type"],
                object_id=row["object_id"],
                defaults={
                    "label": row["label"],
                    "route": row["route"],
                    "embedding": vector.tolist(),
                },
            )

        self.stdout.write(
            self.style.SUCCESS(f"Embeddings done. {len(rows)} objects indexed.")
        )
