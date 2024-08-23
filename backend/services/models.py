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
    status = models.CharField(max_length=20, default='active')

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

        # if self.report_file:
        #     file_extension = self.report_file.name.split('.')[-1]
        #     new_file_name = f"{self.name}_{formatted_date}.{file_extension}"
        #     self.report_file.name = new_file_name
        #     self.save(update_fields=['report_file'])

    def __str__(self):
        return self.name

class HospitalVisitLog(models.Model):
    patiend = models.ForeignKey(Patient, to_field='uuid', on_delete=models.CASCADE)



def prescription_upload_to(instance, filename):
    return f'prescription_files/{instance.patient.uuid}/{filename}'

class Prescription(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, to_field='uuid',on_delete=models.CASCADE)
    name= models.CharField(max_length=100, blank=True)
    prescription_files = models.FileField(upload_to=prescription_upload_to)
    uploaded_on = models.DateTimeField(auto_now_add=True)
    uploaded_by= models.CharField(max_length=100)

    def save(self,*args,**kwargs):
        super().save(*args,**kwargs)
        if not self.name:
            formatted_date = self.uploaded_on.strftime('%Y%M%D_%H%M%S')
            d_id = self.doctor.doc_uid
            file_name = f"{d_id}_{formatted_date}"
            self.name = file_name
            self.save(update_fields=['name'])
            



