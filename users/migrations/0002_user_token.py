# Generated by Django 3.0.4 on 2020-03-28 10:52

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='token',
            field=models.TextField(default=django.utils.timezone.now, max_length=128),
            preserve_default=False,
        ),
    ]
