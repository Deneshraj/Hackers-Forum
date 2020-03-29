from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import hashlib
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from users.models import User, AuthToken
from .serializer import UserSerializer
from decorators.login_required import login_required
import json
from .authtoken import *
import os
import binascii

@csrf_protect
def login(request):
    try:
        if request.method == "POST":
            post_data = json.loads(request.body)
            username = post_data["username"]
            password = post_data["password"]
            password = hashlib.sha256(password.encode()).hexdigest()

            user = User.objects.filter(username=username, password=password)
            if is_user_exist(user):
                user = user.first()
                serialized_user = UserSerializer(user, many=False)
                
                token = generate_token()

                auth_token = AuthToken()
                auth_token.user = user
                auth_token.token = token
                auth_token.save()
                
                response =  JsonResponse(serialized_user.data, safe=False)
                response.set_cookie("auth_token", token, max_age=365 * 24 * 60 * 60)
                return response
            else:
                return JsonResponse({"error": "Invalid Username or Password!"}, safe=False, status=400)
    except KeyError:
        return JsonResponse({ 'error': "Please provide all the fields" }, status=400)
    except Exception as e:
        return JsonResponse({ 'error': 'Internal Server Error!' }, status=500)
    else:
        return JsonResponse({ 'error': "Invalid Method" }, status=400)

@csrf_protect
def create_user(request):
    if request.method == "POST":
        try:
            post_data = json.loads(request.body)

            first_name = post_data["first_name"]
            last_name = post_data["last_name"]
            username = post_data["username"]
            email = post_data["email"]
            password = post_data["password"]
            confirm_password = post_data["confirm_password"]

        except KeyError:
            return JsonResponse({ 'msg': "Field not found!" }, status=400)
        except Exception as e:
            print(e)
            return JsonResponse({ 'msg': "Error occured at server" }, status=500)

        isValid, errors = validate(first_name, last_name, username, email, password, confirm_password)

        if(isValid):
            password = hashlib.sha256(password.encode()).hexdigest()
            try:
                user = User()
                user.first_name = first_name
                user.last_name = last_name
                user.username = username
                user.email = email
                user.password = password
                user.save()

                token = generate_token()
                auth_token = AuthToken()
                auth_token.user = user
                auth_token.token = token
                auth_token.save()
                
                response = JsonResponse({ 'msg': "<h1>User created Successfully!" }, status=200)
                response.set_cookie("auth_token", token, max_age=365 * 24 * 60 * 60)
                return response

            except Exception as e:
                print(e)
                return JsonResponse({ 'msg': "Unable to Create User, Please try again Later!" }, status=500)
        else:
            return JsonResponse({ 'error': errors }, safe=False, status=400)
    
    return JsonResponse({ 'msg': "Invalid Method" })

@login_required
def logout(request):
    response = HttpResponse("Logged out Successfully!")
    response.delete_cookie("auth_token")
    return response

@csrf_exempt
def get_user(request, id):
    if(request.method == "GET"):
        users = User.objects.filter(id=id)
        if(is_user_exist(users)):
            user = users.first()
            serialized_user = UserSerializer(user, many=False)
            
            user_data = {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "username": user.username,
                "email": user.email
            }

            return JsonResponse(user_data, safe=False)
        else:
            return HttpResponse("<h1>User doesn't exist!</h1>")
    else:
        return HttpResponse("<h1>Invalid Method</h1>")

@csrf_exempt
def get_all_users(request):
    if(request.method == "GET"):
        users = User.objects.all()
        if(is_user_exist(users)):
            serialized_user = UserSerializer(users, many=True)
            return JsonResponse(serialized_user.data, safe=False)
        else:
            return HttpResponse("<h1>User doesn't exist!</h1>")
    else:
        return HttpResponse("<h1>Invalid Method</h1>")


# Checks if the User already Exist!
def is_user_exist(user):
    try:
        if(len(user)) > 0:
            return True
    except Exception as e:
        print(e)
    return False

def validate(first_name, last_name, username, email, password, confirm_password):
    isValid = False
    errors = []

    if (len(first_name) < 5) or (len(username) < 5) or (len(email) < 5) or (len(password) < 5) or (len(confirm_password) < 5):
        errors.append("Please fill All the Fields!")

    if password != confirm_password:
        errors.append("Password doesn't match")

    user = User.objects.filter(username = username)
    if is_user_exist(user):
        errors.append("Username already Exist!")

    if len(errors) == 0:
        isValid = True

    return isValid, errors