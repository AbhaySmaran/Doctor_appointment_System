# Generated by Django 5.0.7 on 2024-08-31 10:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0012_followupappointments'),
    ]

    operations = [
        migrations.AddField(
            model_name='prescription',
            name='messege',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='report',
            name='messege',
            field=models.TextField(blank=True),
        ),
    ]