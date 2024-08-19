from rest_framework import serializers
from .models import *
from api.serializers import PatientSerializer,DoctorViewSerializer
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