from rest_framework.routers import DefaultRouter

from integrate.views import (
    DisciplinaViewSet,
    TemaViewSet,
    JogoViewSet,
    LivroViewSet,
    ExercicioViewSet,
    AulaViewSet,
)

router = DefaultRouter()

router.register(r"disciplinas", DisciplinaViewSet, basename="disciplinas")
router.register(r"temas", TemaViewSet, basename="temas")
router.register(r"jogos", JogoViewSet, basename="jogos")
router.register(r"livros", LivroViewSet, basename="livros")
router.register(r"exercicios", ExercicioViewSet, basename="exercicios")
router.register(r"aulas", AulaViewSet, basename="aulas")

urlpatterns = router.urls
