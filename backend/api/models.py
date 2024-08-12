from django.db import models
import hashlib
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager

from django.db import models

class Patient(models.Model):
    uuid = models.CharField(max_length=255, unique=True, blank=True)
    username = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    age = models.IntegerField()
    email = models.CharField(max_length=255)
    gender = models.CharField(max_length=10)
    dob = models.DateField()
    address = models.CharField(max_length=255, blank=True, null=True)
    nationality = models.CharField(max_length=255, blank=True, null=True)
    contact_no = models.CharField(max_length=20, blank=True, null=True)
    joined_on = models.DateTimeField()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.uuid:
            unique_id = f"P{self.dob.strftime('%Y%m%d')}{self.id}"
            Patient.objects.filter(id=self.id).update(uuid=unique_id)


    def __str__(self):
        return self.username
    
class Department(models.Model):
    dept_name = models.CharField(max_length=255)
    dept_code = models.CharField(max_length=255)
    dept_location = models.CharField(max_length=255, null=True, blank=True, default=None)
    dept_contact_no = models.CharField(max_length=255, null=True, blank=True, default=None)

    def __str__(self):
        return self.dept_name




class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, username=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        if not username:
            raise ValueError("Users must have a username")
        
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, username=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_admin', True)  
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email=email, password=password, username=username, **extra_fields)


class CustomUser(AbstractBaseUser):
    ROLES = [
        ('doctor', 'Doctor'),
        ('receptionist', 'Receptionist'),
    ]
    
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLES, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)  
    is_staff = models.BooleanField(default=False)  
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.username 
    
    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser

class Doctor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'doctor'})
    department = models.ForeignKey(Department , on_delete = models.CASCADE)
    doc_uid = models.CharField(max_length=20, blank=True)
    full_name =models.CharField(max_length=100)
    contact = models.CharField(max_length = 15, blank = True)
    specialization = models.CharField(max_length=50)
    fee = models.IntegerField()
    degree  = models.CharField(max_length = 100, blank=True)
    joined_on = models.DateField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.doc_uid:
            dept_code = self.department.dept_code
            unique_id = f"D{dept_code}{self.id}"
            Doctor.objects.filter(id=self.id).update(doc_uid=unique_id)

    def __str__(self):
        return self.user.email


class Receptionist(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'receptionist'})
    uuid = models.CharField(max_length=100,blank=True)
    full_name = models.CharField(max_length=100)
    contact_no = models.CharField(max_length=15)

    def save(self, *args, **kwargs):
        super().save(*args,**kwargs)
        if not self.uuid:
            unique_id = f"ADM00{self.id}"
            Receptionist.objects.filter(id=self.id).update(uuid=unique_id)

    def __str__(self):
        return self.user.username

class Appointment(models.Model):
    patient = models.ForeignKey(Patient, on_delete= models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.patient.full_name} with {self.doctor.full_name}"