import json
from django.shortcuts import render
from main.functions import get_ip, get_auto_id, generate_form_errors, get_otp
from main.decorators import ajax_required, check_mode, check_profile_status, is_user_banned, role_required
from users import models as userModel
from users import forms as userForms
from users import functions as userFunctions
from django.contrib.auth.models import User
from django.http.response import HttpResponseRedirect, HttpResponse
from django.conf import settings
from django.urls import reverse
from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_GET, require_POST
from web import models as webModel
from django.contrib.auth.models import Group


@check_mode
def enter(request):
    if request.method == "POST":
        form = userForms.PhoneNumberForm(request.POST)
        if form.is_valid():
            phone = form.cleaned_data['phone']

            # get profile data
            if userModel.RegistrationProfile.objects.filter(phone=phone).exists():
                profile = userModel.RegistrationProfile.objects.get(
                    phone=phone)
            else:
                auto_id = get_auto_id(userModel.RegistrationProfile)
                profile = userModel.RegistrationProfile(
                    phone=phone,
                    auto_id=auto_id
                )
                profile.save()

            # get user data
            if User.objects.filter(username=phone, is_active=True).exists():
                user = User.objects.get(username=phone)
            else:
                user = User.objects.create_user(
                    username=phone,
                    email=phone + '@fiveM.com',
                    password=settings.FIVEM_LOGIN_PASSWORD
                )

            # add user group
            my_group = Group.objects.get(name='employee')
            my_group.user_set.add(user)

            # create user login and redirect for otp verfication
            auto_id = get_auto_id(userModel.UserLogin)
            otp = get_otp()
            login = userModel.UserLogin(
                auto_id=auto_id,
                ip=get_ip(request),
                user=user,
                otp=otp
            )
            login.save()

            # send sms
            # userFunctions.sendSMS(phone, otp)

            response_data = {
                "status": "true",
                "title": "Successfully created",
                "message": "Please verfiy the OTP",
                "redirect": "true",
                "redirect_url": reverse("users:verify", kwargs={"pk": login.pk})
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
        form = userForms.PhoneNumberForm()
        context = {
            "title": "Let's Get Started",
            "form": form
        }
        return render(request, 'users/login.html', context)


@check_mode
def user_logout(request):
    context = {
        'title': 'Successfully logout',
    }
    logout(request)
    return render(request, 'users/logout.html', context)


@check_mode
def verify(request, pk):
    instance = get_object_or_404(userModel.UserLogin.objects.filter(pk=pk))

    if request.method == "POST":
        form = userForms.OTPForm(request.POST)
        if form.is_valid():
            otp = form.cleaned_data['otp']
            if otp == instance.otp:
                user = authenticate(
                    username=instance.user.username,
                    password=settings.FIVEM_LOGIN_PASSWORD
                )
                if user is not None:
                    login(request, user)
                    instance.status = "logged_in"
                    instance.save()
                    instance = get_object_or_404(
                        userModel.UserLogin.objects.filter(pk=pk)
                    )
                    response_data = {
                        "status": "true",
                        "title": "Successfully logged in",
                        "message": "Successfully logged in",
                        "redirect": "true",
                        "redirect_url": reverse("web:index")
                    }
                else:
                    message = "No user found"
                    response_data = {
                        "status": "false",
                        "stable": "true",
                        "title": "No user found",
                        "message": message
                    }
                return HttpResponse(json.dumps(response_data), content_type='application/javascript')
            else:
                message = "Invalid OTP. Please try again"
                response_data = {
                    "status": "false",
                    "stable": "true",
                    "title": "Invalid OTP",
                    "message": message
                }
            return HttpResponse(json.dumps(response_data), content_type='application/javascript')
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
        form = userForms.OTPForm()
        context = {
            "title": "Verify Profile",
            "form": form,
            "instance": instance
        }
        return render(request, 'users/verify.html', context)


@check_mode
def resend_otp(request, pk):
    instance = get_object_or_404(userModel.UserLogin.objects.filter(pk=pk))
    otp = instance.otp
    phone = instance.user.username

    # userFunctions.sendSMS(phone,otp)

    response_data = {
        'status': 'true',
        'resend_sms': True,
    }
    return HttpResponse(json.dumps(response_data), content_type='application/javascript')


@check_mode
@login_required
@check_profile_status
@is_user_banned
@role_required(['employee',])
def my_profile(request):
    applied_jobs = None
    saved_jobs = None

    if userModel.Profile.objects.filter(user=request.user).exists():
        instance = userModel.Profile.objects.get(user=request.user)
        applied_jobs = userModel.UserAppliedJob.objects.filter(
            profile=instance,
        )
        saved_jobs = userModel.UserSavedJob.objects.filter(
            profile=instance,
        )
    else:
        instance = None

    form = userForms.ProfileForm(instance=instance)
    photoForm = userForms.PhotoForm(instance=instance)

    context = {
        "title": "My Account",
        "is_my_account": True,
        "form": form,
        "photoForm": photoForm,
        "applied_jobs": applied_jobs,
        "saved_jobs": saved_jobs,
    }
    return render(request, 'users/candidate-profile.html', context)


@check_mode
@login_required
@is_user_banned
@role_required(['employee',])
def edit_profile(request):
    if userModel.Profile.objects.filter(user=request.user).exists():
        instance = userModel.Profile.objects.get(user=request.user)
    else:
        instance = None

    if request.method == "POST":
        form = userForms.ProfileForm(request.POST, instance=instance)
        if form.is_valid():

            # update profile
            data = form.save(commit=False)
            data.user = request.user
            if not instance:
                data.phone = request.user.username
            data.save()

            response_data = {
                "status": "true",
                "title": "Successfully updated",
                "message": "Your profile has been succesfully updated",
                "redirect": "true",
                # "redirect_url": '/'
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
    else:
        form = userForms.ProfileForm(instance=instance)

        context = {
            "title": "Edit Profile",
            "form": form,
            "instance": instance,
            "is_my_account": True,
        }
        return render(request, 'users/edit_profile.html', context)


@check_mode
@login_required
@check_profile_status
@is_user_banned
@require_POST
@role_required(['employee'])
def photo_upload(request):
    instance = get_object_or_404(
        userModel.Profile.objects.filter(user=request.user)
    )
    form = userForms.PhotoForm(
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
@login_required
@role_required(['employee'])
def apply_job(request, pk):
    if webModel.JobItem.objects.filter(pk=pk).exists():
        instance = webModel.JobItem.objects.get(pk=pk)
        profile = get_object_or_404(userModel.Profile.objects.filter(
            user=request.user
        ))

        if not userModel.UserAppliedJob.objects.filter(profile=profile, job=instance).exists():
            auto_id = get_auto_id(userModel.UserAppliedJob)
            userModel.UserAppliedJob(
                auto_id=auto_id,
                profile=profile,
                job=instance,
            ).save()

            response_data = {
                "status": "true",
                "redirect": "true",
                "title": "Successfully applied",
                "message": "Job applied successfully.",
            }
        else:
            response_data = {
                "status": "false",
                "stable": "true",
                "title": "Already applied",
                "message": " "
            }
    else:
        response_data = {
            "status": "false",
            "stable": "true",
            "title": "Error 404",
            "message": "Job not found"
        }
    return HttpResponse(json.dumps(response_data), content_type='application/javascript')


@check_mode
@login_required
@role_required(['employee'])
def save_job(request, pk):
    if webModel.JobItem.objects.filter(pk=pk).exists():
        instance = webModel.JobItem.objects.get(pk=pk)
        profile = get_object_or_404(userModel.Profile.objects.filter(
            user=request.user
        ))

        if not userModel.UserSavedJob.objects.filter(profile=profile, job=instance).exists():
            auto_id = get_auto_id(userModel.UserSavedJob)
            userModel.UserSavedJob(
                auto_id=auto_id,
                profile=profile,
                job=instance,
            ).save()

            response_data = {
                "status": "true",
                "title": " ",
                "message": " ",
            }
        else:
            saved_instance = userModel.UserSavedJob.objects.get(
                profile=profile,
                job=instance
            )
            saved_instance.delete()

            response_data = {
                "status": "true",
                "title": " ",
                "message": " ",
            }
    else:
        response_data = {
            "status": "false",
            "stable": "true",
            "title": "Error 404",
            "message": "Job not found"
        }
    return HttpResponse(json.dumps(response_data), content_type='application/javascript')


@check_mode
@login_required
@role_required(['employee'])
def delete_avatar(request):
    instance = userModel.Profile.objects.get(user=request.user)
    instance.file.delete()
    instance.save()

    response_data = {
        "status": "true",
        "redirect": "false",
        # "title": "Successfully deleted",
        # "message": "Avatar deleted successfully.",
        # "redirect_url": reverse('courses:view_courses')
    }
    return HttpResponse(json.dumps(response_data), content_type='application/javascript')


@login_required
@role_required(['employee', 'company'])
@ajax_required
@require_GET
def set_user_timezone(request):
    timezone = request.GET.get('timezone')
    request.session["set_user_timezone"] = timezone
    response_data = {
        'status': 'true',
        'title': "Success",
        'message': 'user timezone set successfully.'
    }
    return HttpResponse(json.dumps(response_data), content_type='application/javascript')
