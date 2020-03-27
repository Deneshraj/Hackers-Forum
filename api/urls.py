from django.urls import path, include

urlpatterns = [
    path('auth/', include('authentication.urls')),
    path('blogs/', include('blogs.urls')),
    path('user/', include('users.urls'))
]
