from django.db import models

from pgvector.django import VectorField


class ObjectVector(models.Model):
    """
    Model to store vector representations of objects for voice search.
     - object_id: Unique identifier for the object (UUID).
     - model_type: Type of the object (e.g., 'Tema', 'Disciplina').
     - label: Human-readable label for the object.
     - route: URL route to access the object in the frontend.
     - embedding: Vector representation of the object for similarity search.
     Unique constraint on (object_id, model_type) to prevent duplicates.
     String representation includes label, model type, and route for easy identification.
    """

    object_id = models.UUIDField()
    model_type = models.CharField(max_length=200)
    label = models.CharField(max_length=200)
    route = models.CharField(max_length=200)
    embedding = VectorField(dimensions=384)

    class Meta:
        """
        Ensure that each object_id and model_type combination is unique to prevent duplicate entries.
        """

        unique_together = ("object_id", "model_type")

    def __str__(self):
        """
        Return a string representation of the ObjectVector instance, including its label, model type, and route.
        """
        return f" Object: {self.label} [{self.model_type}] - routing to: {self.route}"
