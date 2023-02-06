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
    now = timezone.now()
    # print('value', str(value).split(' '))
    splt = str(value).split(' ')
    splt1 = str(splt[0]).split('-')
    splt2 = str(splt[1]).split(':')
    value_date = timezone.datetime(
        int(splt1[0]),
        int(splt1[1]),
        int(splt1[2]),
        int(splt2[0]),
        int(splt2[1]),
    )

    # print('============')
    # print('now', now)
    # print('value', value)
    # print('value_date', value_date)

    difference = value_date.astimezone() - now
    # print('difference', difference)
    # if difference <= timedelta(minutes=1):
    #     return 'just now'

    return '%(time)s ago' % {'time': timesince(value).split(', ')[0]}
