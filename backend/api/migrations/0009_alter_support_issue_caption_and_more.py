# Generated by Django 5.0.7 on 2024-08-30 13:32

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_support'),
    ]

    operations = [
        migrations.AlterField(
            model_name='support',
            name='Issue_Caption',
            field=models.CharField(default='Screen Issue', max_length=50),
        ),
        migrations.AlterField(
            model_name='support',
            name='Issue_ScreenShot',
            field=models.FileField(upload_to=api.models.issue_upload_to),
        ),
        migrations.AlterField(
            model_name='support',
            name='Priority',
            field=models.CharField(default='low', max_length=20),
        ),
        migrations.AlterField(
            model_name='support',
            name='Status',
            field=models.CharField(default='Open', max_length=20),
        ),
    ]