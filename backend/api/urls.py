from django.urls import path
from .views import *

urlpatterns=[
    path('register/user/', UserRegistrationView.as_view(), name='user-register'),
    path('register/patient/', PatientView.as_view()),
    path('departments/',DepartmentView.as_view()),
]