# Generated by Django 3.0.4 on 2020-03-29 08:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blogs', '0002_auto_20200329_0821'),
    ]

    operations = [
        migrations.AddField(
            model_name='blog',
            name='created_time',
            field=models.TimeField(auto_now=True),
        ),
    ]
