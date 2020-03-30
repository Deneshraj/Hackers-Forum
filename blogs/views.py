from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.http import JsonResponse, HttpResponse
from decorators.login_required import login_required
from .serializer import *
from .models import *
import json
from authentication.authtoken import *
from users.models import *
from authentication.views import is_user_exist
import uuid
from datetime import datetime
import traceback

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

            tokens = AuthToken.objects.filter(token=auth_token)

            if(is_user_exist(tokens)):
                user = tokens.first().user
                blog.user = user
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
        user = AuthToken.objects.filter(token=request.COOKIES.get("auth_token")).first().user
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
            token = AuthToken.objects.filter(token=request.COOKIES.get("auth_token")).first()
            user = token.user
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


@csrf_protect
@login_required
def like_blog(request, *args, **kwargs):
    if(request.method == 'POST'):
        try:
            data = json.loads(request.body)
            blog_id = data["id"]
            auth_token = request.COOKIES.get('auth_token')
            blog = Blog.objects.filter(id=uuid.UUID(blog_id))

            if(len(blog) > 0):
                users = AuthToken.objects.filter(token=auth_token)
                if(len(users) > 0):
                    blog = blog.first()
                    user = users.first().user
                    already_liked = Likes.objects.filter(blog=blog, user=user)
                    if len(already_liked) > 0:
                        Likes.objects.filter(blog=blog, user=user).delete()
                        blog.likes_count = blog.likes_count - 1
                        blog.save()
                        serialized_blog = BlogSerializer(blog, many=False)
                        return JsonResponse({ 'blog': serialized_blog.data }, status=201)
                    else:
                        likes = Likes()
                        likes.user = users.first().user
                        likes.blog = blog
                        blog.likes_count = blog.likes_count + 1
                        blog.save()
                        likes.save()
                        serialized_blog = BlogSerializer(blog, many=False)
                        return JsonResponse({ 'blog': serialized_blog.data }, status=201)
                else:
                    return JsonResponse({ 'msg': "Invalid User" }, status=400)
            else:
                return JsonResponse({ 'msg': "blog.not found!" }, status=400)
        except KeyError:
            return Jsonresponse({ 'error': "Invalid Fields!" }, status=400)
        except Exception as e:
            trace_back = traceback.format_exc()
            message = str(e) + " " + str(trace_back)
            print("Error!", message)
            return JsonResponse({ 'error': "Internal Server Error!" }, status=500)
    else:
        return JsonResponse({ "error": "Invalid Method!" }, status=400)


@csrf_protect
@login_required
def is_user_liked_blog(request, *args, **kwargs):
    if(request.method == 'POST'):
        try:
            data = json.loads(request.body)
            print(data)
            blog_id = data["id"]
            auth_token = request.COOKIES.get('auth_token')
            blog = Blog.objects.filter(id=uuid.UUID(blog_id))

            if(len(blog) > 0):
                users = AuthToken.objects.filter(token=auth_token)
                if len(users) > 0:
                    blog = blog.first()
                    user = users.first().user
                    user_liked = Likes.objects.filter(blog=blog, user=user)
                    if len(user_liked) > 0:
                        return JsonResponse({ 'msg': True }, status=200)
                    else:
                        return JsonResponse({ 'msg': False }, status=200)
                else:
                    return JsonResponse({ 'msg': "Invalid User" }, status=400)
            else:
                return JsonResponse({ 'msg': "blog not found!" }, status=400)
        except KeyError:
            return Jsonresponse({ 'error': "Invalid Fields!" }, status=400)
        except Exception as e:
            trace_back = traceback.format_exc()
            message = str(e) + " " + str(trace_back)
            print("Error!", message)
            return JsonResponse({ 'error': "Internal Server Error!" }, status=500)
    else:
        return JsonResponse({ "error": "Invalid Method!" }, status=400)

@csrf_protect
@login_required
def add_comment(request, *args, **kwargs):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            blog_id = data["blog_id"]
            comment = data["comment"]
            blogs = Blog.objects.filter(id=blog_id)

            if(len(blogs) > 0):
                auth_token = request.COOKIES.get("auth_token")
                tokens = AuthToken.objects.filter(token=auth_token)

                if(len(tokens) > 0):
                    user = tokens.first().user
                    blog = blogs.first()

                    cmt = Comments()
                    cmt.comment = comment
                    cmt.user = user
                    cmt.blog = blog
                    cmt.save()

                    return JsonResponse({ 'msg': "Comment saved Successfully!" }, status=200)
                else:
                    return JsonResponse({ 'msg': "Invalid User" }, status=400)   
            else:
                return JsonResponse({ 'msg': "blog not found!" }, status=400)
        except KeyError:
            return Jsonresponse({ 'error': "Invalid Fields!" }, status=400)
        except Exception as e:
            trace_back = traceback.format_exc()
            message = str(e) + " " + str(trace_back)
            print("Error!", message)
            return JsonResponse({ 'error': "Internal Server Error!" }, status=500)
    else:    
        return JsonResponse({ "error": "Invalid Method!" }, status=400)

@csrf_protect
def get_comments(request, *args, **kwargs):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            blog_id = data["blog_id"]
            blogs = Blog.objects.filter(id=blog_id)

            if(len(blogs) > 0):
                blog = blogs.first()
                comments = Comments.objects.filter(blog=blog)
                serialized_comments = CommentsSerializer(comments, many=True)
                return JsonResponse({ 'msg': serialized_comments.data }, status=200)  
            else:
                return JsonResponse({ 'msg': "blog not found!" }, status=400)
        except KeyError:
            return Jsonresponse({ 'error': "Invalid Fields!" }, status=400)
        except Exception as e:
            trace_back = traceback.format_exc()
            message = str(e) + " " + str(trace_back)
            print("Error!", message)
            return JsonResponse({ 'error': "Internal Server Error!" }, status=500)
    else:    
        return JsonResponse({ "error": "Invalid Method!" }, status=400)

@csrf_protect
def blog(request, *args, **kwargs):
    if request.method == 'GET':
        try:
            blog_id = request.GET.get("id")
            blog = Blog.objects.filter(id=uuid.UUID(blog_id))
            if len(blog) > 0:
                blog = blog.first()
                serialized_blog = BlogSerializer(blog, many=False)
                return JsonResponse({ 'blog': serialized_blog.data }, status=200)
            else:
                return JsonResponse({ "error": "Blog not found!" }, status=404)
        except KeyError:
            return JsonResponse({ 'error': "Invalid Request" }, status=400)
        except Exception as e:
            trace_back = traceback.format_exc()
            message = str(e) + " " + str(trace_back)
            print("Error!", message)
            return JsonResponse({ 'error': "Internal Server Error!" }, status=500)
    else:
        return JsonResponse({ "error": "Invalid Method!" }, status=400)