from .Exceptions import LoginRequiredException
from django.http import HttpResponse
from django.shortcuts import redirect
from users.models import AuthToken

def login_required(function):
    URL = "http://localhost:8000/"
    def return_function(request, *args, **kwargs):
        try:
            if request.COOKIES.get("auth_token"):
                token = request.COOKIES.get("auth_token")
                tokens = AuthToken.objects.filter(token=token)
                if len(tokens) > 0:
                    tokens = tokens.first()
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
