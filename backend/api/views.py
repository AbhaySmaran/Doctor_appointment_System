from rest_framework.response import Response
from rest_framework import status

from rest_framework import generics
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.views import APIView
from .models import *
from .serializers import *
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class DoctorLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            if not email or not password:
                return Response({"error": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)
            user = authenticate(email=email, password=password)
            if user is not None and user.role == 'doctor':
                tokens = get_tokens_for_user(user)
                return Response({
                    "message": "Login successful",
                    "tokens": tokens
                }, status=status.HTTP_200_OK)
            return Response({"error": "Invalid credentials or not a doctor"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ReceptionistLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.validated_data.get('email')
            password = serializer.validated_data.get('password')
            if not email or not password:
                return Response({"error": "Email and password required"}, status=status.HTTP_400_BAD_REQUEST)
            user = authenticate(email=email, password=password)
            if user is not None and user.role == 'receptionist':
                tokens = get_tokens_for_user(user)
                return Response({
                    "message": "Login successful",
                    "tokens": tokens
                }, status=status.HTTP_200_OK)
            return Response({"error": "Invalid credentials or not a receptionist"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PatientView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        serializer = PatientSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "success"})
        return Response(serializer.errors)

    def get(self, request,id=None, format=None):
        Patients = Patient.objects.all()
        serializer = PatientSerializer(Patients, many=True)
        if id is not None:
            patient = Patient.objects.get(pk=id)
            serializer = PatientSerializer(patient)
        return Response(serializer.data)
    
    def put(self, request, format=None):
        id = request.data.get('id')
        patient = Patient.objects.get(pk=id)
        serializer = PatientSerializer(patient, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Data updated successfully"})

    def delete(self, request, format=None):
        id = request.data.get('id')
        patient = Patient.objects.get(pk=id)
        patient.delete()

class DepartmentView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, format = None):
        dept = Department.objects.all()
        serializer = DepartmentsSerializer(dept, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer= DepartmentsSerializer(data= request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "Department"})
        return Response(serializer.errors)

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        user_data = request.data
        role = user_data.get('role')

        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()

            if role == 'doctor':
                doctor_data = user_data.get('doctor', {})
                doctor_serializer = DoctorSerializer(data=doctor_data)
                if doctor_serializer.is_valid():
                    doctor_serializer.save(user=user)
                else:
                    return Response(doctor_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            elif role == 'receptionist':
                receptionist_data = user_data.get('receptionist', {})
                receptionist_serializer = ReceptionistSerializer(data=receptionist_data)
                if receptionist_serializer.is_valid():
                    receptionist_serializer.save(user=user)
                else:
                    return Response(receptionist_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response(user_serializer.data, status=status.HTTP_201_CREATED)

        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ReceptionistsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, id=None ,format=None):
        Receptionists = Receptionist.objects.all()
        serializer = ReceptionistSerializer(Receptionists, many=True)
        if id is not None:
            receptionist = Receptionist.objects.get(pk=id)
            serializer = ReceptionistSerializer(receptionist)
        return Response(serializer.data)

class DoctorsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, id=None, format=None):
        doctor = Doctor.objects.all()
        serializer = DoctorSerializer(doctor, many = True)
        if id is not None:
            doctor = Doctor.objects.get(pk=id)
            serializer = DoctorSerializer(doctor)
        return Response(serializer.data)
    
    def put(self, request, format=None):
        id = request.data.get('id')
        doctor = Doctor.objects.get(pk=id)
        serializer = DoctorSerializer(doctor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Update successful'})
        
    def delete(self, request, format=None):
        id= request.data.get("id")
        doctor = Doctor.objects.get(pk=id)
        doctor.delete()

class DoctorProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        doctor = Doctor.objects.get(user=request.user)
        serializer = DoctorProfileSerializer(doctor)
        return Response(serializer.data)
        
class ReceptionistProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        receptionist = Receptionist.objects.get(user=request.user)
        serializer = ReceptionistProfileSerializer(receptionist)
        return Response(serializer.data)
    

class AppointmentsView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = AppointmentSerializer(data= request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data) 