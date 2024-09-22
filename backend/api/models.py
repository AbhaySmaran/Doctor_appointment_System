from django.db import models
import hashlib
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager
import os
import time
from django.core.exceptions import ValidationError
from django.db import models

class Patient(models.Model):
    id = models.BigAutoField(primary_key=True)
    uuid = models.CharField(max_length=255, unique=True, blank=True)
    full_name = models.CharField(max_length=255)
    age = models.IntegerField()
    email = models.CharField(max_length=255, blank=True, null=True)
    gender = models.CharField(max_length=10)
    dob = models.DateField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    nationality = models.CharField(max_length=255, blank=True, null=True)
    contact_no = models.CharField(max_length=20)
    joined_on = models.DateField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20 ,default='Active')

    def save(self, *args, **kwargs): 
        super().save(*args, **kwargs)
        if (self.uuid == '' or not self.uuid):
            if (self.dob == "" or not self.dob):
                unique_id = f"P{self.joined_on.strftime('%Y%m%d')}{self.id}"
            else:
                unique_id = f"P{self.dob.strftime('%Y%m%d')}{self.id}"
            Patient.objects.filter(id=self.id).update(uuid=unique_id)


    def __str__(self):
        return self.full_name
    
class Department(models.Model):
    dept_name = models.CharField(max_length=255, unique = True)
    dept_code = models.CharField(max_length=255, unique = True)
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
        extra_fields.setdefault('role', 'super_admin') 
         
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email=email, password=password, username=username, **extra_fields)


class CustomUser(AbstractBaseUser):
    ROLES = [
        ('doctor', 'Doctor'),
        ('receptionist', 'Receptionist'),
        ('super_admin', 'Super Admin'),
    ]

    id = models.BigAutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLES,blank=True)
    status = models.CharField(max_length=20, default='active')

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
    id = models.BigAutoField(primary_key=True)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'doctor'})
    department = models.ForeignKey(Department , on_delete = models.CASCADE)
    doc_uid = models.CharField(max_length=20, blank=True)
    full_name =models.CharField(max_length=100)
    contact = models.CharField(max_length = 15, blank = True)
    specialization = models.CharField(max_length=50)
    fee = models.IntegerField(null=True, blank=True)
    degree  = models.CharField(max_length = 100, blank=True)
    joined_on = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=15, default='Active')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.doc_uid:
            
            dept_code = self.department.dept_code
            unique_id = f"D{dept_code}{self.id}"
            Doctor.objects.filter(id=self.id).update(doc_uid=unique_id)

    def __str__(self):
        return self.user.email


class Receptionist(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'receptionist'})
    uuid = models.CharField(max_length=100,blank=True)
    full_name = models.CharField(max_length=100)
    contact_no = models.CharField(max_length=15)
    status = models.CharField(max_length=15, default='Active')

    def save(self, *args, **kwargs):
        super().save(*args,**kwargs)
        if not self.uuid:
            unique_id = f"ADM00{self.id}"
            Receptionist.objects.filter(id=self.id).update(uuid=unique_id)

    def __str__(self):
        return self.user.username

def issue_upload_to(instance, filename):
    # timestamp = instance.Created_Date.strftime('%Y%M%D_%H%M%S')
    timestamp = int(time.time())
    extension = os.path.splitext(filename)[1]    
    new_filename = f"{instance.Issue_Caption}_{timestamp}{extension}"
    return f'support_files/{instance.Issue_Caption}/{new_filename}'
    # return f'prescription_files/{instance.patient.uuid}/{filename}'

class Support(models.Model):
    Ticket_id = models.AutoField( primary_key=True)
    Customer_Name = models.CharField(max_length=100)
    Customer_ID = models.CharField(max_length=20)
    Issue_Caption= models.CharField(max_length=50,default='Screen Issue')
    Issue_Description = models.TextField()
    Priority = models.CharField(max_length=20, default='low')
    Status = models.CharField(max_length=20, default='Open')
    Assigned_to = models.CharField(max_length=50,blank=True)
    Comments = models.TextField(blank=True)
    created_by = models.CharField(max_length=50,blank=True)
    Created_Date = models.DateField(auto_now_add=True)
    Last_Updated_Date = models.DateField(auto_now=True)
    Resolution_date = models.DateField(blank=True, null=True)
    Issue_ScreenShot = models.FileField(blank=True,upload_to=issue_upload_to)

    def clean(self):
        # Validate file extension
        allowed_extensions = ['.jpeg', '.jpg', '.png']
        file_extension = os.path.splitext(self.report_file.name)[1].lower()
        if file_extension not in allowed_extensions:
            raise ValidationError("Only JPEG, JPG, and PNG files are allowed.")

        # Validate file size
        if self.report_file.size > 10 * 1024 * 1024:  # 15 MB
            raise ValidationError("File size must be less than 15 MB.")
        
        # Combined error message if both conditions fail
        if file_extension not in allowed_extensions and self.report_file.size > 10 * 1024 * 1024:
            raise ValidationError("Only JPEG, JPG, and PNG files are allowed and file size must be less than 10 MB.")