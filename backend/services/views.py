from rest_framework.views import APIView
from .serializers import *
from .models import *
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from api.models import Patient

class AppointmentBookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        # contact = request.data.get('contact')
        # patient = Patient.objects.filter(contact_no = contact)
        serializer = AppointmentSerializer( data= request.data) 
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Appointment booked"}) 
        return Response(serializer.errors)


class AppointmentHistoryView(APIView):
    def get(self, request,id=None, format=None):
        appointments = Appointment.objects.all()
        serializer = AppointmentViewSerializer(appointments, many=True)
        if id is not None:
            appointment = Appointment.objects.get(pk=id)
            serializer = AppointmentViewSerializer(appointment)
        return Response(serializer.data)

class TestViews(APIView):
    def post(self, request, format=None):
        serializer = TestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': "New test added"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self,request, format=None):
        test = Test.objects.all()
        serializer = TestSerializer(test, many=True)
        return Response(serializer.data)
    
class ReportUploadView(APIView):
    def post(self, request, format=None):
        serializer = ReportUploadSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Report Uploaded Successfully'}, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, format=None):
        report = Report.objects.all()
        serializer = ReportUploadSerializer(report, many=True)
        return Response(serializer.data)
    
class Patientreports(APIView):
    def get(self,request, uuid=None, format=None):
        patient = Patient.objects.get(uuid=uuid)
        reports = Report.objects.filter(patient=patient)
        serializer = ReportUploadSerializer(reports,many=True)
        return Response(serializer.data)

class PrescriptionView(APIView):
    def post(self,request,format=None):
        serializer = PrescriptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Prescription uploded succesfully"}, status= status.HTTP_201_CREATED)
        return Response(serializer.errors)

    def get(self, request, format=None):
        prescriptions = Prescription.objects.all()
        serializer = PrescriptionSerializer(prescriptions, many=True)
        return Response(serializer.data, status= status.HTTP_200_OK)


class DoctorAppointmentsView(APIView):
    def get(self, request, format=None):
        doctor = Doctor.objects.get(user=request.user)
        appointments = Appointment.objects.filter(doctor=doctor).order_by('date')
        serializer = AppointmentViewSerializer(appointments, many=True)
        return Response(serializer.data)

