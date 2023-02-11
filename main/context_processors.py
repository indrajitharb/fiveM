from users.functions import get_current_role
import datetime
from users import models as userModels
from company import models as companyModels


def main_context(request):
    # today = datetime.date.today().strftime('%m/%d/%Y')
    today = datetime.date.today()

    previous_date = datetime.date.today() - datetime.timedelta(days=31)
    is_superuser = False
    user_instance = None
    staff_instance = None

    if "set_user_timezone" in request.session:
        user_session_ok = True
        user_time_zone = request.session['set_user_timezone']
    else:
        user_session_ok = False
        user_time_zone = "Asia/Kolkata"

    profile = None
    role = ''
    if request.user.is_authenticated:

        current_role = get_current_role(request)
        if current_role == 'employee':
            if userModels.Profile.objects.filter(user=request.user).exists():
                profile = userModels.Profile.objects.get(user=request.user)
            role = 'Freelancer'
        elif current_role == 'company':
            if companyModels.Profile.objects.filter(user=request.user).exists():
                profile = companyModels.Profile.objects.get(user=request.user)
            role = 'Employer'
        else:
            role = current_role

    return {
        'app_title': "fiveM",
        "current_role": role,
        "profile": profile,

        "user_session_ok": user_session_ok,
        "user_time_zone": user_time_zone,
        "confirm_decline_message": "Are you sure want to decline this item.",
        "confirm_approve_message": "Are you sure want to approve this item.",
        "confirm_delete_message": "Are you sure want to delete this item. All associated data may be removed.",
        "revoke_access_message": "Are you sure to revoke this user's login access",
        "confirm_delete_selected_message": "Are you sure to delete all selected items.",
        "confirm_apply_message": "Are you sure want to apply this job.",
        "confirm_read_message": "Are you sure want to mark as read this item.",
        "confirm_read_selected_message": "Are you sure to mark as read all selected items.",
        'domain': request.META['HTTP_HOST'],
        "previous_date": previous_date,

        "user_instance": user_instance,
        "staff_instance": staff_instance,
        "is_superuser": is_superuser,
        "today": today,
    }
