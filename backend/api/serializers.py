from rest_framework import serializers
from .models import *

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username","email",'role','password']
        extra_kwargs = {'password': {'write_only': True}}
    