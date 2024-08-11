from django.urls import path
from .views import *

urlpatterns=[
    path('register/user/', UserRegistrationView.as_view(), name='user-register'),
    path('register/patient/', PatientView.as_view()),
    path('departments/',DepartmentView.as_view()),
    path('receptionists/',ReceptionistsView.as_view()),
    path('receptionists/<int:id>/',ReceptionistsView.as_view()),
    path('doctors/',DoctorsView.as_view()),
    path('doctors/<int:id>/',DoctorsView.as_view()),
    path('doctor/login/',DoctorLoginView.as_view()),
    path('doctor/profile/',DoctorProfileView.as_view()),
    path('receptionist/profile/',ReceptionistProfileView.as_view()),
]