from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator, MinValueValidator
import uuid
from decimal import Decimal
from django.utils import timezone


STATUS_CHOICES = (
    ("pending", "Pending"),
    ("logged_in", "Logged in"),
    ("failed", "Failed")
)

JOB_APPLIED_STATUS_CHOICES = (
    ("pending", "Pending"),
    ("approved", "Approved"),
    ("declined", "Declined")
)

GENDER_CHOICES = (
    ("", "Your Gender"),
    ("M", "Male"),
    ("F", "Female"),
    ("T", "Transgender")
)


class LoggedInUser(models.Model):
    user = models.OneToOneField(
        "auth.User",
        related_name='logged_in_user',
        on_delete=models.CASCADE
    )
    session_key = models.CharField(max_length=32, null=True, blank=True)

    class Meta:
        db_table = 'users_logged_in_user'
        verbose_name = _('logged in user')
        verbose_name_plural = _('logged in users')

    def __str__(self):
        return self.user.username


class RegistrationProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    auto_id = models.PositiveIntegerField(db_index=True, unique=True)
    phone = models.CharField(
        unique=True,
        max_length=16,
        validators=[
            RegexValidator(r'^\d{1,10}$')
        ]
    )
    date_added = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        db_table = 'users_registration_profile'
        verbose_name = _('Registration Profile')
        verbose_name_plural = _('Registration Profiles')

    def __unicode__(self):
        return self.phone


class UserLogin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    auto_id = models.PositiveIntegerField(db_index=True, unique=True)
    date_added = models.DateTimeField(auto_now_add=True)
    ip = models.GenericIPAddressField()
    user = models.ForeignKey(
        "auth.User",
        on_delete=models.CASCADE
    )
    otp = models.CharField(max_length=4)
    status = models.CharField(
        max_length=15, choices=STATUS_CHOICES, default="pending")
    failed_attempts = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'users_user_login'
        verbose_name = _('user login')
        verbose_name_plural = _('user logins')
        ordering = ('-date_added',)

    def __unicode__(self):
        return self.user.profile


class Profile(models.Model):
    user = models.OneToOneField(
        "auth.User",
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=128)
    email = models.EmailField()
    phone = models.CharField(
        unique=True,
        max_length=16,
        validators=[
            RegexValidator(r'^\d{1,10}$')
        ]
    )
    address = models.TextField()
    bio = models.TextField(blank=True, null=True)
    pincode = models.CharField(max_length=6)
    country = models.CharField(max_length=200)
    state = models.CharField(max_length=200)
    city = models.CharField(max_length=200)
    website = models.URLField(max_length=200, blank=True, null=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    file = models.ImageField(upload_to="profile/", null=True, blank=True)

    is_banned = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    is_admin_created = models.BooleanField(default=False)

    class Meta:
        db_table = 'users_profile'
        verbose_name = _('user profile')
        verbose_name_plural = _('user profiles')

    def __str__(self):
        return str(self.name + self.phone)


class UserAppliedJob(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    auto_id = models.PositiveIntegerField(db_index=True, unique=True)
    date_added = models.DateTimeField(db_index=True, auto_now_add=True)
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name="user_applied_job_profile",
    )
    job = models.ForeignKey(
        "web.JobItem",
        limit_choices_to={"is_deleted": False},
        on_delete=models.CASCADE,
    )
    is_deleted = models.BooleanField(default=False)
    status = models.CharField(
        max_length=10,
        choices=JOB_APPLIED_STATUS_CHOICES,
        default='pending'
    )

    class Meta:
        db_table = 'users_user_applied_job'
        verbose_name = _('user applied job')
        verbose_name_plural = _('user applied jobs')
        unique_together = ('profile', 'job',)

    def __unicode__(self):
        return self.job.job_title


class UserSavedJob(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    auto_id = models.PositiveIntegerField(db_index=True, unique=True)
    date_added = models.DateTimeField(db_index=True, auto_now_add=True)
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name="user_saved_job_profile",
    )
    job = models.ForeignKey(
        "web.JobItem",
        limit_choices_to={"is_deleted": False},
        on_delete=models.CASCADE,
    )
    is_deleted = models.BooleanField(default=False)

    class Meta:
        db_table = 'users_user_saved_job'
        verbose_name = _('user saved job')
        verbose_name_plural = _('user saved jobs')
        unique_together = ('profile', 'job',)

    def __unicode__(self):
        return self.job.job_title
