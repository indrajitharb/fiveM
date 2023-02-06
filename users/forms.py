from django import forms
from django.forms.widgets import TextInput, Textarea, Select, HiddenInput, FileInput
from django.utils.translation import gettext_lazy as _
from django.core.files import File
from PIL import Image
from users.models import Profile
# from dal import autocomplete


class PhoneNumberForm(forms.Form):
    phone = forms.CharField(
        widget=TextInput(
            attrs={
                'class': 'required form-control',
                'placeholder': ' ',
                'type': 'number',
                'oninput': 'javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength)',
                'maxlength': '10',
                'minlength': '10',
            }
        )
    )


class OTPForm(forms.Form):
    otp = forms.CharField(
        widget=TextInput(
            attrs={
                'placeholder': ' ',
                'type': 'number',
                'oninput': 'javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength)',
                'maxlength': '4',
                'minlength': '4',
            }
        ),
    )


class ProfileForm(forms.ModelForm):

    class Meta:
        model = Profile
        exclude = [
            "user",
            "file",
            "phone",
            'is_banned',
            'is_deleted',
            'is_admin_created'
        ]
        widgets = {
            "name": TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Full Name"
                }
            ),
            "email": TextInput(
                attrs={
                    "class": "required form-control",
                    "placeholder": "Email"
                }
            ),
            "phone": TextInput(
                attrs={
                    "class": "required form-control",
                    "placeholder": "Phone",
                    "disabled": "disabled"
                }
            ),
            "website": TextInput(
                attrs={
                    "class": "required form-control",
                    "placeholder": "https://",
                }
            ),
            "address": Textarea(
                attrs={
                    "placeholder": "Address Line 1",
                    "class": "required form-control",
                    "rows": "5"
                }
            ),
            "bio": Textarea(
                attrs={
                    "placeholder": "Write about you...",
                    "class": "required form-control",
                    "rows": "5"
                }
            ),
            "gender": Select(
                attrs={
                    "class": "required selecty form-control select-picker"
                }
            ),
            "pincode": TextInput(
                attrs={
                    "class": "required form-control",
                    "placeholder": "Enter the post code"
                }
            ),
            "city": TextInput(
                attrs={
                    "class": "required form-control",
                    "placeholder": "City"
                }
            ),
            "state": TextInput(
                attrs={
                    "class": "required form-control",
                    "placeholder": "State"
                }
            ),
            "country": TextInput(
                attrs={
                    "class": "required form-control",
                    "placeholder": "Country"
                }
            ),
        }
        # labels = {
        #     'phone': 'Phone',
        #     'gender': 'Gender',
        # }
        error_messages = {
            "name": {
                "required": _("Name field is required.")
            },
            "email": {
                "required": _("Email field is required.")
            },
            "address": {
                "required": _("Address field is required.")
            },
            "gender": {
                "required": _("Gender field is required.")
            }
        }


class PhotoForm(forms.ModelForm):

    class Meta:
        model = Profile
        fields = ('file',)
        widgets = {
            'file': forms.FileInput(attrs={
                'accept': 'image/*',
                'class': '',
            }),
        }
        labels = {
            "file": "Upload Avatar"
        }

# class SelectUserForm(forms.Form):
# 	profile = forms.ModelChoiceField(
#         queryset = Profile.objects.filter(user__is_active=True,is_banned=False,is_deleted=False),
#         widget = autocomplete.ModelSelect2(url='users:profile_autocomplete',attrs={'data-placeholder': 'Profile','data-minimum-input-length': 1},)
#     )
