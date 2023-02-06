
from users.models import RegistrationProfile
from main.functions import get_auto_id
from django.contrib.auth.models import User
from django.conf import settings
from datetime import datetime, timedelta
import requests


def get_current_role(request):
    current_role = "not_loggined"
    if request.user.is_authenticated:
        if request.user.groups.filter(user=request.user).exists():
            current_role = str(request.user.groups.get(user=request.user))
        if request.user.is_superuser:
            current_role = "superadmin"
    return current_role


def register_user_profile(phone):
    if RegistrationProfile.objects.filter(phone=phone, is_deleted=False).exists():
        profile = RegistrationProfile.objects.get(phone=phone)
    else:
        auto_id = get_auto_id(RegistrationProfile)
        profile = RegistrationProfile(
            phone=phone,
            auto_id=auto_id
        )
        profile.save()


def register_user_data(phone):
    if User.objects.filter(username=phone, is_active=True).exists():
        user = User.objects.get(username=phone)
    else:
        user = User.objects.create_user(
            username=phone,
            email=phone + '@fiveM.com',
            password=settings.FIVEM_LOGIN_PASSWORD
        )
    return user


def register_user_profile_data(profile_form, phone, request):
    data = profile_form.save(commit=False)
    data.user = register_user_data(phone)
    data.phone = phone
    if request.user.is_superuser:
        data.is_admin_created = True
    else:
        data.is_admin_created = False

    data.save()


def sendSMS(numbers, message):
    url = "http://bhashsms.com/api/sendmsg.php?user=talrop&pass=talrop76VB&sender=TALROP&phone=%s&text=%s&priority=ndnd&stype=normal" % (
        numbers, message)
    r = requests.get(url=url)
    data = r.content
    return data
