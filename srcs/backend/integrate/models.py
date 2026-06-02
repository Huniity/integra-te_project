from django.db import models


class disciplinas(models.Model):
    id = models.UUIDField(primary_key=True)
    name = models.Charfiled(max_length=200)
    slug = models.SlugField(max_length=500)
    desc = models.Charfield(max_length=500)
