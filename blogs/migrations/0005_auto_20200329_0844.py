# Generated by Django 3.0.4 on 2020-03-29 08:44

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blogs', '0004_auto_20200329_0841'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blog',
            name='created_time',
            field=models.TimeField(default=datetime.datetime.now),
        ),
    ]
