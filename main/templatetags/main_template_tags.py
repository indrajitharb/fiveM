from django.template.defaultfilters import stringfilter
from django.template import Library
from django.contrib.auth.models import User
from datetime import datetime, timedelta  # , timezone
from django import template
from django.utils.timesince import timesince
from django.utils import timezone
from web import models as webModel


register = Library()


@register.filter
def check_default(value):
    result = value
    if value == "default":
        result = "-"
    return result


@register.filter
@stringfilter
def underscore_smallletter(value):
    value = value.replace(" ", "_")
    return value


@register.filter
def to_fixed_two(value):
    return "{:10.2f}".format(value)


@register.filter
def to_int(value):
    return int(value)


@register.filter
def tax_devide(value):
    return value/2


@register.filter
def get_jobs_count(user):
    instances = webModel.JobItem.objects.filter(
        is_deleted=False,
        is_active=True,
        user=user,
    )
    return instances.count()


@register.filter
def time_until(value):
    return '%(time)s ago' % {'time': timesince(value).split(', ')[0]}


@register.filter
def comma_separator(value):
    list_data = []

    if value is not None:
        list_data = value.split(',')

    return list_data
