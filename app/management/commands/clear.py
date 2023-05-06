from django.core.management.base import BaseCommand
from app.models.user import User
from app.models.project import Project
from app.models.risk import Risk, RiskCategory


class Command(BaseCommand):

    # Delete all models from DB
    def _delete_db(self):
        Risk.objects.all().delete()
        RiskCategory.objects.all().delete()
        Project.objects.all().delete()
        User.objects.all().delete()

    def handle(self, *args, **options):
        self._delete_db()

        self.stdout.write("All data successfully deleted")
    