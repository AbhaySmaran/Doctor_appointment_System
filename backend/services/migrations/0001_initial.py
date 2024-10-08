# Generated by Django 5.0.7 on 2024-09-20 03:17

import django.db.models.deletion
import services.models
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Test',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('test_name', models.CharField(max_length=200, unique=True)),
                ('test_type', models.CharField(choices=[('Test', 'Test'), ('Diagnostic', 'Diagnostic')], max_length=100)),
                ('test_code', models.CharField(max_length=10, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Appointment',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('date', models.DateField()),
                ('advice', models.TextField(blank=True)),
                ('booked_on', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('booked_by', models.CharField(blank=True, max_length=50)),
                ('status', models.CharField(default='active', max_length=20)),
                ('doctor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.doctor')),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.patient', to_field='uuid')),
            ],
        ),
        migrations.CreateModel(
            name='FollowUpAppointments',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('followUpDate', models.DateTimeField()),
                ('booked_on', models.DateField(auto_now_add=True)),
                ('updated_on', models.DateField(auto_now=True)),
                ('updated_by', models.CharField(max_length=100)),
                ('doctor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.doctor')),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.patient')),
            ],
        ),
        migrations.CreateModel(
            name='Prescription',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, max_length=100)),
                ('prescription_file', models.FileField(upload_to=services.models.prescription_upload_to)),
                ('uploaded_on', models.DateTimeField(auto_now_add=True)),
                ('uploaded_by', models.CharField(max_length=100)),
                ('message', models.TextField(blank=True)),
                ('appointment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='services.appointment')),
                ('doctor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.doctor')),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.patient', to_field='uuid')),
            ],
        ),
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, max_length=200)),
                ('report_file', models.FileField(upload_to=services.models.report_upload_to)),
                ('uploaded_on', models.DateTimeField(auto_now_add=True)),
                ('uploaded_by', models.CharField(blank=True, max_length=50)),
                ('year', models.IntegerField(blank=True, null=True)),
                ('message', models.TextField(blank=True)),
                ('appointment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='services.appointment')),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.patient', to_field='uuid')),
                ('test', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='services.test')),
            ],
        ),
    ]
