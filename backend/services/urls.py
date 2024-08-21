from django.urls import path,include
from .views import *

urlpatterns =[
    path('appointment/book/',AppointmentBookView.as_view()),
    path('appointment/history/',AppointmentHistoryView.as_view()),
    path('test/', TestViews.as_view()),
    path('upload/report/',ReportUploadView.as_view()),
    path('doctor/appointments/', DoctorAppointmentsView.as_view()),
    path('prescription/',PrescriptionView.as_view()),
    path('reports/<str:uuid>/',Patientreports.as_view())
]