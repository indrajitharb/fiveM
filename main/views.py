from django.shortcuts import render, get_object_or_404
from django.http.response import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from main.decorators import check_mode, ajax_required, check_profile_status
from django.db.models import Sum, Q
import datetime
import re
from django.http import JsonResponse
from users.functions import get_current_role


@check_mode
@login_required
@check_profile_status
def app(request):
    current_role = get_current_role(request)
    if current_role == 'employee':
        return HttpResponseRedirect(reverse("web:index"))
    else:
        return HttpResponseRedirect(reverse("company:dashboard"))


# @login_required
# @ajax_required
# def check_password_policy(request):
#     username = request.GET.get('username')
#     password1 = request.GET.get('password1')
#     s = password1
#     regex = re.compile('[@_!#$%^&*()<>?/\|}{~:]')
#     regex1 = re.compile(
#         '[A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z]'
#     )
#     regex2 = re.compile('[123456789]')
#     l = len(password1)
#     if s.find(username) == -1 and l > 8 and (regex.search(password1) != None) and (regex1.search(password1) != None) and (regex2.search(password1) != None):
#         response_data = {
#             "status": "true",
#         }
#     else:
#         response_data = {
#             "status": "false",
#         }
#     return JsonResponse(response_data)


@check_mode
@login_required
def search(request):
    # query = request.GET.get("q")
    # if query:
    #     clients = Client.objects.filter(
    #         Q(name__icontains=query) |
    #         Q(address__icontains=query) |
    #         Q(entity_type__name__icontains=query) |
    #         Q(office__icontains=query) |
    #         Q(contact_name_1__icontains=query) |
    #         Q(contact_name_2__icontains=query) |
    #         Q(contact_email_1__icontains=query) |
    #         Q(contact_email_2__icontains=query)
    #     )

    #     freeholders = FreeHolder.objects.filter(
    #         Q(name__icontains=query) |
    #         Q(contact_name_1__icontains=query) |
    #         Q(contact_name_2__icontains=query) |
    #         Q(contact_email_1__icontains=query) |
    #         Q(contact_email_2__icontains=query)
    #     )

    #     staffs = Staff.objects.filter(
    #         Q(name__icontains=query) |
    #         Q(user__username__icontains=query) |
    #         Q(designation__icontains=query)
    #     )

    #     lessees = Lessee.objects.filter(
    #         Q(name__icontains=query) |
    #         Q(adress__icontains=query) |
    #         Q(email1__icontains=query) |
    #         Q(email2__icontains=query) |
    #         Q(email3__icontains=query) |
    #         Q(user__username__icontains=query) |
    #         Q(email4__icontains=query)
    #     )

    #     sublessees = SubLessee.objects.filter(
    #         Q(name__icontains=query) |
    #         Q(adress__icontains=query) |
    #         Q(email__icontains=query)
    #     )

    #     suppliers = Supplier.objects.filter(
    #         Q(name__icontains=query) |
    #         Q(category__icontains=query) |
    #         Q(address__icontains=query) |
    #         Q(user__username__icontains=query) |
    #         Q(contact_email_1__icontains=query) |
    #         Q(contact_email_2__icontains=query)
    #     )

    #     year_end_accountants = YearEndAccountant.objects.filter(
    #         Q(name__icontains=query) |
    #         Q(category__icontains=query) |
    #         Q(user__username__icontains=query) |
    #         Q(email_id__icontains=query)
    #     )

    #     external_contractors = ExternalContractor.objects.filter(
    #         Q(name__icontains=query) |
    #         Q(category__icontains=query) |
    #         Q(user__username__icontains=query) |
    #         Q(email_id__icontains=query)
    #     )

    #     properties = Property.objects.filter(
    #         Q(location__icontains=query) |
    #         Q(address__icontains=query) |
    #         Q(definition__icontains=query) |
    #         Q(client__name__icontains=query) |
    #         Q(schedule__icontains=query)
    #     )

    #     property_managers = PropertyManager.objects.filter(
    #         Q(name__icontains=query) |
    #         Q(initials__icontains=query) |
    #         Q(user__username__icontains=query) |
    #         Q(email_id__icontains=query)
    #     )

    context = {
        # 'clients': clients,
        # 'freeholders': freeholders,
        # 'staffs': staffs,
        # 'lessees': lessees,
        # 'sublessees': sublessees,
        # 'suppliers': suppliers,
        # 'year_end_accountants': year_end_accountants,
        # 'external_contractors': external_contractors,
        # 'properties': properties,
        # 'property_managers': property_managers,

        "is_need_popup_box": True,
        "is_need_datatable": True

    }
    return render(request, 'includes/search_results.html', context)
