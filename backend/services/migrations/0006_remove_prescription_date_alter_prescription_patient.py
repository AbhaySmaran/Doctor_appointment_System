# Generated by Django 5.0.7 on 2024-08-20 15:34

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
        ('services', '0005_prescription'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='prescription',
            name='date',
        ),
        migrations.AlterField(
            model_name='prescription',
            name='patient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.patient', to_field='uuid'),
        ),
    ]