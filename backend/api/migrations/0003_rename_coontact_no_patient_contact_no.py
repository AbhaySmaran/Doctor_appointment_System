# Generated by Django 5.0.7 on 2024-08-01 06:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_patient'),
    ]

    operations = [
        migrations.RenameField(
            model_name='patient',
            old_name='coontact_no',
            new_name='contact_no',
        ),
    ]
