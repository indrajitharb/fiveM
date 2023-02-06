import string
import random
from django.http import HttpResponse
from decimal import Decimal
import datetime
# from users.models import Administrator
# from mailqueue.models import MailerMessage
from django.conf import settings


# def send_email(to_address,subject,content,html_content,bcc_address=settings.DEFAULT_BCC_EMAIL,attachment=None,attachment2=None,attachment3=None):
#     new_message = MailerMessage()
#     new_message.subject = subject
#     new_message.to_address = to_address
#     if bcc_address:
#         new_message.bcc_address = bcc_address
#     new_message.from_address = settings.DEFAULT_FROM_EMAIL
#     new_message.content = content
#     new_message.html_content = html_content
#     if attachment:
#         new_message.add_attachment(attachment)
#     if attachment2:
#         new_message.add_attachment(attachment2)
#     if attachment3:
#         new_message.add_attachment(attachment3)
#     new_message.app = "default"
#     new_message.save()


def get_otp(size=4, chars=string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def get_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')

    if x_forwarded_for:
        ipaddress = x_forwarded_for.split(',')[-1].strip()
    else:
        ipaddress = request.META.get('REMOTE_ADDR')

    return ipaddress


def get_auto_id(Model):
    auto_id = 1
    latest_auto_id = Model.objects.all().order_by("-date_added")[:1]
    if latest_auto_id:
        for auto in latest_auto_id:
            auto_id = auto.auto_id + 1
    return auto_id


def generate_form_errors(args, formset=False):
    message = ''
    if not formset:
        for field in args:
            if field.errors:
                message += field.errors
        for err in args.non_field_errors():
            message += str(err)

    elif formset:
        for form in args:
            for field in form:
                if field.errors:
                    message += field.errors
            for err in form.non_field_errors():
                message += str(err)
    return message


# def get_a_id(model,request):
#     a_id = 1
#     current_shop = get_current_shop(request)
#     latest_a_id =  model.objects.filter(shop=current_shop).order_by("-date_added")[:1]
#     if latest_a_id:
#         for auto in latest_a_id:
#             a_id = auto.a_id + 1
#     return a_id


def get_timezone(request):
    if "set_user_timezone" in request.session:
        user_time_zone = request.session['set_user_timezone']
    else:
        user_time_zone = "Asia/Kolkata"
    return user_time_zone


def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'
