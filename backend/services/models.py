from django.db import models
from api.models import CustomUser,Doctor,Receptionist,Patient
# Create your views here.

# class Appointment(models.Model):
#     patient = models.ForeignKey(Patient, on_delete=models.CASCADE, blank=True)
#     doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
#     contact_no = models.CharField(max_length=20)
#     date = models.DateField()
#     booked_on = models.DateTimeField(auto_now_add=True)
#     updated_on = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"{self.patient.full_name} with {self.doctor.full_name}"

# class AppointmentDetail(models.Model):
#     patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
#     doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
#     status = models.CharField(max_length=20, blank=True) 
    

class Test(models.Model):
    test_name = models.CharField(max_length=200)
    test_code = models.CharField(max_length=10)

    def __str___(self):
        return self.test_name
    
# class Resport(models.Model):
#     patient = models.ForeignKey(Patient, on_delete= models.CASCADE)
#     test = models.ForeignKey(Test, on_delete=models.CASCADE)



