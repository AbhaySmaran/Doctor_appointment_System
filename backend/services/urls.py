from django.urls import path,include
from .views import *

urlpatterns =[
    path('appointment/book/',AppointmentBookView.as_view()),
    path('appointment/history/',AppointmentHistoryView.as_view()),
    path('test/', TestViews.as_view()),
    path('upload/report/',ReportUploadView.as_view()),
    path('doctor/appointments/', DoctorAppointmentsView.as_view()),
    path('prescription/',PrescriptionView.as_view()),
    path('reports/<str:uuid>/',Patientreports.as_view()),
    path('email/',SendEmailView.as_view()),
    path('follow-up/', FollowUpEmailView.as_view(), name='follow_up_email'),
    path('appointments/monthly/', MonthlyAppointmentsView.as_view(), name='monthly-appointments'),
    path('appointments/daily/<int:year>/<int:month>/', DailyAppointmentsView.as_view(), name='monthly-appointments'),
    # path('protected_static/<str:filename>/', protected_static, name='protected_static'),
]