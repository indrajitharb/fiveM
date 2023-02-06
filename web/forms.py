from django import forms
from web import models as webModel
from django.utils.translation import gettext_lazy as _
from django.forms.widgets import TextInput, Select, Textarea, FileInput, DateInput
from ckeditor.widgets import CKEditorWidget


class JobItemForm(forms.ModelForm):

    class Meta:
        model = webModel.JobItem
        exclude = [
            'user',
            'is_deleted',
            'is_active'
        ]
        widgets = {
            "job_title": TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "e.g. Senior Product Designer",
                    'required': 'required',
                }
            ),
            "industry": TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "e.g. Development",
                    'required': 'required',
                }
            ),
            "job_level": TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "e.g. Experienced (Non - Manager)",
                    'required': 'required',
                }
            ),
            "experience": TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "e.g. 1-2 years",
                    'required': 'required',
                }
            ),
            "deadline": DateInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "YYYY-MM-DD",
                    'required': 'required',
                    # 'pattern=': '\d{4}-\d{2}-\d{2}',
                    'format': 'yyyy-mm-dd',
                }
            ),
            "short_description": Textarea(
                attrs={
                    "placeholder": "Short description",
                    "class": "required form-control",
                    'required': 'required',
                    "rows": "2"
                }
            ),
            "description": CKEditorWidget(
                attrs={
                    'class': 'required form-control',
                    'placeholder': 'Description',
                    # 'cols': 30,
                    'rows': 8,
                },
            ),
            "country": TextInput(
                attrs={
                    "class": "required form-control",
                    'required': 'required',
                    "placeholder": "e.g. India",
                }
            ),
            "state": TextInput(
                attrs={
                    "class": "required form-control",
                    'required': 'required',
                    "placeholder": "e.g. Kereala",
                }
            ),
            "city": TextInput(
                attrs={
                    "class": "required form-control",
                    'required': 'required',
                    "placeholder": "e.g. Wayanad",
                }
            ),
            "job_type": Select(
                attrs={
                    "class": "required selecty form-control select-picker"
                }
            ),
            "amnt_start_per_hrs": TextInput(
                attrs={
                    "class": "required form-control",
                    'required': 'required',
                    "placeholder": "Min",
                }
            ),
            "amnt_end_per_hrs": TextInput(
                attrs={
                    "class": "required form-control",
                    'required': 'required',
                    "placeholder": "Max",
                }
            ),
            "skills": TextInput(
                attrs={
                    "class": "required form-control",
                    "placeholder": "e.g. Figma, UI/UX, Sketch...",
                }
            ),
            'logo': FileInput(attrs={'class': 'fileupload'})
        }
        labels = {
            'job_title': 'Job title',
            'description': 'Add your job description',
        }
        error_messages = {
            "job_title": {
                "required": _("Job title field is required.")
            },
        }
