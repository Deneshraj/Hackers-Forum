from .Exceptions import LoginRequiredException
from django.http import HttpResponse
from django.shortcuts import redirect
from users.models import User

def login_required(function):
    URL = "http://localhost:8000/"
    def return_function(request, *args, **kwargs):
        try:
            if request.COOKIES.get("auth_token"):
                token = request.COOKIES.get("auth_token")
                user = User.objects.filter(token=token)
                if len(user) > 0:
                    return function(request, *args, **kwargs)
                else:
                    response = redirect(URL + "auth/")
                    response.delete_cookie("auth_token")
                    return response
            else:
                return redirect(URL + "auth/")

        except Exception as e:
            return redirect(URL + "auth/")

    return return_function
