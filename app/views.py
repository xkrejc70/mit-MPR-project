from datetime import datetime
from django.contrib.auth import authenticate, login, logout
# from .helper import authenticate
from django.contrib.auth.hashers import make_password
from django.core import serializers
from django.http import *
from django.views.decorators.csrf import csrf_exempt
import logging
from .models import Project, Risk, RiskCategory, User, UserProject
from datetime import datetime
from .models.choices import UserProjectRoles, UserRoles

logger = logging.getLogger(__name__)


def create_fake_user(request):
    email = "test5"
    user = User.objects.all().filter(email=email).first()
    if user is None:
        password = make_password(email)
        user = User.objects.create(password=password, name="test", surname="test", email=email, role="USER")
        data = serializers.serialize('json', [user, ])
        return HttpResponse(data, content_type='application/json')
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def check_user_logged(request):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    else:
        user = User.objects.get(email=request.user.email)
        data = serializers.serialize('json', [user, ])
        return HttpResponse(data, content_type='application/json')


@csrf_exempt
def get_user(request, pk):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'GET':
        user = User.objects.get(pk=pk)
        if user is not None:
            data = serializers.serialize('json', [user, ])
            return HttpResponse(data, content_type='application/json')
        else:
            return HttpResponseNotFound()
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def login_user(request):
    if request.method != 'POST':
        return HttpResponseBadRequest()
    # User.objects.all().filter(email="test").first().delete()
    username = request.POST["email"]
    pwd = request.POST["password"]
    user = authenticate(request=request, email=username, password=pwd)
    if user is not None:
        login(request, user)
        data = serializers.serialize('json', [user, ])
        return HttpResponse(data, content_type='application/json')
    else:
        return HttpResponseForbidden()


@csrf_exempt
def logout_user(request):
    logout(request)
    return HttpResponse()


@csrf_exempt
def get_users(request):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'GET':
        users = serializers.serialize('json', User.objects.all())
        return HttpResponse(users, content_type='application/json')
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def get_projects(request):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'GET':
        pk = request.user.pk
        users = User.objects.filter(pk=pk)
        if len(users) > 0:
            if users[0].role == UserRoles.ADMIN:
                projects = Project.objects.all()
                projects = serializers.serialize('json', projects)
                return HttpResponse(projects, content_type='application/json')
            else:
                # projects = Project.objects.all().select_related('')
                userProjects = UserProject.objects.all().filter(user=pk)
                projects = map(lambda x: x.project, userProjects)
                projects = serializers.serialize('json', projects)
                return HttpResponse(projects, content_type='application/json')
        else:
            return HttpResponseNotFound()
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def get_risk_categories(request):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'GET':
        risk_categories = serializers.serialize('json', RiskCategory.objects.all())
        return HttpResponse(risk_categories, content_type='application/json')
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def get_project(request, pk):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'GET':
        project = Project.objects.get(pk=pk)
        if project is not None:
            project = serializers.serialize('json', [project, ])
            return HttpResponse(project, content_type='application/json')
        else:
            return HttpResponseNotFound()
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def create_project(request):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'POST':
        name = request.POST["name"]
        description = request.POST["description"]
        status = request.POST["status"]
        scale_risk = request.POST["scale_risk"]
        date_begin = request.POST["date_begin"]
        date_end = request.POST["date_end"]
        user = User.objects.get(email=request.user.email)
        begin = datetime.strptime(date_begin, "%Y-%m-%d").date()
        end = datetime.strptime(date_end, "%Y-%m-%d").date()
        # logger.warning('Homepage was accessed at ' + str(request.user.email) + ' hours!')
        if user is not None:
            project = Project.objects.create(
                owner_id=user,
                name=name,
                description=description,
                status=status,
                scale_risk=scale_risk,
                date_begin=begin,
                date_end=end
            )
            user_project = UserProject.objects.create(
                user=user,
                project=project,
                role=UserProjectRoles.MANAGER
            )
            print(user_project)
            project = serializers.serialize('json', [project, ])
            return HttpResponse(project, content_type='application/json')
        else:
            return HttpResponseNotFound()
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def create_project_role(request):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'POST':
        user = request.POST["user"]
        project = request.POST["project"]
        role = request.POST["role"]
        user = User.objects.get(pk=user)
        project = Project.objects.get(pk=project)

        user_project = UserProject.objects.create(
            user=user,
            project=project,
            role=role
        )
        user_project = serializers.serialize('json', [user_project, ])
        return HttpResponse(user_project, content_type='application/json')
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def get_project_roles(request, pk):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'GET':
        project_roles = UserProject.objects.filter(project=pk)
        json_data = serializers.serialize('json', project_roles)
        return HttpResponse(json_data, content_type='application/json')
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def get_user_risks(request, pk):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'GET':
        risks = Risk.objects.filter(owner=pk)
        json_data = serializers.serialize('json', risks)
        return HttpResponse(json_data, content_type='application/json')
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def get_project_risks(request, pk):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'GET':
        risks = Risk.objects.filter(project=pk)
        json_data = serializers.serialize('json', risks)
        return HttpResponse(json_data, content_type='application/json')
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def get_risk(request, pk):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'GET':
        risk = Risk.objects.get(pk=pk)
        if risk is not None:
            risk = serializers.serialize('json', [risk, ])
            return HttpResponse(risk, content_type='application/json')
        else:
            return HttpResponseNotFound()
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def create_risk(request):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'POST':
        category = request.POST["category"]
        project = request.POST["project"]
        title = request.POST["title"]
        description = request.POST["description"]
        danger = request.POST["danger"]
        trigger = request.POST["trigger"]
        reactions = request.POST["reactions"]
        probability = request.POST["probability"]
        impact = request.POST["impact"]
        status = request.POST["status"]
        phase = request.POST["phase"]
        date_identified = request.POST["date_identified"]
        date_updated = request.POST["date_updated"]
        date_reaction = request.POST["date_reaction"]
        user = User.objects.get(email=request.user.email)
        category = RiskCategory.objects.get(pk=category)
        date_identified = datetime.strptime(date_identified, "%Y-%m-%d").date()
        date_updated = datetime.strptime(date_updated, "%Y-%m-%d").date()
        date_reaction = datetime.strptime(date_reaction, "%Y-%m-%d").date()
        if user is not None:
            project = Project.objects.get(pk=project)
            if project is not None:
                risk = Risk.objects.create(
                    owner=user,
                    category=category,
                    project=project,
                    title=title,
                    description=description,
                    danger=danger,
                    trigger=trigger,
                    reactions=reactions,
                    probability=probability,
                    impact=impact,
                    status=status,
                    phase=phase,
                    date_identified=date_identified,
                    date_updated=date_updated,
                    date_reaction=date_reaction
                )
                risk = serializers.serialize('json', [risk, ])
                return HttpResponse(risk, content_type='application/json')
            else:
                return HttpResponseNotFound()
        else:
            return HttpResponseNotFound()
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def update_risk(request):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'POST':
        pk = request.POST["pk"]
        old = Risk.objects.all().filter(pk=pk)
        old_object = old.first()
        if old is None:
            return HttpResponseNotFound()
        category = request.POST.get("category", old_object.category)
        project = request.POST.get("project", old_object.project)
        title = request.POST.get("title", old_object.title)
        description = request.POST.get("description", old_object.description)
        danger = request.POST.get("danger", old_object.danger)
        trigger = request.POST.get("trigger", old_object.trigger)
        reactions = request.POST.get("reactions", old_object.reactions)
        probability = request.POST.get("probability", old_object.probability)
        impact = request.POST.get("impact", old_object.impact)
        status = request.POST.get("status", old_object.status)
        phase = request.POST.get("phase", old_object.phase)
        date_identified = request.POST.get("date_identified", str(old_object.date_identified))
        date_updated = datetime.now().strftime("%Y-%m-%d")
        date_reaction = request.POST.get("date_reaction", str(old_object.date_reaction))
        user = User.objects.get(email=request.user.email)
        date_identified = datetime.strptime(date_identified, "%Y-%m-%d").date()
        date_updated = datetime.strptime(date_updated, "%Y-%m-%d").date()
        date_reaction = datetime.strptime(date_reaction, "%Y-%m-%d").date()
        old.update(
            owner=user,
            category=category,
            project=project,
            title=title,
            description=description,
            danger=danger,
            trigger=trigger,
            reactions=reactions,
            probability=probability,
            impact=impact,
            status=status,
            phase=phase,
            date_identified=date_identified,
            date_updated=date_updated,
            date_reaction=date_reaction
        )
        risk = Risk.objects.all().get(pk=old_object.pk)
        risk = serializers.serialize('json', [risk, ])
        return HttpResponse(risk, content_type='application/json')
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def update_project(request):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'POST':
        old = Project.objects.all().filter(pk=request.POST["pk"])
        if old is None:
            return HttpResponseNotFound()
        user = User.objects.get(email=request.user.email)
        name = request.POST["name"] if request.POST["name"] else old.name
        description = request.POST["description"] if request.POST["description"] else old.description
        status = request.POST["status"] if request.POST["status"] else old.status
        scale_risk = request.POST["scale_risk"] if request.POST["scale_risk"] else old.scale_risk
        date_begin = request.POST["date_begin"] if request.POST["date_begin"] else old.date_begin
        date_end = request.POST["date_end"] if request.POST["date_end"] else old.date_end
        date_begin = datetime.strptime(date_begin, "%Y-%m-%d").date()
        date_end = datetime.strptime(date_end, "%Y-%m-%d").date()
        project = old.update(
            owner_id=user,
            name=name,
            description=description,
            status=status,
            scale_risk=scale_risk,
            date_begin=date_begin,
            date_end=date_end
        )
        project = serializers.serialize('json', [project, ])
        return HttpResponse(project, content_type='application/json')
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def update_project_role(request):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'POST':
        old = UserProject.objects.all().filter(pk=request.POST["pk"])
        if old is None:
            return HttpResponseNotFound()
        user = request.POST["user"] if request.POST["user"] else old.user
        project = request.POST["project"] if request.POST["project"] else old.project
        role = request.POST["role"] if request.POST["role"] else old.role
        user = User.objects.get(pk=user)
        project = Project.objects.get(pk=project)
        project_role = old.update(
            user=user,
            project=project,
            role=role
        )
        project_role = serializers.serialize('json', [project_role, ])
        return HttpResponse(project_role, content_type='application/json')
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def create_risk_category(request):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'POST':
        name = request.POST["name"]
        description = request.POST["description"]
        risk_category = RiskCategory.objects.create(
            name=name,
            description=description,
        )
        risk_category = serializers.serialize('json', [risk_category, ])
        return HttpResponse(risk_category, content_type='application/json')
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def update_risk_category(request):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'POST':
        pk = request.POST["pk"]
        old = RiskCategory.objects.all().filter(pk)
        if old is None:
            return HttpResponseNotFound()
        name = request.POST["name"] if request.POST["name"] else old.name
        description = request.POST["description"] if request.POST["description"] else old.description
        risk_category = old.update(
            name=name,
            description=description,
        )
        risk_category = serializers.serialize('json', [risk_category, ])
        return HttpResponse(risk_category, content_type='application/json')
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def delete_risk_category(request, pk):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'GET':
        category = RiskCategory.objects.get(pk=pk)
        if category is not None:
            category.delete()
            return HttpResponse()
        else:
            HttpResponseNotFound()
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def delete_project(request, pk):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'GET':
        project = Project.objects.get(pk=pk)
        if project is not None:
            project.delete()
            return HttpResponse()
        else:
            HttpResponseNotFound()
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def delete_project_role(request, pk):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'GET':
        project_role = UserProject.objects.get(pk=pk)
        if project_role is not None:
            project_role.delete()
            return HttpResponse()
        else:
            HttpResponseNotFound()
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def delete_risk(request, pk):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'GET':
        risk = Risk.objects.get(pk=pk)
        if risk is not None:
            risk.delete()
            return HttpResponse()
        else:
            HttpResponseNotFound()
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def update_user(request):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'POST':
        pk = request.POST["pk"]
        old = User.objects.all().filter(pk=pk)
        if old is None:
            return HttpResponseNotFound()
        old_object = old.first()
        if request.POST.get('password', False):
            password = make_password(request.POST["password"])
        else:
            password = old_object.password
        name = request.POST.get('name', False) if request.POST.get('name', False) else old_object.name
        surname = request.POST.get("surname", False) if request.POST.get("surname", False) else old_object.surname
        email = request.POST.get("email", False) if request.POST.get("email", False) else old_object.email
        role = request.POST.get("role", False) if request.POST.get("role", False) else old_object.role
        old.update(
            name=name,
            surname=surname,
            email=email,
            role=role,
            password=password,
        )
        user = User.objects.all().get(pk=old_object.pk)
        user = serializers.serialize('json', [user, ])
        return HttpResponse(user, content_type='application/json')
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def delete_user(request, pk):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method == 'GET':
        user = User.objects.get(pk=pk)
        if user is not None:
            user.delete()
            return HttpResponse()
        else:
            HttpResponseNotFound()
    else:
        return HttpResponseBadRequest()


@csrf_exempt
def all_risks(request):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    risks = serializers.serialize('json', Risk.objects.all())
    return HttpResponse(risks, content_type='application/json')


@csrf_exempt
def project_user_role(request):
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    if request.method != 'POST':
        return HttpResponseBadRequest()
    project_pk = request.POST['project_pk']
    user_pk = request.POST['user_pk']
    user_project = UserProject.objects.all().filter(user=user_pk, project=project_pk)
    if len(user_project) > 0:
        result = serializers.serialize('json', [user_project.first(), ])
        return HttpResponse(result, content_type='application/json')
    return HttpResponseNotFound()
