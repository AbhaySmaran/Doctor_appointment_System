from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import password_validation
from django.contrib.auth.password_validation import validate_password
from .models import *

class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'role']

    # def validate(self, data):
    #     email = data.get('email')
    #     password = data.get('password')

    #     # Check if email and password are provided
    #     if not email:
    #         raise serializers.ValidationError({"email": "Email is required"})
    #     if not password:
    #         raise serializers.ValidationError({"password": "Password is required"})

    #     # Check if the user exists
    #     if not CustomUser.objects.filter(email=email).exists():
    #         raise serializers.ValidationError({"email": "User does not exist"})

    #     return data

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class DepartmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ["user", "id", "department", "doc_uid", "full_name", "contact", "specialization", "fee", "degree", "joined_on"]
        read_only_fields = ['user']

    def validate_full_name(self, value):
        if not value:
            raise serializers.ValidationError("Full name is required for doctors.")
        return value


class ReceptionistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receptionist
        fields = ["user", "id", "uuid", "full_name", "contact_no"]
        read_only_fields = ['user']

    def validate_full_name(self, value):
        if not value:
            raise serializers.ValidationError("Full name is required for receptionists.")
        return value


class UserSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer(required=False)  # Optional doctor serializer
    receptionist = ReceptionistSerializer(required=False)  # Optional receptionist serializer

    class Meta:
        model = CustomUser
        fields = ["id", 'username', 'email', 'password', 'role', 'doctor', 'receptionist']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role = validated_data.pop('role')

        # Handle nested serializer for doctor or receptionist
        doctor_data = validated_data.pop('doctor', None)
        receptionist_data = validated_data.pop('receptionist', None)

        # Create the user
        user = CustomUser.objects.create_user(**validated_data)
        user.role = role
        user.save()

        # Handle role-specific creation
        if role == 'doctor' and doctor_data:
            Doctor.objects.create(user=user, **doctor_data)
        elif role == 'receptionist' and receptionist_data:
            Receptionist.objects.create(user=user, **receptionist_data)

        return user

    


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

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(max_length=255, write_only=True)
    new_password = serializers.CharField(max_length=255, write_only=True)
    confirm_password = serializers.CharField(max_length=255, write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(["Old password is not correct"])
        return value

    def validate(self, attrs):
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')

        if new_password != confirm_password:
            raise serializers.ValidationError(['New password and confirm password do not match'])

        password_validation.validate_password(new_password, self.context['request'].user)
        return attrs

    def update(self, instance, validated_data):
        instance.set_password(validated_data['new_password'])
        instance.save()
        return instance
    
