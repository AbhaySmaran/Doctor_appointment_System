from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    role_choices = (
        ("Receptionist","Receptionist"),
        ("Doctor","Doctor"),
        ("Patient","Patient"),
    )
    email = models.EmailField(max_length=100, unique=True)
    role = models.CharField(max_length=50, choices=role_choices)

    def __str__(self):
        return self.username

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    specialization = models.CharField(max_length=100)
    fee = models.IntegerField()

    def __str__(self):
        return self.user.username

class Patient(models.Model):
    pid = models.AutoField
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    address = models.CharField(max_length=100)
    contact_no = models.CharField(max_length=15)

    def __str__(self):
        return self.user.username
    
class Receptionist(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    
    def __str__(self):
        return self.user.username


class Tests(models.Model):
    test_name = models.CharField(max_length=50)
    test_fee = models.IntegerField()

    def __str__(self):
        return self.test_name
    
class Appointment(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField(default="10:00:00")
    status = models.CharField(max_length=20,default="scheduled")

    def __str__(self):
        return f"Patient-{self.patient.user.username} Doctor-{self.doctor.user.username} on {self.date}"


class Report(models.Model):
    patient = models.ForeignKey