from django.db import models
from .choices import UserRoles
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, UserManager


# Class User
class User(AbstractBaseUser):
    password = models.CharField(max_length=256)
    name = models.CharField(max_length=256)
    surname = models.CharField(max_length=256)
    email = models.EmailField(max_length=256, unique=True)
    role = models.CharField(max_length=64, choices=UserRoles.choices, default=UserRoles.USER)

    last_login = models.DateTimeField(auto_now_add=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['password']

    objects = UserManager()

    def __str__(self):
        return self.name + ' ' + self.surname + ', ' + self.role