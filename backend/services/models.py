from django.db import models
from api.models import CustomUser,Doctor,Receptionist,Patient
from datetime import datetime
import os
import time
from django.core.exceptions import ValidationError
# from django.utils.timezone import now
# from datetime import today

# Create your views here.

class Appointment(models.Model):
    id = models.BigAutoField(primary_key=True)
    patient = models.ForeignKey(Patient, to_field='uuid', on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    date = models.DateField()
    advice = models.TextField(blank=True)
    booked_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    booked_by = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=20, default='Active')

    # def save(self, *args, **kwargs):


    def __str__(self):
        return f"{self.patient.full_name} with {self.doctor.full_name}"



class Test(models.Model):
    TEST_TYPE_CHOICES = [
        ('Test', 'Test'),
        ('Diagnostic', 'Diagnostic'),
    ]

    test_name = models.CharField(max_length=200, unique=True)
    test_type = models.CharField(max_length = 100, choices= TEST_TYPE_CHOICES)
    test_code = models.CharField(max_length=10, unique=True)
 
    def __str__(self):
        return self.test_name
    
def report_upload_to(instance, filename):
    timestamp = int(time.time())    
    extension = os.path.splitext(filename)[1]    
    new_filename = f"{instance.test.test_code}_{timestamp}{extension}"
    year = time.strftime('%Y')  # Get the current year
    return f'report_files/{year}/{instance.patient.uuid}/{new_filename}'

class Report(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=200, blank=True)
    patient = models.ForeignKey(Patient, to_field='uuid', on_delete=models.CASCADE)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    report_file = models.FileField( upload_to=report_upload_to)
    uploaded_on = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.CharField(max_length=50, blank=True)
    year = models.IntegerField(blank=True, null=True)
    message = models.TextField(blank=True)

    def clean(self):
        # Validate file extension
        allowed_extensions = ['.pdf', '.jpeg', '.jpg', '.png']
        file_extension = os.path.splitext(self.report_file.name)[1].lower()
        if file_extension not in allowed_extensions:
            raise ValidationError("Only PDF, JPEG, JPG, and PNG files are allowed.")

        # Validate file size
        if self.report_file.size > 15 * 1024 * 1024:  # 15 MB
            raise ValidationError("File size must be less than 15 MB.")
        
        # Combined error message if both conditions fail
        if file_extension not in allowed_extensions and self.report_file.size > 15 * 1024 * 1024:
            raise ValidationError("Only PDF, JPEG, JPG, and PNG files are allowed and file size must be less than 15 MB.")

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.name:
            test_name = self.test.test_name
            file_name = f"{test_name}"
            self.name = file_name
        if not self.year:
            self.year = self.uploaded_on.year
            self.save(update_fields=['name','year'])

    def __str__(self):
        return self.name
    


def prescription_upload_to(instance, filename):
    timestamp = int(time.time())    
    extension = os.path.splitext(filename)[1]    
    new_filename = f"{instance.doctor.user.username}_{timestamp}{extension}"
    year = time.strftime('%Y')  # Get the current year
    return f'prescription_files/{year}/{instance.patient.uuid}/{new_filename}'
    # return f'prescription_files/{instance.patient.uuid}/{filename}'


class Prescription(models.Model):
    id = models.BigAutoField(primary_key=True)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, to_field='uuid',on_delete=models.CASCADE)
    name= models.CharField(max_length=100, blank=True)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    prescription_file = models.FileField(upload_to=prescription_upload_to)
    uploaded_on = models.DateTimeField(auto_now_add=True)
    uploaded_by= models.CharField(max_length=100)
    message = models.TextField(blank=True)

    def clean(self):
        # Validate file extension
        allowed_extensions = ['.pdf', '.jpeg', '.jpg', '.png']
        file_extension = os.path.splitext(self.prescription_file.name)[1].lower()
        if file_extension not in allowed_extensions:
            raise ValidationError("Only PDF, JPEG, JPG, and PNG files are allowed.")

        # Validate file size
        if self.prescription_file.size > 10 * 1024 * 1024:  # 15 MB
            raise ValidationError("File size must be less than 10 MB.")
        
        # Combined error message if both conditions fail
        if file_extension not in allowed_extensions and self.prescription_file.size > 10 * 1024 * 1024:
            raise ValidationError("Only PDF, JPEG, JPG, and PNG files are allowed and file size must be less than 10 MB.")

    def save(self,*args,**kwargs):
        super().save(*args,**kwargs)
        if not self.name:
            formatted_date = self.uploaded_on.strftime('%Y%M%D_%H%M%S')
            d_id = self.doctor.full_name
            file_name = f"{d_id}_{formatted_date}"
            self.name = file_name
            self.save(update_fields=['name'])


class FollowUpAppointments(models.Model):
    patient =  models.ForeignKey(Patient, on_delete= models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    followUpDate = models.DateTimeField()
    booked_on = models.DateField(auto_now_add=True)
    updated_on = models.DateField(auto_now=True)
    updated_by = models.CharField(max_length = 100)








            




