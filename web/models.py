from django.db import models
from django.utils.translation import gettext_lazy as _
import uuid
from ckeditor.fields import RichTextField
from django.core.validators import RegexValidator, MinValueValidator
from decimal import Decimal


JOB_TYPE = (
    ("", "Job type"),
    ("freelancer", "Freelancer"),
    ("fulltime", "Fulltime"),
)


class JobItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    photo = models.ImageField(upload_to="jobs/",)
    job_title = models.CharField(max_length=200)
    industry = models.CharField(max_length=200)
    job_level = models.CharField(max_length=120)
    experience = models.CharField(max_length=120)
    short_description = models.TextField(max_length=120)
    description = RichTextField()
    user = models.ForeignKey(
        "company.Profile",
        on_delete=models.CASCADE,
        related_name="company_job_profile",
    )
    country = models.CharField(max_length=200)
    state = models.CharField(max_length=200)
    city = models.CharField(max_length=200)
    post_date = models.DateTimeField(db_index=True, auto_now_add=True)
    deadline = models.DateField()
    # duration = models.CharField(max_length=200)
    skills = models.TextField(blank=True, null=True)
    amnt_start_per_hrs = models.DecimalField(
        max_digits=20,
        decimal_places=2,
        default=0,
        validators=[
            MinValueValidator(Decimal('0.00'))
        ]
    )
    amnt_end_per_hrs = models.DecimalField(
        max_digits=20,
        decimal_places=2,
        default=0,
        validators=[
            MinValueValidator(Decimal('0.00'))
        ]
    )
    job_type = models.CharField(max_length=10, choices=JOB_TYPE)
    is_deleted = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'webs_job_item'
        verbose_name = _('web job_item')
        verbose_name_plural = _('web job_items')

    def __unicode__(self):
        return "%s - %s - %s" % (self.name, self.type)
