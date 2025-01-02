from rest_framework.views import APIView
from rest_framework import generics
from .serializers import *
from .models import *
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework import status
from api.models import Patient
from datetime import datetime , timedelta
from django.core.mail import send_mail
from django.conf import settings
from django.core.mail import EmailMessage
from django.shortcuts import get_list_or_404,get_object_or_404
from django.utils.dateparse import parse_date

from django.db.models import Count, Func, F
from django.db.models.functions import TruncMonth,TruncDate,ExtractYear,ExtractMonth,Substr,Right



class AppointmentBookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        # contact = request.data.get('contact')
        # patient = Patient.objects.filter(contact_no = contact)
        serializer = AppointmentSerializer( data= request.data) 
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"msg": "Appointment booked"}) 
        return Response(serializer.errors)


class AppointmentHistoryView(APIView):
    def get(self, request,id=None, format=None):
        appointments = Appointment.objects.all().order_by('status','date')
        serializer = AppointmentViewSerializer(appointments, many=True)
        if id is not None:
            appointment = Appointment.objects.get(pk=id)
            serializer = AppointmentViewSerializer(appointment)
        return Response(serializer.data)

    def put(self,request,id=None, format=None):
        if id is not None:
            appointment = Appointment.objects.get(id=id)
            serializer = AppointmentViewSerializer(appointment, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"msg": 'Appointment Updated'}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
    

class AppointmentListView(APIView):

    def get(self, request, year=None, month=None, day=None):
        # Start with all appointments
        appointments = Appointment.objects.all()

        # Filter by year if provided
        if year:
            appointments = appointments.filter(date__year=year)

        # Filter by month if provided
        if month:
            appointments = appointments.filter(date__month=month)

        # Filter by day if provided
        if day:
            appointments = appointments.filter(date__day=day)

        serializer = AppointmentViewSerializer(appointments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        

class TestViews(APIView):
    def post(self, request, format=None):
        serializer = TestSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
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
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'msg': 'Report Uploaded Successfully'}, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, format=None):
        report = Report.objects.all()
        serializer = ReportUploadSerializer(report, many=True)
        return Response(serializer.data)
    
class Patientreports(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request, uuid=None, format=None):
        patient = Patient.objects.get(uuid=uuid)
        reports = Report.objects.filter(patient=patient)
        serializer = ReportViewSerializer(reports,many=True)
        return Response(serializer.data)
    
    def delete(self, request, id=None, format=None):
        report = Report.objects.get(id=id)
        report.delete()
        return Response({"msg": "Report deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
class PrescriptionUploadView(APIView):
    def post(self,request,format=None):
        serializer = PrescriptionUploadSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"msg": "Prescription uploded succesfully"}, status= status.HTTP_201_CREATED)
        return Response(serializer.errors)

    def get(self, request, format=None):
        prescriptions = Prescription.objects.all()
        serializer = PrescriptionSerializer(prescriptions, many=True)
        return Response(serializer.data, status= status.HTTP_200_OK)
    
class PatientPrescriptionView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request, uuid=None, format=None):
        patient = Patient.objects.get(uuid=uuid)
        prescriptions = Prescription.objects.filter(patient=patient)
        serializer = PrescriptionSerializer(prescriptions,many=True)
        return Response(serializer.data)

    def delete(self, request, id=None, format=None):
        prescription = Prescription.objects.get(id=id)
        prescription.delete()
        return Response({"msg": "Prescription deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class DoctorAppointmentsView(APIView):
    def get(self, request, format=None):
        doctor = Doctor.objects.get(user=request.user)
        appointments = Appointment.objects.filter(doctor=doctor).order_by('-date')
        serializer = AppointmentViewSerializer(appointments, many=True)
        return Response(serializer.data)

class PatientAppointsView(APIView):
    def get(self, request,uuid, format=None):
        patient = Patient.objects.get(uuid=uuid)
        appointments = Appointment.objects.filter(patient=patient,status="Checked").order_by('-date')
        serializer = AppointmentViewSerializer(appointments, many=True)
        return Response(serializer.data)





class FollowUpEmailView(APIView):
    def post(self, request):
        serializer = FollowUpSerializer(data=request.data)
        if serializer.is_valid():
            patient_uuid = serializer.validated_data['patient_uuid']
            follow_up_date = serializer.validated_data['follow_up_date']

            # Fetch patient email using the uuid
            try:
                patient = Patient.objects.get(uuid=patient_uuid)
                patient_email = patient.email
            except Patient.DoesNotExist:
                return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

            # Prepare email content
            subject = 'Follow-Up Appointment Reminder'
            message = f"Dear {patient.full_name},\n\nThis is a reminder for your follow-up appointment scheduled on {follow_up_date}.\n\nThank you!"

            # Send the email
            send_mail(subject, message, None, [patient_email])

            return Response({"message": "Follow-up email sent successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class DailyAppointmentsCountView(APIView):
    def get(self, request, year, month):
        try:
            year = int(year)
            month = int(month)
        except ValueError:
            return Response({"error": "Invalid year or month"}, status=400)
        
        # Start and end dates for the month
        start_date = datetime(year, month, 1)
        end_date = (start_date + timedelta(days=31)).replace(day=1) - timedelta(days=1)
        
        # Generate all dates in the month
        all_dates = [start_date + timedelta(days=i) for i in range((end_date - start_date).days + 1)]
        
        # Get appointment data filtering by year and month
        appointments = (Appointment.objects
                        .filter(date__year=year, date__month=month)
                        .annotate(appointment_date=TruncDate('date'))
                        .values('appointment_date')
                        .annotate(total_appointments=Count('id'))
                        .order_by('appointment_date'))
        
        # Debugging line to print query results
        # print("Appointments Query Output:", list(appointments))
        
        appointments_dict = {item['appointment_date']: item['total_appointments'] for item in appointments}
        
        data = [{'appointment_date': date.strftime('%Y-%m-%d'), 'total_appointments': appointments_dict.get(date.date(), 0)}
                for date in all_dates]
        
        serializer = DailyAppointmentsSerializer(data, many=True)
        return Response(serializer.data)




class TestReportCountAPIView(APIView):

    def get(self, request, test_type, *args, **kwargs):
        # Filter the tests by the provided test_type and annotate with the report count
        tests = (
            Test.objects.filter(test_type=test_type)
            .annotate(report_count=Count('report'))
            .values('test_code', 'report_count')
        )
        
        # Serialize the queryset
        
        
        # Check if any tests are found for the given test_type
        if tests.exists():
            serializer = TestReportSerializer(tests, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        empty_data = [{"test_code": "No Data", "report_count": 0}]
        # If no tests are found, return a 404 Not Found response
        return Response(empty_data, status=status.HTTP_200_OK)    


class FollowUpAppointmentView(APIView):
    def post(self, request, format=None):
        serializer = FollowUpAppointmentSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'msg':'Follow up date generated'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors)
    
    def get(self, request, format=None):
        followUpAppointments = FollowUpAppointments.objects.all()
        serializer = FollowUpAppointmentSerializer(followUpAppointments)
        return Response(serializer.data)