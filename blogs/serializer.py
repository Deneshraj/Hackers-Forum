from rest_framework import serializers
from . import models

Blog = models.Blog

class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = '__all__'