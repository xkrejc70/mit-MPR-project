from django.db import models
from django.utils.translation import gettext_lazy as _
from .user import User
from .project import Project
from .choices import Probability, Impact, Status, Phase

# Class RiskCategory
class RiskCategory(models.Model):
    name = models.CharField(max_length=128, null=True)
    description = models.CharField(max_length=512, blank=True, null=True)

    class Meta(object):
        verbose_name_plural = 'Risk Categories'

    def __str__(self):
        return self.name


# Class Risk
class Risk(models.Model):
    owner = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    category = models.ForeignKey(RiskCategory, null=True, on_delete=models.SET_NULL)
    project = models.ForeignKey(Project, null=True, on_delete=models.SET_NULL)
    title = models.CharField(max_length=256)
    description = models.CharField(max_length=512, null=True)
    danger = models.CharField(max_length=512)
    trigger = models.CharField(max_length=512)
    reactions = models.CharField(max_length=512)
    probability = models.CharField(max_length=64, choices=Probability.choices)
    impact = models.CharField(max_length=64, choices=Impact.choices)
    status = models.CharField(max_length=64, choices=Status.choices)
    phase = models.CharField(max_length=64, choices=Phase.choices, default=Phase.IMPLEMENTATION)
    date_identified = models.DateField(null=True)
    date_updated = models.DateField(null=True)
    date_reaction = models.DateField(null=True)

    def __str__(self):
        return self.title + ' (' + self.project.name + ')'
    
