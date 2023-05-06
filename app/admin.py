from django.contrib import admin
from .models.user import User
from .models.project import Project, UserProject
from .models.risk import RiskCategory, Risk

admin.site.register(User)
admin.site.register(Project)
admin.site.register(UserProject)
admin.site.register(RiskCategory)
admin.site.register(Risk)