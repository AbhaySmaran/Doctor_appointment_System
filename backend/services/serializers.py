from rest_framework import serializers
from .models import *
from api.serializers import *
from api.models import *

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'


class AppointmentViewSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()
    doctor = DoctorViewSerializer()
    class Meta:
        model = Appointment
        fields = '__all__'

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = '__all__'

class ReportUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields= '__all__'

    def validate_report_file(self, file):
        allowed_extensions = ['.pdf', '.jpeg', '.jpg', '.png']
        file_extension = os.path.splitext(file.name)[1].lower()

        errors = []
        if file_extension not in allowed_extensions:
            errors.append("Only PDF, JPEG, JPG, and PNG files are allowed.")
        
        if file.size > 15 * 1024 * 1024:  # 15 MB
            errors.append("File size must be less than 15 MB.")
        
        if errors:
            raise serializers.ValidationError(" ".join(errors))
        
        return file

class ReportViewSerializer(serializers.ModelSerializer):
    patient = PatientSerializer()
    class Meta:
        model = Report
        fields = '__all__'

class PrescriptionUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'
    
    def validate_prescription_file(self, file):
        allowed_extensions = ['.pdf', '.jpeg', '.jpg', '.png']
        file_extension = os.path.splitext(file.name)[1].lower()

        errors = []
        if file_extension not in allowed_extensions:
            errors.append("Only PDF, JPEG, JPG, and PNG files are allowed.")
        
        if file.size > 10 * 1024 * 1024:  # 15 MB
            errors.append("File size must be less than 10 MB.")
        
        if errors:
            raise serializers.ValidationError(" ".join(errors))
        
        return file

class PrescriptionSerializer(serializers.ModelSerializer):
    patient=PatientSerializer()
    doctor = DoctorViewSerializer()
    class Meta:
        model = Prescription
        fields= '__all__'

class EmailSerializer(serializers.Serializer):
    subject = serializers.CharField(max_length=255)
    message = serializers.CharField()
    recipient = serializers.EmailField()
    cc = serializers.ListField(
        child=serializers.EmailField(),
        required=False,
        allow_empty=True 
    )
    bcc = serializers.ListField(
        child=serializers.EmailField(),
        required=False,
        allow_empty=True
    )

class FollowUpSerializer(serializers.Serializer):
    patient_uuid = serializers.CharField()
    follow_up_date = serializers.DateField()


class DailyAppointmentsSerializer(serializers.Serializer):
    appointment_date = serializers.DateField()
    total_appointments = serializers.IntegerField()


class TestReportSerializer(serializers.Serializer):
    test_code = serializers.CharField()
    report_count = serializers.IntegerField()

class FollowUpAppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FollowUpAppointments
        fields = '__all__'