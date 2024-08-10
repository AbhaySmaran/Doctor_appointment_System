from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import *

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class DepartmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    dept_id = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())

    class Meta:
        model = Doctor
        fields = '__all__'
        read_only_fields = ['user']

class ReceptionistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receptionist
        fields = '__all__'
        read_only_fields = ['user']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role = validated_data.pop('role')
        user = CustomUser.objects.create_user(**validated_data)
        user.role = role
        user.save()
        return user


# class ReceptionistLoginSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = 



