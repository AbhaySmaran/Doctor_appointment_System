from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import UserSerializer,DoctorRegisterSerializer
from .models import *
from rest_framework.response import Response
from rest_framework import status

class UserRegisterView(APIView):
    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg":"Registration Successful"},status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DoctorRegisterView(APIView):
    def post(self,request, format=None):
        serializer = DoctorRegisterSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg": "ok"})
        return Response(serializer.errors)