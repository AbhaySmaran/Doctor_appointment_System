from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username","email",'role','password']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self,validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class DoctorRegisterSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Doctor
        fields = '__all__'

    def create(self,validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        doctor = Doctor.objects.create(user=user, **validated_data)
        return doctor
