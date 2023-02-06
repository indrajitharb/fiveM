from registration.forms import RegistrationForm
from django import forms
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.forms.widgets import TextInput, Select, Textarea
from company.models import Profile
from django.contrib.auth.forms import UserModel, UsernameField
from django.utils.text import capfirst
from django.contrib.auth import authenticate


class LoginForm(forms.Form):
    username = UsernameField(
        max_length=254,
        widget=forms.TextInput(
            attrs={
                'autofocus': True,
                'placeholder': "Username",
                'class': 'form-control',
                'required': 'required',
            }
        ),
    )
    password = forms.CharField(
        label=_("Password"),
        strip=False,
        widget=forms.PasswordInput(
            attrs={
                'placeholder': "Password",
                'class': 'form-control',
                'required': 'required',
            }
        ),
    )

    error_messages = {
        'invalid_login': _(
            "Please enter a correct %(username)s and password. Note that both "
            "fields may be case-sensitive."
        ),
        'inactive': _("This account is inactive."),
    }

    def get_user_id(self):
        if self.user_cache:
            return self.user_cache.id
        return None

    def get_user(self):
        return self.user_cache


class UserRegistrationForm(RegistrationForm):
    first_name = UsernameField(
        max_length=254,
        widget=forms.TextInput(
            attrs={
                'autofocus': True,
                'placeholder': "First name",
                'class': 'form-control',
                'required': 'required',
            }
        ),
    )
    last_name = UsernameField(
        max_length=254,
        widget=forms.TextInput(
            attrs={
                'placeholder': "Lastname",
                'class': 'form-control',
                'required': 'required',
            }
        ),
    )
    username = forms.CharField(
        label=_("Username"),
        max_length=30,
        widget=forms.TextInput(
            attrs={'placeholder': 'Enter username', 'class': 'required'}
        )
    )

    # phone = forms.CharField(
    #     label=_("Phone"),
    #     max_length=20,
    #     widget=forms.TextInput(
    #         attrs={'placeholder': 'Enter phone', 'class': 'required'}
    #     )
    # )

    email = forms.EmailField(
        label=_("Email"),
        max_length=254,
        widget=forms.TextInput(
            attrs={
                'placeholder': 'Enter email',
                'class': 'required form-control'
            }
        )
    )

    password1 = forms.CharField(
        label=_("Password"),
        widget=forms.PasswordInput(
            attrs={
                'placeholder': 'Enter password',
                'class': 'required'
            }
        )
    )

    password2 = forms.CharField(
        label=_("Repeat Password"),
        widget=forms.PasswordInput(
            attrs={
                'placeholder': 'Enter password again',
                'class': 'required'
            }
        )
    )

    # state = forms.ModelChoiceField(
    #     queryset=State.objects.filter(
    #         country__web_code="IN",
    #     ),
    #     widget=forms.Select(attrs={'class': 'select chosen-select'}
    #                         )
    # )

    # country = forms.ModelChoiceField(
    #     queryset=Country.objects.all(),
    #     widget=forms.Select(
    #         attrs={'class': 'select chosen-select'},
    #     ),
    # )

    bad_domains = [
        'guerrillamail.com',
        'mailinator.com',
        'example.com',
        'yopmail.com'
    ]

    def clean_email(self):
        email_domain = self.cleaned_data['email'].split('@')[1]
        if User.objects.filter(email__iexact=self.cleaned_data['email'], is_active=True):
            raise forms.ValidationError(
                _("This email address is already in use.")
            )
        elif email_domain in self.bad_domains:
            raise forms.ValidationError(
                _("Registration using %s email addresses is not allowed. Please supply a different email address." % email_domain)
            )
        return self.cleaned_data['email']

    min_password_length = 6

    def clean_password1(self):
        password1 = self.cleaned_data.get('password1', '')
        if len(password1) < self.min_password_length:
            raise forms.ValidationError(
                "Password must have at least %i characters" % self.min_password_length
            )
        else:
            return password1

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError(
                self.error_messages['password_mismatch'],
                code='password_mismatch',
            )
        return password2

    min_username_length = 6

    def clean_username(self):
        username = self.cleaned_data['username']
        existing = User.objects.filter(
            username__iexact=self.cleaned_data['username']
        )
        if existing.exists():
            raise forms.ValidationError(
                _("A user with that username already exists.")
            )
        elif len(username) < self.min_username_length:
            raise forms.ValidationError(
                "Username must have at least %i characters" % self.min_password_length
            )
        else:
            return self.cleaned_data['username']


class ProfileForm(forms.ModelForm):

    class Meta:
        model = Profile
        exclude = [
            "user",
            "file",
            'is_banned',
            'is_deleted',
            'is_admin_created'
        ]
        widgets = {
            "name": TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Company Name",
                    'required': 'required',
                }
            ),
            "email": TextInput(
                attrs={
                    "class": "required form-control",
                    'required': 'required',
                    "placeholder": "Email"
                }
            ),
            "phone": TextInput(
                attrs={
                    "class": "required form-control",
                    "placeholder": "Phone",
                    'required': 'required',
                    # "disabled": "disabled"
                }
            ),
            "website": TextInput(
                attrs={
                    "class": "required form-control",
                    'required': 'required',
                    "placeholder": "https://",
                }
            ),
            "facebook": TextInput(
                attrs={
                    "class": "required form-control",
                    'required': 'required',
                    "placeholder": "https://facebook.com/",
                }
            ),
            "instagram": TextInput(
                attrs={
                    "class": "required form-control",
                    'required': 'required',
                    "placeholder": "https://instagram.com/",
                }
            ),
            "twitter": TextInput(
                attrs={
                    "class": "required form-control",
                    'required': 'required',
                    "placeholder": "https://twitter.com/",
                }
            ),
            "address": Textarea(
                attrs={
                    "placeholder": "Address Line 1",
                    "class": "required form-control",
                    'required': 'required',
                    "rows": "5"
                }
            ),
            "about": Textarea(
                attrs={
                    "placeholder": "Write about you...",
                    "class": "required form-control",
                    'required': 'required',
                    "rows": "5"
                }
            ),
            "pincode": TextInput(
                attrs={
                    "class": "required form-control",
                    'required': 'required',
                    "placeholder": "Enter the post code"
                }
            ),
            "city": TextInput(
                attrs={
                    "class": "required form-control",
                    'required': 'required',
                    "placeholder": "City"
                }
            ),
            "state": TextInput(
                attrs={
                    "class": "required form-control",
                    'required': 'required',
                    "placeholder": "State"
                }
            ),
            "country": TextInput(
                attrs={
                    "class": "required form-control",
                    'required': 'required',
                    "placeholder": "Country"
                }
            ),
        }
        labels = {
            'name': 'Company name',
        }
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
            "about": {
                "required": _("About field is required.")
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
                'style': 'display:none;'
            }),
        }
        labels = {
            "file": "Upload Avatar"
        }
