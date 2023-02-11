from django.contrib import admin
from django.urls import path, re_path
from . import views

app_name = "company"

urlpatterns = [
    path('login/', views.company_login, name="login"),
    path('logout/', views.user_logout, name="logout"),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('register/', views.company_signup, name="signup"),
    path('my-profile/', views.my_profile, name="my_profile"),
    path('photo-upload/', views.photo_upload, name="photo_upload"),
    path(
        'delete-avatar/',
        views.delete_avatar,
        name="delete_avatar"
    ),
    path('create-job/', views.create_post, name="create_post"),
    path('my-jobs/', views.my_posts, name="my_posts"),
    path('requests/', views.requests, name='request'),

    re_path(r'^my-jobs/(?P<pk>.*)/$', views.my_job, name="my_job"),
    re_path(r'^edit-job/(?P<pk>.*)/$', views.edit_post, name="edit_post"),
    re_path(r'^delete-job/(?P<pk>.*)/$', views.delete_job, name="delete_job"),
    re_path(
        r'^approve-request/(?P<pk>.*)/$',
        views.approve_request,
        name="approve_request"
    ),
    re_path(
        r'^decline-request/(?P<pk>.*)/$',
        views.decline_request,
        name="decline_request"
    ),
]
