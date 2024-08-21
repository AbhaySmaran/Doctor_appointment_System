# Generated by Django 5.0.7 on 2024-08-20 14:32

import django.db.models.deletion
import services.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
        ('services', '0004_appointment_status_hospitalvisitlog'),
    ]

    operations = [
        migrations.CreateModel(
            name='Prescription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('name', models.CharField(blank=True, max_length=100)),
                ('prescription_files', models.FileField(upload_to=services.models.prescription_upload_to)),
                ('uploaded_on', models.DateTimeField(auto_now_add=True)),
                ('uploaded_by', models.CharField(max_length=100)),
                ('doctor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.doctor')),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.patient')),
            ],
        ),
    ]
