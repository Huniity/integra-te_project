from django.urls import path
from voice_search import views

"""
URL configuration for the voice_search app.
"""

urlpatterns = [
    path("transcribe/", views.transcribe),
    path("reroute/", views.reroute),
]
