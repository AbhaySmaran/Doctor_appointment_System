from django.urls import path,include
from .views import *

urlpatterns =[
    path('appointment/book/',AppointmentBookView.as_view()),
    path('appointment/history/',AppointmentHistoryView.as_view()),
    path('appointment/history/<int:id>/',AppointmentHistoryView.as_view()),
    path('test/', TestViews.as_view()),
    path('upload/report/',ReportUploadView.as_view()),
    path('doctor/appointments/', DoctorAppointmentsView.as_view()),
    path('patient/appointment/<str:uuid>/',PatientAppointsView.as_view()),
    path('upload/prescription/',PrescriptionUploadView.as_view()),
    path('reports/<str:uuid>/',Patientreports.as_view()),
    path('report/<int:id>/',Patientreports.as_view()),
    path('prescriptions/<str:uuid>/',PatientPrescriptionView.as_view()),
    path('prescription/<int:id>/',PatientPrescriptionView.as_view()),
    path('follow-up/', FollowUpEmailView.as_view(), name='follow_up_email'),
    path('appointments/daily/<int:year>/<int:month>/', DailyAppointmentsCountView.as_view(), name='monthly-appointments'),
    path('api/tests/<str:test_type>/', TestReportCountAPIView.as_view(), name='test-list-by-type'),
    path('appointments/history/<int:year>/', AppointmentListView.as_view(), name='appointment-history-year'),  # Filter by year
    path('appointments/history/<int:year>/<int:month>/', AppointmentListView.as_view(), name='appointment-history-month'),  # Filter by year and month
    path('appointments/history/<int:year>/<int:month>/<int:day>/', AppointmentListView.as_view(), name='appointment-history-day'),
    path('appointments/followup/', FollowUpAppointmentView.as_view()),
    # path('protected_static/<str:filename>/', protected_static, name='protected_static'),
]