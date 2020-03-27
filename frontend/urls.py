from django.urls import path
from . import views

urlpatterns = [
    path('auth/', views.login, name="authenticate"),
    path('', views.index, name="index"),
]
