from django.contrib import admin
from django.urls import path, re_path
from . import views

app_name = "web"

urlpatterns = [
    path('', views.index, name="index"),
    path('about/', views.about, name="about"),
    path('contact-us/', views.contact, name="contact"),

    re_path(
        r'^job-details/(?P<pk>.*)/$',
        views.job_details,
        name="job_details",
    ),
]
