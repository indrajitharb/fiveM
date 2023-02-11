import json
from django.shortcuts import render
from company import forms as companyForms
from web import forms as webForms
from main.functions import get_ip, get_auto_id, generate_form_errors, get_otp
from main.decorators import ajax_required, check_mode, check_profile_status, is_user_banned, role_required
from web import models as webModel
# from users import forms as userForms
from users import functions as userFunctions
from django.contrib.auth.models import User
from django.http.response import HttpResponseRedirect, HttpResponse
from django.conf import settings
from django.urls import reverse
from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_GET, require_POST
from company import models as companyModel
from users import models as userModel
from django.contrib.auth.models import Group


@check_mode
def company_login(request):
    if request.method == "POST":
        form = companyForms.LoginForm(request.POST)
        if form.is_valid():
            # data = form.save(commit=False)
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']

            user = authenticate(
                username=username,
                password=password
            )
            if user is not None:
                login(request, user)

                response_data = {
                    "status": "true",
                    "title": "Successfully logged in",
                    "message": "Successfully logged in",
                    "redirect": "true",
                    "redirect_url": reverse("app")
                }
            else:
                message = "No user found"
                response_data = {
                    "status": "false",
                    "stable": "true",
                    "title": "No user found",
                    "message": message
                }
        else:
            message = generate_form_errors(form, formset=False)
            response_data = {
                "status": "false",
                "stable": "true",
                "title": "Form validation",
                "message": message,
            }
        return HttpResponse(json.dumps(response_data), content_type='application/javascript')
    else:
        form = companyForms.LoginForm()
        context = {
            "title": "Let's Get Started",
            "form": form,
        }
        return render(request, 'dashboard/auth/login.html', context)


@check_mode
def company_signup(request):
    if request.method == "POST":
        form = companyForms.UserRegistrationForm(request.POST)

        if form.is_valid():
            data = form.save(commit=False)
            first_name = form.cleaned_data['first_name']
            last_name = form.cleaned_data['last_name']

            data.first_name = first_name
            data.last_name = last_name
            # data.is_active = False
            data.save()

            group = Group.objects.get(name="company")
            data.groups.add(group)

            login(request, data)

            response_data = {
                "status": "true",
                "redirect": "true",
                "title": "Successfully registered",
                "message": "User registered successfully.",
                "redirect_url": reverse("app")
            }
        else:
            message = generate_form_errors(form, formset=False)
            response_data = {
                "status": "false",
                "stable": "true",
                "title": "Form validation",
                "message": message,
            }
        return HttpResponse(json.dumps(response_data), content_type='application/javascript')
    else:
        form = companyForms.UserRegistrationForm()
        context = {
            "title": "Let's Get Started",
            "form": form,
        }
        return render(request, 'dashboard/auth/register.html', context)


@check_mode
def user_logout(request):
    context = {
        'title': 'Successfully logout',
    }
    logout(request)
    return render(request, 'users/logout.html', context)


@check_mode
@login_required(login_url='/app/company/login/')
@check_profile_status
@role_required(['company',])
def dashboard(request):
    context = {
        "title": "Dashboard",
        "is_dashboard": True,
    }
    return render(request, "dashboard/base.html", context)


@check_mode
@login_required(login_url='/app/company/login/')
@is_user_banned
@role_required(['company',])
def my_profile(request):
    user = request.user
    if companyModel.Profile.objects.filter(user=user).exists():
        instance = companyModel.Profile.objects.get(user=user)
    else:
        instance = None

    if request.method == "POST":
        form = companyForms.ProfileForm(request.POST, instance=instance)

        if form.is_valid():
            # update profile
            data = form.save(commit=False)
            data.user = request.user
            # if not instance:
            #     data.phone = request.user.username
            data.save()

            response_data = {
                "status": "true",
                "title": "Successfully updated",
                "message": "Your profile has been succesfully updated",
                "redirect": "true",
                # "redirect_url": '/'
                "redirect_url": reverse('company:my_profile')
            }
        else:
            message = generate_form_errors(form, formset=False)
            response_data = {
                "status": "false",
                "stable": "true",
                "title": "Form validation error",
                "message": message
            }

        return HttpResponse(json.dumps(response_data), content_type='application/javascript')
    else:
        if instance is None or instance.name is None:
            initial = {
                'name': user.first_name + user.last_name,
                'email': user.email,
            }
            form = companyForms.ProfileForm(initial=initial)
        else:
            form = companyForms.ProfileForm(instance=instance)

        photoForm = companyForms.PhotoForm(instance=instance)
        context = {
            "title": "My Account",
            "is_my_profile": True,
            "form": form,
            "instance": instance,
            "photoForm": photoForm,
        }
        return render(request, 'dashboard/my-profile/profile.html', context)


@check_mode
@login_required(login_url='/app/company/login/')
@is_user_banned
@require_POST
@role_required(['company'])
def photo_upload(request):
    if companyModel.Profile.objects.filter(user=request.user).exists():
        instance = companyModel.Profile.objects.get(user=request.user)
    else:
        instance = companyModel.Profile.objects.create(
            user=request.user,
        )
        # instance.save()

    form = companyForms.PhotoForm(
        request.POST,
        request.FILES,
        instance=instance,
    )
    if form.is_valid():
        form.save()
        response_data = {
            "status": "true",
            "title": "Successfully uploaded",
            "message": "Your profile photo has been succesfully uploaded",
            "redirect": "true",
            "redirect_url": reverse('users:my_profile')
        }
    else:
        message = generate_form_errors(form, formset=False)

        response_data = {
            "status": "false",
            "stable": "true",
            "title": "Form validation error",
            "message": message
        }

    return HttpResponse(json.dumps(response_data), content_type='application/javascript')


@check_mode
@login_required(login_url='/app/company/login/')
@role_required(['company'])
def delete_avatar(request):
    instance = companyModel.Profile.objects.get(user=request.user)
    instance.file.delete()
    instance.save()

    response_data = {
        "status": "true",
        "redirect": "false",
    }
    return HttpResponse(json.dumps(response_data), content_type='application/javascript')


@check_mode
@login_required(login_url='/app/company/login/')
@is_user_banned
@check_profile_status
@role_required(['company',])
def create_post(request):
    if request.method == "POST":
        form = webForms.JobItemForm(request.POST, request.FILES)
        print(form)
        if form.is_valid():
            # update profile
            data = form.save(commit=False)
            instance = companyModel.Profile.objects.get(user=request.user)

            data.user = instance
            data.save()

            response_data = {
                "status": "true",
                "title": "Success",
                "message": "Successfully created a new job",
                "redirect": "true",
                "redirect_url": reverse('company:my_posts')
            }
        else:
            message = generate_form_errors(form, formset=False)
            response_data = {
                "status": "false",
                "stable": "true",
                "title": "Form validation error",
                "message": message
            }

        return HttpResponse(json.dumps(response_data), content_type='application/javascript')
    else:
        form = webForms.JobItemForm()

        context = {
            "title": "Post New Job",
            "is_my_jobs": True,
            "form": form,
        }
        return render(request, 'dashboard/my-post/create-post.html', context)


@check_mode
@login_required(login_url='/app/company/login/')
@is_user_banned
@check_profile_status
@role_required(['company',])
def my_posts(request):
    instance = companyModel.Profile.objects.get(user=request.user)
    instances = webModel.JobItem.objects.filter(
        is_deleted=False,
        is_active=True,
        user=instance,
    )
    context = {
        "title": "My Jobs",
        "is_my_jobs": True,
        "instances": instances,
    }
    return render(request, 'dashboard/my-post/my-job-list.html', context)


@check_mode
@login_required(login_url='/app/company/login/')
@is_user_banned
@check_profile_status
@role_required(['company',])
def my_job(request, pk):
    instance = get_object_or_404(webModel.JobItem.objects.filter(
        is_deleted=False,
        pk=pk,
    ))
    context = {
        "title": "My Jobs",
        "is_my_jobs": True,
        "instance": instance,
    }
    return render(request, 'dashboard/my-post/job-details.html', context)


@check_mode
@login_required(login_url='/app/company/login/')
@is_user_banned
@check_profile_status
@role_required(['company',])
def edit_post(request, pk):
    instance = get_object_or_404(webModel.JobItem.objects.filter(
        is_deleted=False,
        pk=pk,
    ))

    if request.method == "POST":
        form = webForms.JobItemForm(
            request.POST,
            request.FILES,
            instance=instance,
        )

        if form.is_valid():
            # update profile
            data = form.save(commit=False)
            instance = companyModel.Profile.objects.get(user=request.user)

            data.user = instance
            data.save()

            response_data = {
                "status": "true",
                "title": "Success",
                "message": "Successfully updated",
                "redirect": "true",
                "redirect_url": reverse('company:my_posts')
            }
        else:
            message = generate_form_errors(form, formset=False)
            response_data = {
                "status": "false",
                "stable": "true",
                "title": "Form validation error",
                "message": message
            }

        return HttpResponse(json.dumps(response_data), content_type='application/javascript')
    else:
        form = webForms.JobItemForm(instance=instance)

        context = {
            "title": "Post New Job",
            "is_my_jobs": True,
            "form": form,
            "instance": instance,
        }
        return render(request, 'dashboard/my-post/create-post.html', context)


@check_mode
@login_required(login_url='/app/company/login/')
@is_user_banned
@check_profile_status
@role_required(['company'])
def delete_job(request, pk):
    instance = get_object_or_404(webModel.JobItem.objects.filter(
        is_deleted=False,
        pk=pk,
    ))
    instance.delete()
    instance.save()

    response_data = {
        "status": "true",
        "title": "Success",
        "message": "Successfully updated",
        "redirect": "true",
        "redirect_url": reverse('company:my_posts')
    }
    return HttpResponse(json.dumps(response_data), content_type='application/javascript')


@check_mode
@login_required(login_url='/app/company/login/')
@is_user_banned
@check_profile_status
@role_required(['company',])
def requests(request):
    company = get_object_or_404(companyModel.Profile.objects.filter(
        user=request.user
    ))
    instances = userModel.UserAppliedJob.objects.filter(
        is_expired=False,
        job__user=company
    )
    context = {
        "title": "My Jobs",
        "is_request": True,
        "instances": instances,
    }
    return render(request, 'dashboard/request.html', context)
