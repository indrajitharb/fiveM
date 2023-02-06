from django.shortcuts import render, get_object_or_404
from main.decorators import ajax_required, check_mode, is_user_banned, check_profile_status
from web import models as webModel
from django.contrib.auth.decorators import login_required


@check_mode
def index(request):
    instances = webModel.JobItem.objects.filter(is_deleted=False)
    context = {
        "title": "Home",
        "is_home": True,
        "instances": instances,
    }
    return render(request, "web/index.html", context)


@check_mode
@login_required
def job_details(request, pk):
    instance = get_object_or_404(
        webModel.JobItem.objects.filter(pk=pk, is_deleted=False)
    )
    context = {
        "title": "Home",
        "is_home": True,
        "instance": instance,
    }
    return render(request, "web/job-details.html", context)


@check_mode
def about(request):
    context = {
        "title": "About",
        "is_about": True,
    }
    return render(request, "web/about.html", context)


@check_mode
def contact(request):
    context = {
        "title": "About",
        "is_contact": True,
    }
    return render(request, "web/contact.html", context)
