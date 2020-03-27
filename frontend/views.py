from django.shortcuts import render, redirect
from django.http import HttpResponse
from decorators.login_required import login_required

# Create your views here.
@login_required
def index(request, *args, **kwargs):
    print(request.get_raw_uri())
    return render(request, "frontend/index.html")

def login(request, *args, **kwargs):
    if(is_logged_in(request)):
        return redirect('/')
    else:
        return render(request, "frontend/auth.html")

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