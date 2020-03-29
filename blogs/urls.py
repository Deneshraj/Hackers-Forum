from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.add_blog),
    path('all/', views.fetch_blogs),
    path('user/', views.fetch_user_blogs),
    path('update/', views.update_blog),
    path('delete/', views.delete_blog),
    path('allblogs/', views.all_blogs),
    path('blog/', views.blog)
]
