from django.db import models
from api.models import CustomUser,Doctor,Receptionist,Patient
import os
# from django.utils.timezone import now
# from datetime import today

# Create your views here.

class Appointment(models.Model):
    patient = models.ForeignKey(Patient, to_field='uuid', on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    date = models.DateField()
    booked_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    booked_by = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=20, blank=True)

    # def save(self, *args, **kwargs):


    def __str__(self):
        return f"{self.patient.full_name} with {self.doctor.full_name}"
 
    

class Test(models.Model):
    test_name = models.CharField(max_length=200)
    test_code = models.CharField(max_length=10)
 
    def __str__(self):
        return self.test_name
    
def report_upload_to(instance, filename):
    return f'report_files/{instance.patient.uuid}/{filename}'


class Report(models.Model):
    name = models.CharField(max_length=200, blank=True)
    patient = models.ForeignKey(Patient, to_field='uuid', on_delete=models.CASCADE)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    report_file = models.FileField(blank=True, upload_to=report_upload_to)
    uploaded_on = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.CharField(max_length=50, blank=True)


    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.name:
            test_code = self.test.test_code
            formatted_date = self.uploaded_on.strftime('%Y%m%d_%H%M%S')
            file_name = f"{test_code}_{formatted_date}"
            self.name = file_name
            self.save(update_fields=['name'])

    def __str__(self):
        return self.name

