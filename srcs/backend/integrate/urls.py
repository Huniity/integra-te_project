from rest_framework.routers import DefaultRouter


from integrate.views import (
    DisciplinaViewSet,
    TemaViewSet,
    JogoViewSet,
    LivroViewSet,
    # ContactoCreateView,
    # PesquisaView,
)


router = DefaultRouter()

router.register(r"disciplinas", DisciplinaViewSet, basename="disciplinas")
router.register(r"temas", TemaViewSet, basename="temas")
router.register(r"jogos", JogoViewSet, basename="jogos")
router.register(r"livros", LivroViewSet, basename="livros")
# router.register(r"contactos", ContactoCreateView, basename="contactos")
# router.register(r"pesquisa", PesquisaView, basename="pesquisa")

urlpatterns = router.urls
