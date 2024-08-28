from rest_framework.views import APIView
from .serializers import *
from .models import *
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework import status
from api.models import Patient

from django.core.mail import send_mail
from django.conf import settings
from django.core.mail import EmailMessage

# # views.py
# from django.http import FileResponse, HttpResponseForbidden
# from django.contrib.auth.decorators import login_required
# import os

# @login_required
# def protected_static(request, filename):
#     file_path = os.path.join('static', filename)
#     if os.path.exists(file_path):
#         return FileResponse(open(file_path, 'rb'))
#     else:
#         return HttpResponseForbidden("You are not allowed to access this file.")


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
    permission_classes=[IsAuthenticated]
    def get(self,request, uuid=None, format=None):
        patient = Patient.objects.get(uuid=uuid)
        reports = Report.objects.filter(patient=patient)
        serializer = ReportViewSerializer(reports,many=True)
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


class SendEmailView(APIView):
    def post(self, request):
        serializer = EmailSerializer(data=request.data)
        if serializer.is_valid():
            subject = serializer.validated_data['subject']
            message = serializer.validated_data['message']
            recipient = serializer.validated_data['recipient']
            cc = serializer.validated_data.get('cc', [])
            bcc = serializer.validated_data.get('bcc', [])

            try:
                # Send email to primary recipient
                email_to = EmailMessage(
                    subject=subject,
                    body=message,
                    to=[recipient],
                )
                email_to.send()

                # Send separate email to CC recipients
                if cc:
                    email_cc = EmailMessage(
                        subject=subject,
                        body=message,
                        to=cc,  # Send as "To" to simulate CC separately
                    )
                    email_cc.send()

                # Send separate email to BCC recipients
                if bcc:
                    email_bcc = EmailMessage(
                        subject=subject,
                        body=message,
                        to=bcc,  # Send as "To" to simulate BCC separately
                    )
                    email_bcc.send()

                return Response({'status': 'Emails sent successfully'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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
