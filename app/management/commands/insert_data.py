from django.core.management.base import BaseCommand
from app.models.user import User
from app.models.project import Project, UserProject
from app.models.risk import Risk, RiskCategory
from app.models.choices import Status, UserProjectRoles, Probability, Impact, Phase
from django.contrib.auth.hashers import make_password
from datetime import date, timedelta


class Command(BaseCommand):
    password = "Password1"

    def _create_user(self):
        password = make_password(self.password)
        user = User(password=password, name="user1", surname="user1", email="user1", role="USER")
        user.save()

    def _create_project(self):
        user_id = User.objects.latest('id')
        project = Project(
            owner_id=user_id,
            name="Project1",
            description="Test Project",
            status=Status.CONCEPT,
            scale_risk=True,
            date_begin=date.today(),
            date_end=date.today() + timedelta(days=14)
        )
        project.save()

    def _relate_user_project(self):
        user_id = User.objects.latest('id')
        project_id = Project.objects.latest('id')
        user_project = UserProject(
            user=user_id,
            project=project_id,
            role=UserProjectRoles.MANAGER
        )
        user_project.save()

    def _risk_category(self):
        risk_cat = RiskCategory(name="Organizační riziko", description="")
        risk_cat.save()

    def _create_risk_1(self):
        user_id = User.objects.latest('id')
        cat_id = RiskCategory.objects.latest('id')
        project_id = Project.objects.latest('id')
        risk = Risk(
            owner=user_id,
            category=cat_id,
            project=project_id,
            title="Nemoc",
            description="Jedním z nejčastějších rizik v projektovém managementu je nemoc nebo absence členů týmu. Nemoc může ovlivnit schopnost týmu dokončit úkoly včas a v souladu s plánem. Absence jednoho nebo více členů týmu může mít za následek přepracování zbylých členů týmu a zvýšení rizika pro celkovou úspěšnost projektu.",
            danger="Zpoždění projektu, snížení kvality výsledků, zvýšení nákladů na projekt a zvýšení stresu pro zbylé členy týmu.",
            trigger="Neočekávaná a neplánovaná nemoc členů týmu, dovolená, rodinné závazky a další neplánované události, které mohou mít za následek absenci jednoho nebo více členů týmu.",
            reactions="Zahrnutí rizika nemoci nebo absence do plánu projektu, vytvoření plánu náhradního personálu, pravidelná komunikace s členy týmu ohledně jejich zdravotního stavu a plánů na dovolenou, předběžné plánování pro případné zpoždění projektu.",
            probability=Probability.MEDIUM,
            impact=Impact.HIGH,
            status=Status.ACTIVE,
            phase=Phase.IMPLEMENTATION,
            date_identified=date.today(),
            date_updated=date.today(),
            date_reaction=date.today()
        )
        risk.save()

    def _create_risk_2(self):
        user_id = User.objects.latest('id')
        cat_id = RiskCategory.objects.latest('id')
        project_id = Project.objects.latest('id')
        risk = Risk(
            owner=user_id,
            category=cat_id,
            project=project_id,
            title="Nedostatečné rozdělení úkolů",
            description="Nesprávné nebo neúplné rozdělení úkolů mezi členy týmu, nejistota ohledně zodpovědnosti jednotlivých úkolů a chybějící jasné definice rolí a odpovědností v týmu.",
            danger="Neefektivní využívání zdrojů, zpoždění projektu a nedostatečné plnění úkolů.",
            trigger="Nesprávné rozdělení úkolů při zadání projektu, nejasné požadavky a cíle projektu, změny v plánech projektu nebo nepředvídatelné okolnosti během projektu.",
            reactions="Definice jasných rolí a odpovědností v týmu, pravidelná komunikace a koordinace úkolů a plánů, průběžné kontrolní body projektu, které kontrolují správnost rozdělení úkolů a případně možnost přehodnocení rozdělení úkolů",
            probability=Probability.MEDIUM,
            impact=Impact.MEDIUM,
            status=Status.CLOSED,
            phase=Phase.IMPLEMENTATION,
            date_identified=date.today(),
            date_updated=date.today(),
            date_reaction=date.today()
        )
        risk.save()

    def handle(self, *args, **options):
        self._create_user()
        self._create_project()
        self._relate_user_project()
        self._risk_category()
        self._create_risk_1()
        self._create_risk_2()