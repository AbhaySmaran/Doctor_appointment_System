# Generated by Django 5.0.7 on 2024-08-30 04:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_patient_address'),
    ]

    operations = [
        migrations.AddField(
            model_name='doctor',
            name='status',
            field=models.CharField(default='Active', max_length=15),
        ),
        migrations.AddField(
            model_name='receptionist',
            name='status',
            field=models.CharField(default='Active', max_length=15),
        ),
        migrations.AlterField(
            model_name='patient',
            name='status',
            field=models.CharField(default='Active', max_length=20),
        ),
    ]