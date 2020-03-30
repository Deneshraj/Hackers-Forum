from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from decorators.login_required import login_required
from authentication.authtoken import *
from authentication.serializer import UserSerializer
from .models import *
from authentication.views import is_user_exist
import json
from django.http import QueryDict
from django.core.files.storage import default_storage
from django.conf import settings

# Create your views here.
@csrf_protect
@login_required
def get_user(request, *args, **kwargs):
    if(request.method == "POST"):
        try:
            auth_token = request.COOKIES.get('auth_token')
            user = AuthToken.objects.filter(token=auth_token).first().user
            print(user.profile_pic)
            serialized_user = UserSerializer(user, many=False)
            return JsonResponse({
                'msg': serialized_user.data,
                "profile_pic": settings.MEDIA_URL + user.profile_pic
            }, status=201)
        except Exception as e:
            print(e)
            return JsonResponse({ 'msg': 'Error at Server!' }, status=400)
    else:
        return JsonResponse({ 'error': 'Invalid Method!' }, status=400)

@csrf_protect
@login_required
def update_user(request, *args, **kwargs):
    if(request.method == 'POST'):
        try:
            post_data = request.POST
            first_name = post_data["first_name"]
            last_name = post_data["last_name"]
            username = post_data["username"]
            email = post_data["email"]

            profile_pic_name = "-" . join(str(request.FILES['profile_pic']).split(" "))
            default_storage.save(profile_pic_name, request.FILES['profile_pic'])
            isValid, errors = validate(first_name, last_name, username, email)

            if(isValid):
                token = request.COOKIES.get('auth_token')
                tokens = AuthToken.objects.filter(token=token)
                if len(tokens) > 0:
                    user = tokens.first().user
                else:
                    response = JsonResponse({ 'error': "User not found! Logging out..." }, status=400)
                    response.delete_cookie('auth_token')
                    return response

                user.first_name = first_name
                user.last_name = last_name
                user.username = username
                user.email = email
                user.profile_pic = profile_pic_name
                user.save()


                response = JsonResponse({ 'msg': "User Updated Successfully!" }, status=201)
                return response
        except KeyError:
            return JsonResponse({ 'error': "Field not found!" }, status=400)
        except Exception as e:
            print(e)
            return JsonResponse({ 'error': "Error occured at server" }, status=500)
    else:
        return JsonResponse({ 'error': 'Invalid Method!' }, status=400)

@csrf_protect
@login_required
def fetch_user_for_blog(request, *args, **kwargs):
    if request.method == 'POST':
        try:
            post_data = json.loads(request.body)
            user_id = post_data["user_id"]
            user = User.objects.filter(id=user_id)
            if len(user) > 0:
                user = user.first()
                return JsonResponse({
                    'username': user.username,
                    'profilePic': settings.MEDIA_URL + user.profile_pic
                }, status=200)
            else:
                return JsonResponse({ 'msg': "User not Found!" }, status=400)
        except KeyError:
            return JsonResponse({ 'error': "Field not found!" }, status=400)
        except Exception as e:
            print(e)
            return JsonResponse({ 'error': "Error occured at server" }, status=500)
    else:
        return JsonResponse({ 'error': 'Invalid Method!' }, status=400)

@csrf_protect
@login_required
def get_user_for_aside(request, *args, **kwargs):
    if request.method == "GET":
        try:
            auth_token = request.COOKIES.get('auth_token')
            tokens = AuthToken.objects.filter(token=auth_token)

            if(len(tokens) > 0):
                user = tokens.first().user
                return JsonResponse({
                    'username': user.username,
                    'profilePic': settings.MEDIA_URL + user.profile_pic
                }, status=200)
            else:
                return JsonResponse({ 'msg': "User not Found!" }, status=400)
        except Exception as e:
            print(e)
            return JsonResponse({ 'error': "Error occured at server" }, status=500)
    else:
        return JsonResponse({ 'error': 'Invalid Method!' }, status=400)

def validate(first_name, last_name, username, email):
    isValid = False
    errors = []

    if (len(first_name) < 5) or (len(username) < 5) or (len(email) < 5):
        errors.append("Please fill All the Fields!")

    if len(errors) == 0:
        isValid = True

    return isValid, errors
