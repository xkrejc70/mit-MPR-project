from django.db import models
from .user import User
from .choices import UserProjectRoles, Status
import datetime


# Class Project
class Project(models.Model):
    owner_id = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    name = models.CharField(max_length=256, null=True)
    description = models.CharField(max_length=512, blank=True, null=True)
    status = models.CharField(max_length=64, choices=Status.choices, default=Status.CONCEPT)
    scale_risk = models.BooleanField(default=True)
    date_begin = models.DateField(default=datetime.date.today)
    date_end = models.DateField(null=True)

    def __str__(self):
        return self.name


# Class UserProject
class UserProject(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    role = models.CharField(max_length=64, choices=UserProjectRoles.choices)

    def __str__(self):
        return self.user.name + ' (' + self.role + ') - ' + self.project.name