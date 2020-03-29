from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from decorators.login_required import login_required
from django.middleware.csrf import get_token

# Create your views here.
@login_required
def index(request, *args, **kwargs):
    return render(request, "frontend/index.html")

def login(request, *args, **kwargs):
    try:
        if(request.COOKIES.get('csrftoken')):
            cookie = request.COOKIES.get('csrftoken')
        else:
            cookie = get_token(request)
    except Exception:
        cookie = get_token(request)

    if(is_logged_in(request)):
        response = redirect('/')
    else:
        response = render(request, "frontend/auth.html")

    response.set_cookie("csrftoken", cookie, max_age=365 * 24 * 60 * 60)
    return response

def pagenotfound(request, *args, **kwargs):
    return HttpResponse("<h1>Page not found</h1>")

def is_logged_in(request):
    try:
        if request.COOKIES.get("auth_token"):
            return True
        else:
            return False
    except Exception as e:
        return False