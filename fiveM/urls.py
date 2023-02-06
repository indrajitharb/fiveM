from django.contrib import admin
from django.urls import path, re_path, include
from django.views.static import serve
from django.conf import settings
from main import views as general_views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('', include('web.urls', 'web')),
    path('app/', general_views.app, name='app'),

    path('app/accounts/', include('users.urls', namespace='users')),
    path('app/company/', include('company.urls', namespace='company')),

    re_path(
        'media/(?P<path>.*)$',
        serve,
        {'document_root': settings.MEDIA_ROOT}
    ),
    re_path(
        'static/(?P<path>.*)$',
        serve,
        {'document_root': settings.STATIC_FILE_ROOT}
    ),
]
