from django.urls import path, include
from . import views

urlpatterns = [
    path('getuser/', views.get_user),
    path('update/', views.update_user),
    path('fufb/', views.fetch_user_for_blog),
    path('gufa/', views.get_user_for_aside),
]