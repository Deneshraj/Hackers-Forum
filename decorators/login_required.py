from .Exceptions import LoginRequiredException
from django.http import HttpResponse
from django.shortcuts import redirect

def login_required(function):
    def return_function(request, *args, **kwargs):
        try:
            if request.COOKIES.get("auth_token"):
                return function(request, *args, **kwargs)
            else:
                return redirect("http://localhost:8000/auth/")

        except Exception as e:
            return redirect("http://localhost:8000/auth/")

    return return_function
