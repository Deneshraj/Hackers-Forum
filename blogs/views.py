from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.http import JsonResponse, HttpResponse
from decorators.login_required import login_required
from . import serializer
from . import models
import json
from authentication.authtoken import *
from users.models import User
from authentication.views import is_user_exist
import uuid

Blog = models.Blog
BlogSerializer = serializer.BlogSerializer

# Create your views here.

@csrf_protect
@login_required
def add_blog(request, *args, **kwargs):
    if(request.method == 'POST'):
        try:
            POST = json.loads(request.body)
            title = POST['title']
            content = POST['content']
            auth_token = request.COOKIES.get('auth_token')
            blog = Blog()

            user = User.objects.filter(token=auth_token)

            if(is_user_exist(user)):
                blog.user = user.first()
                blog.title = title
                blog.content = content

                blog.save()
            else:
                response = JsonResponse({ 
                    "Error!": "Invalid User!",
                }, 400)
                response.delete_cookie("auth_token")
                return response

            return JsonResponse({
                'msg': 'blog saved successfully!',
                'title': blog.title,
                'content': blog.content
            }, status=201)
        except KeyError:
            return JsonResponse({ "error": "Please provide valid title and content" }, status=400)
        except Exception as e:
            print(e)
            return JsonResponse({ "error": "Exception at Server!" }, status=500)
    else:
        return JsonResponse({ "error": "Invalid Method!" }, status=400)


@csrf_protect
def fetch_blogs(request, *args, **kwargs):
    if request.method == 'GET':
        blogs = Blog.objects.all()
        serialized_blogs = BlogSerializer(blogs, many=True)
        return JsonResponse(serialized_blogs.data[::-1], safe=False)
    else:
        return JsonResponse({ "error": "Invalid Method!" }, status=400)

    
@csrf_protect
def fetch_user_blogs(request, *args, **kwargs):
    if request.method == 'GET':
        print(request.COOKIES)
        user = User.objects.filter(token=request.COOKIES.get("auth_token")).first()
        blogs = Blog.objects.filter(user=user)
        serialized_blogs = BlogSerializer(blogs, many=True)
        return JsonResponse(serialized_blogs.data[::-1], safe=False)
    else:
        return JsonResponse({ "error": "Invalid Method!" }, status=400)

@csrf_protect
@login_required
def update_blog(request, *args, **kwargs):
    if request.method == 'PUT':
        try:
            request_blog = json.loads(request.body)
            blog_req = request_blog['blog']
            blog_id = blog_req['id']
            blog = Blog.objects.filter(id=blog_id).first()

            blog.title = blog_req['title']
            blog.content =blog_req['content']
            blog.save()
            serialized_blog = BlogSerializer(blog, many=False)
            return JsonResponse({ 'msg': serialized_blog.data }, status=201)
        except KeyError:
            return JsonResponse({ 'error': "Invalid key Given!" }, status=400)
        except Exception as e:
            print(e)
            return JsonResponse({ 'error': "Internal Server Error! Can't update the blog at the moment!" }, status=500)
    else:
        return JsonResponse({ "error": "Invalid Method!" }, status=400)

@csrf_protect
@login_required
def delete_blog(request, *args, **kwargs):
    if request.method == "DELETE":
        try:
            DELETE = json.loads(request.body)
            user = user = User.objects.filter(token=request.COOKIES.get("auth_token")).first()
            blog_id = DELETE["blog_id"]
            blog = Blog.objects.filter(user=user, id=blog_id).delete()

            return JsonResponse({ 'msg': "Blog Deleted Successfully!" }, status=201)
        except Exception:
            print(e)
            return JsonResponse({ 'error': "Error in Deleting a blog!" }, status=500)
    else:
        return JsonResponse({ "error": "Invalid Method!" }, status=400)

@csrf_exempt
def all_blogs(request, *args, **kwargs):
    if request.method == 'GET':
        print(request.headers)
        blogs = Blog.objects.all()
        serialized_blogs = BlogSerializer(blogs, many=True)
        return JsonResponse(serialized_blogs.data[::-1], safe=False)
    else:
        return JsonResponse({ "error": "Invalid Method!" }, status=400)