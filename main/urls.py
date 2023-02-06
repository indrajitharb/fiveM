from django.conf.urls import path, re_path, include
from main import views


app_name = "main"

urlpatterns = [
    path('search/', views.search, name='search'),
    path(
        'check-password-policy/',
        views.check_password_policy,
        name='check_password_policy'
    ),
]
