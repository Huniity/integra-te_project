from django.contrib import admin

from .models import Disciplina, Tema, Conteudo, Jogo, Livro, Exercicio, Aula


@admin.register(Disciplina)
class DisciplinaAdmin(admin.ModelAdmin):
    list_display = ("nome", "slug")
    search_fields = ("nome", "slug")
    prepopulated_fields = {"slug": ("nome",)}


@admin.register(Tema)
class TemaAdmin(admin.ModelAdmin):
    list_display = ("titulo", "disciplina", "seccao", "ano_escolar")
    list_filter = ("disciplina", "seccao", "ano_escolar")
    search_fields = ("titulo", "slug")
    prepopulated_fields = {"slug": ("titulo",)}


@admin.register(Conteudo)
class ConteudoAdmin(admin.ModelAdmin):
    list_display = ("titulo", "tema", "tipo", "publicado", "criado_em")
    list_filter = ("publicado", "tipo", "dificuldade", "tema__disciplina")
    search_fields = ("titulo", "corpo")
    list_editable = ("publicado",)


@admin.register(Jogo)
class JogoAdmin(admin.ModelAdmin):
    list_display = ("titulo", "disciplina", "publicado", "criado_em")
    list_filter = ("publicado", "disciplina")
    search_fields = ("titulo", "descricao")
    list_editable = ("publicado",)


@admin.register(Livro)
class LivroAdmin(admin.ModelAdmin):
    list_display = ("titulo", "autor", "publicado", "criado_em")
    list_filter = ("publicado",)
    search_fields = ("titulo", "autor")
    list_editable = ("publicado",)


@admin.register(Exercicio)
class ExercicioAdmin(admin.ModelAdmin):
    list_display = ("title", "subject_id", "level", "publicado")
    list_filter = ("publicado", "level")
    search_fields = ("title", "subject_id")
    list_editable = ("publicado",)


@admin.register(Aula)
class AulaAdmin(admin.ModelAdmin):
    list_display = ("title", "subject_id", "level", "publicado", "created_at")
    list_filter = ("publicado", "level")
    search_fields = ("title", "subject_id")
    list_editable = ("publicado",)
