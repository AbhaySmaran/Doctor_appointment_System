# Generated by Django 5.0.7 on 2024-09-01 05:17

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0016_report_appointment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='report',
            name='appointment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='services.appointment'),
        ),
    ]