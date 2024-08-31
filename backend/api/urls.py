from django.urls import path
from .views import *

urlpatterns=[
    path('register/user/', UserRegistrationView.as_view(), name='user-register'),
    path('patients/', PatientView.as_view()),
    path('patients/<int:id>/', PatientView.as_view()),
    path('departments/',DepartmentView.as_view()),
    path('receptionists/',ReceptionistsView.as_view()),
    path('receptionists/<int:id>/',ReceptionistsView.as_view()),
    path('doctors/',DoctorsView.as_view()),
    path('doctors/<int:id>/',DoctorsView.as_view()),
    path('user/login/',UserLoginView.as_view()),
    path('doctor/profile/',DoctorProfileView.as_view()),
    # path('receptionist/login/',ReceptionistLoginView.as_view()),
    path('receptionist/profile/',ReceptionistProfileView.as_view()), 
    path('user/profile/',UserProfileView.as_view()),
    path('issue/support/',SupportView.as_view()),
    path('issue/support/<int:id>/',SupportView.as_view()),
]