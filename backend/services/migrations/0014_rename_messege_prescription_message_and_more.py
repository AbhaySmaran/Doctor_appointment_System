# Generated by Django 5.0.7 on 2024-08-31 10:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0013_prescription_messege_report_messege'),
    ]

    operations = [
        migrations.RenameField(
            model_name='prescription',
            old_name='messege',
            new_name='message',
        ),
        migrations.RenameField(
            model_name='report',
            old_name='messege',
            new_name='message',
        ),
    ]
