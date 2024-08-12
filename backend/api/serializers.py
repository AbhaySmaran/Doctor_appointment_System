from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import *

class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length = 255)
    class Meta:
        model = CustomUser
        fields = ['email','password','role']

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class DepartmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id",'username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role = validated_data.pop('role')
        user = CustomUser.objects.create_user(**validated_data)
        user.role = role
        user.save()
        return user
    
class DoctorSerializer(serializers.ModelSerializer):
    department= serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    user = UserSerializer()
    class Meta:
        model = Doctor
        fields = ["user","id", "department", "doc_uid", "full_name","contact","specialization","fee","degree","joined_on"]
        read_only_fields = ['user']

class ReceptionistSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Receptionist
        fields = ["user","id","uuid","full_name","contact_no"]
        read_only_fields = ['user']

class DoctorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Doctor
        fields = '__all__' 

class ReceptionistProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Receptionist
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()
    doctor = DoctorSerializer()
    class Meta:
        models = Appointment
        fields = '__all__'




