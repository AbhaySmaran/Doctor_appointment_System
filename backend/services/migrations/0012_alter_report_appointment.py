# Generated by Django 5.0.7 on 2024-11-21 17:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0011_alter_report_appointment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='report',
            name='appointment',
            field=models.IntegerField(default=0),
        ),
    ]