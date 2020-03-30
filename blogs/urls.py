from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.add_blog),
    path('all/', views.fetch_blogs),
    path('user/', views.fetch_user_blogs),
    path('update/', views.update_blog),
    path('delete/', views.delete_blog),
    path('allblogs/', views.all_blogs),
    path('blog/', views.blog),
    path('likeblog/', views.like_blog),
    path('iulb/', views.is_user_liked_blog),
    path('addcomment/', views.add_comment),
    path('getcomments/', views.get_comments)
]
