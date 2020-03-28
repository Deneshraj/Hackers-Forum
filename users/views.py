from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from decorators.login_required import login_required
from authentication.authtoken import *
from authentication.serializer import UserSerializer
from . import models
from authentication.views import is_user_exist
import json

User = models.User

# Create your views here.
@csrf_protect
@login_required
def get_user(request, *args, **kwargs):
    if(request.method == "POST"):
        try:
            auth_token = request.COOKIES.get('auth_token')
            user = User.objects.filter(token=auth_token).first()
            serialized_user = UserSerializer(user, many=False)
            return JsonResponse({ 'msg': serialized_user.data }, status=201)
        except Exception as e:
            print(e)
            return JsonResponse({ 'msg': 'Error at Server!' }, status=400)
    else:
        return JsonResponse({ 'error': 'Invalid Method!' }, status=400)

@csrf_protect
@login_required
def update_user(request, *args, **kwargs):
    if(request.method == 'PUT'):
        try:
            post_data = json.loads(request.body)
            first_name = post_data["first_name"]
            last_name = post_data["last_name"]
            username = post_data["username"]
            email = post_data["email"]
        except KeyError:
            return JsonResponse({ 'error': "Field not found!" }, status=400)
        except Exception as e:
            print(e)
            return JsonResponse({ 'error': "Error occured at server" }, status=500)
        
        isValid, errors = validate(first_name, last_name, username, email)

        if(isValid):
            try:
                token = request.COOKIES.get('auth_token')
                user = User.objects.filter(token=token)

                if not is_user_exist(user):
                    response = JsonResponse({ 'error': "User not found! Logging out..." }, status=400)
                    response.delete_cookie('auth_token')
                    return response

                user = user.first()
                user.first_name = first_name
                user.last_name = last_name
                user.username = username
                user.email = email
                user.save()

                response = JsonResponse({ 'msg': "User Updated Successfully!" }, status=201)
                return response

            except Exception as e:
                print(e)
                return JsonResponse({ 'error': "Unable to Update User, Please try again Later!" }, status=500)
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
