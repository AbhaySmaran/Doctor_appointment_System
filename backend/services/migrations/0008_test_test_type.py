# Generated by Django 5.0.7 on 2024-08-29 16:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0007_report_year'),
    ]

    operations = [
        migrations.AddField(
            model_name='test',
            name='test_type',
            field=models.CharField(default='laboratory test', max_length=100),
        ),
    ]