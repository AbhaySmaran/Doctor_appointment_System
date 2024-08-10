# from django.shortcuts import render
# from rest_framework.views import APIView
# from .serializers import UserSerializer,DoctorRegisterSerializer
# from .models import *
from rest_framework.response import Response
from rest_framework import status

from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from .models import *
from .serializers import *

class PatientView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        serializer = PatientSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "success"})
        return Response(serializer.errors)

    def get(self, request, format=None):
        Patients = Patient.objects.all()
        serializer = PatientSerializer(Patients, many=True)
        return Response(serializer.data)

class DepartmentView(APIView):
    def get(self, request, format = None):
        dept = Department.objects.all()
        serializer = DepartmentsSerializer(dept, many=True)
        return Response(serializer.data)

class UserRegistrationView(APIView):
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