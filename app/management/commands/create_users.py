from django.core.management.base import BaseCommand
from app.models.user import User
from django.contrib.auth.hashers import make_password


class Command(BaseCommand):
    password = "Password1"

    # Users
    def _create_admin(self):
        password = make_password(self.password)
        user = User(password=password, name="admin", surname="admin", email="admin@mpr.cz", role="ADMIN")
        user.save()

    def _create_project_manager(self):
        password = make_password(self.password)
        user = User(password=password, name="Jan", surname="Dvořák", email="dvorak@mpr.cz", role="PROJECT_MANAGER")
        user.save()
        self.manager_id = User.objects.latest('id')

    def _create_user_1(self):
        password = make_password(self.password)
        user = User(password=password, name="Tomáš", surname="Jirásek", email="jirasek@mpr.cz", role="USER")
        user.save()
        self.user_id = User.objects.latest('id')

    def _create_user_2(self):
        password = make_password(self.password)
        user = User(password=password, name="Daniel", surname="Jirásek", email="dan@mpr.cz", role="USER")
        user.save()
        self.user_id = User.objects.latest('id')

    def handle(self, *args, **options):
        # Users
        self._create_admin()
        self._create_project_manager()
        self._create_user_1()
        self._create_user_2()