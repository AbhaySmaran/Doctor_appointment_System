# Generated by Django 5.0.7 on 2024-08-31 06:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_alter_support_resolution_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='support',
            name='created_by',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]