from django.contrib import admin
from django.urls import path, re_path
from . import views

app_name = "users"

urlpatterns = [
    path('login/', views.enter, name="enter"),
    path('logout/', views.user_logout, name="user_logout"),
    path('edit/', views.edit_profile, name="edit_profile"),
    path('my-profile/', views.my_profile, name="my_profile"),
    path('photo-upload/', views.photo_upload, name="photo_upload"),
    path(
        'delete-avatar/',
        views.delete_avatar,
        name="delete_avatar"
    ),

    re_path(r'^save-job/(?P<pk>.*)/$', views.save_job, name="save_job"),
    re_path(r'^apply-job/(?P<pk>.*)/$', views.apply_job, name="apply_job"),
    re_path(r'^verify/(?P<pk>.*)/$', views.verify, name="verify"),
    re_path(r'^resend-otp/(?P<pk>.*)/$', views.resend_otp, name="resend_otp"),
]
