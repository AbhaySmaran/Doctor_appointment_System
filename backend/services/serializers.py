from rest_framework import serializers
from .models import *
from api.serializers import PatientSerializer,DoctorViewSerializer
from api.models import *

# class AppointmentSerializer(serializers.ModelSerializer):
#     contact = serializers.CharField(max_length = 20)
#     class Meta:
#         model = Appointment
#         fields = ['contact' ,'doctor', 'date']

#         def create(self, validated_data):
#             contact = validated_data.pop("contact")
#             patient = Patient.objects.get(contact_no = contact)
#             return Appointment.objects.create(patient = patient, **validated_data)


# class AppointmentViewSerializer(serializers.ModelSerializer):
#     patient = PatientSerializer()
#     doctor = DoctorViewSerializer()
#     class Meta:
#         model = Appointment
#         fields = '__all__'

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = '__all__'