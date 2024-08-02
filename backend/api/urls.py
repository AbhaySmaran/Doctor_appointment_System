from django.urls import path
from .views import UserRegisterView,DoctorRegisterView

urlpatterns=[
    path('register/',UserRegisterView.as_view()),
    path('doc/register/',DoctorRegisterView.as_view())
]