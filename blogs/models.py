from django.db import models
from users.models import User
import uuid
from datetime import datetime
from django.utils import timezone

# Create your models here.
class Blog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateField(default=timezone.now)
    created_time = models.TimeField(default=datetime.now)

    def __str__(self):
        return self.title
    