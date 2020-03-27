from django.urls import path, include
from . import views

urlpatterns = [
    path('login/', views.login),
    path('user/<id>', views.get_user),
    path('register/', views.create_user),
    path('users/', views.get_all_users),
    path('logout/', views.logout)
]