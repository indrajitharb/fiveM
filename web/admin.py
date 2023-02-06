from django.contrib import admin
from web import models as webModel


class JobItemAdmin(admin.ModelAdmin):
    list_display = ('job_title', 'job_type',)


admin.site.register(webModel.JobItem, JobItemAdmin)
