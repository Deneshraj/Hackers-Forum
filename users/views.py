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
from blogs.models import Blog
from blogs.serializer import BlogSerializer
import traceback

# Create your views here.
@csrf_protect
@login_required
def get_user(request, *args, **kwargs):
    if(request.method == "POST"):
        try:
            auth_token = request.COOKIES.get('auth_token')
            user = AuthToken.objects.filter(token=auth_token).first().user
            serialized_user = UserSerializer(user, many=False)
            return JsonResponse({
                'msg': serialized_user.data,
                "profile_pic": settings.MEDIA_URL + user.profile_pic
            }, status=201)
        except Exception as e:
            print(e)
            return JsonResponse({ 'msg': 'Error at Server!' }, status=500)
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

# Fetch User for displaying in the Profile Page!
@csrf_protect
@login_required
def get_user_for_profile(request, *args, **kwargs):
    if(request.method == "POST"):
        try:
            post_data = json.loads(request.body)
            username = post_data["username"]
            user = User.objects.filter(username=username)
            current_user = AuthToken.objects.filter(token=request.COOKIES.get("auth_token")).first().user
            
            
            if(len(user)):                
                user = user.first()
                
                friend_request_from = False
                request_from = Friends.objects.filter(from_user=user, to_user=current_user)
                friend_request_from = len(request_from) > 0
                
                friend_request_sent = False
                friends = Friends.objects.filter(from_user=current_user, to_user=user)
                friend_request_sent = (len(friends) > 0)

                if(friend_request_sent):
                    status = friends.first().status
                elif(friend_request_from):
                    status = request_from.first().status
                
                blogs = Blog.objects.filter(user=user)
                serialized_user = UserSerializer(user, many=False)
                
                if(len(blogs)):
                    serialized_blogs = BlogSerializer(blogs, many=True)
                    return JsonResponse({
                        'msg': serialized_user.data,
                        'blogs': serialized_blogs.data,
                        "profile_pic": settings.MEDIA_URL + user.profile_pic,
                        "currentUser": current_user.username,
                        "friendRequested": friend_request_sent,
                        'friendRequestFrom': friend_request_from,
                        'friendStatus': status
                    }, status=201)
                else:
                    return JsonResponse({
                        'msg': serialized_user.data,
                        "profile_pic": settings.MEDIA_URL + user.profile_pic
                    }, status=201)
            else:
                return JsonResponse({ 'error': 'User not found!' }, status=400)
        except Exception as e:
            print(e)
            return JsonResponse({ 'msg': 'Error at Server!' }, status=500)
    else:
        return JsonResponse({ 'error': 'Invalid Method!' }, status=400)

# Add Friend requests
@csrf_protect
@login_required
def add_friend(request, *args, **kwargs):
    if(request.method == "POST"):
        try:
            post_data = json.loads(request.body)
            auth_token = request.COOKIES.get('auth_token')
            tokens = AuthToken.objects.filter(token=auth_token)

            if(len(tokens) > 0):
                from_user = tokens.first().user
                to_user_id = post_data["to_user"]
                to_user = User.objects.filter(id=to_user_id).first()

                freq, created = Friends.objects.get_or_create(
                    from_user = from_user,
                    to_user = to_user
                )

                if created:
                    return JsonResponse({
                        'msg': 'Friend request added!',
                        "friendRequested": True
                    }, status=200)
                else:
                    freq.delete()
                    return JsonResponse({
                        'msg': 'Friend request Cancelled!',
                        "friendRequested": False
                    }, status=200)
            else:
                return JsonResponse({ 'msg': 'Please Login to send Friend Request!' }, status=400)

        except Exception as e:
            print(e)
            return JsonResponse({ 'msg': 'Error at Server!' }, status=500)
    else:
        return JsonResponse({ 'error': 'Invalid Method!' }, status=400)


@csrf_protect
@login_required
def accept_friend_request(request, *args, **kwargs):
    if(request.method == "POST"):
        try:
            post_data = json.loads(request.body)
            auth_token = request.COOKIES.get('auth_token')
            tokens = AuthToken.objects.filter(token=auth_token)

            if(len(tokens) > 0):
                from_user = tokens.first().user
                to_user_id = post_data["to_user"]
                to_user = User.objects.filter(id=to_user_id).first()

                freq, created = Friends.objects.get_or_create(
                    from_user = from_user,
                    to_user = to_user
                )

                if not created:
                    return JsonResponse({
                        'msg': 'Friend request sent!',
                        "friendRequested": True
                    }, status=200)
                else:
                    freq.status = True
                    freq.save()
                    return JsonResponse({
                        'msg': 'Friend request Accepted!!',
                        "friendStatus": True
                    }, status=200)
            else:
                return JsonResponse({ 'msg': 'Please Login to send Friend Request!' }, status=400)

        except Exception as e:
            trace_back = traceback.format_exc()
            message = str(e) + " " + str(trace_back)
            print(message)
            return JsonResponse({ 'msg': 'Error at Server!' }, status=500)
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
