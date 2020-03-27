from django.urls import path, include
from . import views

urlpatterns = [
    path('getuser/', views.get_user),
    path('update/', views.update_user)
]