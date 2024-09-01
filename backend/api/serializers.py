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
    # department= serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    class Meta:
        model = Doctor
        fields = ["user","id", "department", "doc_uid", "full_name","contact","specialization","fee","degree","joined_on"]
        read_only_fields = ['user']

class ReceptionistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receptionist
        fields = ["user","id","uuid","full_name","contact_no"]
        read_only_fields = ['user']

class DoctorViewSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Doctor
        fields = '__all__'

class ReceptionistViewSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Receptionist
        fields = '__all__'

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

class SupportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Support
        fields = '__all__'
    
    def validate_Issue_ScreenShot(self, file):
        allowed_extensions = ['.jpeg', '.jpg', '.png']
        file_extension = os.path.splitext(file.name)[1].lower()

        errors = []
        if file_extension not in allowed_extensions:
            errors.append("Only JPEG, JPG, and PNG files are allowed.")
        
        if file.size > 10 * 1024 * 1024:  # 15 MB
            errors.append("File size must be less than 10 MB.")
        
        if errors:
            raise serializers.ValidationError(" ".join(errors))
        
        return file




