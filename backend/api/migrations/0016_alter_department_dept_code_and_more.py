# Generated by Django 5.0.7 on 2024-09-07 07:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_alter_customuser_role'),
    ]

    operations = [
        migrations.AlterField(
            model_name='department',
            name='dept_code',
            field=models.CharField(max_length=255, unique=True),
        ),
        migrations.AlterField(
            model_name='department',
            name='dept_name',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
