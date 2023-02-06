from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator, MinValueValidator
import uuid
from decimal import Decimal
from django.utils import timezone


class Profile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        "auth.User",
        on_delete=models.CASCADE,
        related_name="company_user",
    )
    name = models.CharField(max_length=128, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(
        # unique=True,
        max_length=16,
        validators=[
            RegexValidator(r'^\d{1,10}$')
        ],
        blank=True,
        null=True
    )
    address = models.TextField(blank=True, null=True)
    about = models.TextField(blank=True, null=True)
    pincode = models.CharField(max_length=6, blank=True, null=True)
    country = models.CharField(max_length=200, blank=True, null=True)
    state = models.CharField(max_length=200, blank=True, null=True)
    city = models.CharField(max_length=200, blank=True, null=True)
    website = models.URLField(max_length=200, blank=True, null=True)
    instagram = models.URLField(max_length=200, blank=True, null=True)
    facebook = models.URLField(max_length=200, blank=True, null=True)
    twitter = models.URLField(max_length=200, blank=True, null=True)
    file = models.FileField(
        upload_to="company-profile/",
        null=True,
        blank=True
    )

    is_banned = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    is_admin_created = models.BooleanField(default=False)

    class Meta:
        db_table = 'companies_profile'
        verbose_name = _('company profile')
        verbose_name_plural = _('company profiles')

    def __unicode__(self):
        return "%s - %s - %s" % (self.user.id, self.name, self.phone)
