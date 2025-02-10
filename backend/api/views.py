from rest_framework.response import Response
from rest_framework import status

from rest_framework import generics
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.views import APIView
from .models import *
from services.models import *
from .serializers import *
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from django.utils.timezone import now

from django.db.models import Case, When, Value, IntegerField

class Test(APIView):
    def get(self, request):
        return Response({"message": "API is working!"})

def get_tokens_for_user(user): 
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.data.get('email')
            password = serializer.data.get('password')

            if not email or not password:
                return Response({"errors": {"error": ["Email and password required"]}}, status=status.HTTP_400_BAD_REQUEST)
            
            if not CustomUser.objects.filter(email=email).exists():
                return Response({"errors": {"error":["User does not exist"]}}, status=status.HTTP_404_NOT_FOUND)      

            user = authenticate(email=email, password=password)
            if user is not None :
                tokens = get_tokens_for_user(user)
                return Response({
                    "message": "Login successful",
                    "tokens": tokens,
                    "role": user.role
                }, status=status.HTTP_200_OK)
            return Response({"errors": {"error": ["Invalid credentials"]}}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PatientAppointmentStatistics(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        try:
            # Fetch all patients
            patients = Patient.objects.exclude(status='Archive').order_by('status', 'full_name')
            if not patients.exists():
                return Response({'detail': 'No patients found.'}, status=status.HTTP_404_NOT_FOUND)

            response_data = []

            # Process each patient
            for patient in patients:
                # Fetch appointments that are already visited (`status='Checked'`)
                visited_appointments = Appointment.objects.filter(
                    patient=patient,
                    status='Checked'
                ).order_by('date')

                # Fetch appointments that are not yet visited and in the future (`status='Not Checked'`)
                future_appointments = Appointment.objects.filter(
                    patient=patient,
                    status='Active',
                    date__gte=now().date()
                ).order_by('date')

                # Determine first and last consultation dates
                if visited_appointments.exists():
                    first_consultation_date = visited_appointments.first().date
                    last_consultation_date = visited_appointments.last().date
                else:
                    first_consultation_date = last_consultation_date = None

                # Determine next consultation date
                if future_appointments.exists():
                    next_consultation_date = future_appointments.first().date
                else:
                    next_consultation_date = None

                # Append data to response
                response_data.append({
                    'id': patient.id,
                    'uuid': patient.uuid,
                    'full_name': patient.full_name,
                    'age': patient.age,
                    'email': patient.email,
                    'gender': patient.gender,
                    'dob': patient.dob,
                    'address': patient.address,
                    'nationality': patient.nationality,
                    'contact_no': patient.contact_no,
                    'joined_on': patient.joined_on,
                    'updated_on': patient.updated_on,
                    'status': patient.status,
                    'reffered_by': patient.reffered_by,
                    'diagnosis': patient.diagnosis,
                    'diagnosis_details': patient.diagnosis_details,
                    'appointments': {
                        'first_consultation_date': first_consultation_date,
                        'last_consultation_date': last_consultation_date,
                        'next_consultation_date': next_consultation_date
                    }
                })

            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class PatientView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        email = request.data.get('email')
        contact_no = request.data.get('contact_no')
        full_name = request.data.get('full_name')
        
        if (Patient.objects.filter(email=email).exists() and 
            Patient.objects.filter(contact_no=contact_no).exists() and
            Patient.objects.filter(full_name=full_name).exists()) :
            return Response({"msg": "Patient already registered"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = PatientSerializer(data = request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"msg": "Patient Registered Successfully."},status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request,id=None,uuid=None, format=None):
        Patients = Patient.objects.all().order_by('status', 'full_name')
        serializer = PatientSerializer(Patients, many=True)
        if id is not None:
            patient = Patient.objects.get(pk=id)
            serializer = PatientSerializer(patient)
        if uuid is not None:
            patient = Patient.objects.get(uuid=uuid)
            serializer = PatientSerializer(patient)
        return Response(serializer.data)
    
    def put(self, request,id=None, format=None):
        # id = request.data.get('id')
        if id is not None:
            patient = Patient.objects.get(id=id)
            serializer = PatientSerializer(patient, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({"msg": "Data updated successfully"})
            return Response(serializer.errors)

    def delete(self, request, format=None):
        id = request.data.get('id')
        patient = Patient.objects.get(pk=id)
        patient.delete()
        return Response({"msg": "Patient Deleted"})

class DepartmentView(APIView):
    permission_classes = [AllowAny]
    def get(self,request, id=None,format = None):
        dept = Department.objects.all()
        serializer = DepartmentsSerializer(dept, many=True)
        if id is not None:
            dept = Department.objects.get(pk=id)
            serializer = DepartmentsSerializer(dept)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer= DepartmentsSerializer(data= request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"msg": "Department"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors)

    def put(self, request,id, format=None):
        dept = Department.objects.get(id=id)
        serializer = DepartmentsSerializer(dept, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"msg": "Department Data Updated Successflly"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_data = request.data

        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid(raise_exception=True):
            user_serializer.save()
            return Response(user_serializer.data, status=status.HTTP_201_CREATED)

        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   

class UserUpdateView(APIView):
    permission_classes = [AllowAny]

    def put(self, request, id, format=None):
        # Get user by ID
        try:
            user = CustomUser.objects.get(id=id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        user_data = request.data
        role = user_data.get('role', user.role)  # If role is not provided, default to existing user role

        # Update user data
        user_serializer = UserSerializer(user, data=user_data, partial=True)
        if user_serializer.is_valid(raise_exception=True):
            user = user_serializer.save()

            # Handle Doctor update if role is doctor
            if role == 'doctor':
                doctor_data = user_data.get('doctor', {})
                try:
                    doctor = Doctor.objects.get(user=user)
                    doctor_serializer = DoctorSerializer(doctor, data=doctor_data, partial=True)
                    if doctor_serializer.is_valid(raise_exception=True):
                        doctor_serializer.save()
                except Doctor.DoesNotExist:
                    return Response({'error': 'Doctor profile not found.'}, status=status.HTTP_404_NOT_FOUND)
                except KeyError:
                    return Response({'error': 'Doctor data is missing.'}, status=status.HTTP_400_BAD_REQUEST)

            # Handle Receptionist update if role is receptionist
            elif role == 'receptionist':
                receptionist_data = user_data.get('receptionist', {})
                try:
                    receptionist = Receptionist.objects.get(user=user)
                    receptionist_serializer = ReceptionistSerializer(receptionist, data=receptionist_data, partial=True)
                    if receptionist_serializer.is_valid(raise_exception=True):
                        receptionist_serializer.save()
                except Receptionist.DoesNotExist:
                    return Response({'error': 'Receptionist profile not found.'}, status=status.HTTP_404_NOT_FOUND)
                except KeyError:
                    return Response({'error': 'Receptionist data is missing.'}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"msg": "Updated"}, status=status.HTTP_200_OK)

        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class ReceptionistsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, id=None ,format=None):
        Receptionists = Receptionist.objects.all().order_by('status')
        serializer = ReceptionistViewSerializer(Receptionists, many=True)
        if id is not None:
            receptionist = Receptionist.objects.get(pk=id)
            serializer = ReceptionistViewSerializer(receptionist)
        return Response(serializer.data)

    def put(self, request,id=None, formar=None):
        if id is not None:
            print(id)
            receptionist = Receptionist.objects.get(pk=id)
            serializer = ReceptionistViewSerializer(receptionist, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"msg":"Details Updated"})
        
    def delete(self, request, format=None):
        id = request.data.get('id')
        receptionist = Receptionist.objects.get(pk=id)
        receptionist.delete()
        return Response({"msg": "Receptionist Deleted"})

class DoctorsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, id=None, format=None):
        doctor = Doctor.objects.all().order_by('status')
        serializer = DoctorViewSerializer(doctor, many = True)
        if id is not None:
            doctor = Doctor.objects.get(pk=id)
            serializer = DoctorViewSerializer(doctor)
        return Response(serializer.data)
    
    def put(self, request,id=None, format=None):
        if id is not None:
            id = id
            doctor = Doctor.objects.get(pk=id)
            
            serializer = DoctorViewSerializer(doctor, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({'msg': 'Update successful'})
        
    def delete(self, request, format=None):
        id= request.data.get("id")
        doctor = Doctor.objects.get(pk=id)
        doctor.delete()
        return Response({"msg": "Doctor deleted"})

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
    
class UserProfileView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class SupportView(APIView):
    def post(self, request, format=None):
        serializer = SupportSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'msg':'An issue occured'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors)

    def get(self, request, format=None):
        custom_order = Case(
            When(Status='open', then=Value(1)),
            When(Status='in-progress', then=Value(2)),
            When(Status='resolved', then=Value(3)),
            When(Status='closed', then=Value(4)),
            output_field=IntegerField(),
        )
        
        # Modify the queryset to use the custom order
        support = Support.objects.all().annotate(custom_order=custom_order).order_by('custom_order')
        # support = Support.objects.all().order_by('Status')
        serializer = SupportSerializer(support, many=True)
        return Response(serializer.data)

    def put(self,request,id, format=None):
        issue = Support.objects.get(Ticket_id=id)
        serializer = SupportSerializer(issue, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'msg':'Status updadted'}, status=status.HTTP_200_OK)
        return Response(serializer.errors)


# class PasswordChangeView(APIView):
#     permission_classes = [IsAuthenticated]

#     def put(self, request, *args, **kwargs):
#         user = request.user
#         serializer = PasswordChangeSerializer(user, data=request.data, context={'request': request},partial=True)
#         if serializer.is_valid(raise_exception=True):
#             serializer.save()
#             return Response({"detail": "Password updated successfully"}, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"detail": "Password updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



