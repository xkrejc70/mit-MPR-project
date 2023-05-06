from django.db import models
from django.utils.translation import gettext_lazy as _

class UserRoles(models.TextChoices):
    ADMIN = "ADMIN", _("Administrátor"),
    PROJECT_MANAGER = "PROJECT_MANAGER", _("Projektový manažer"),
    USER = "USER", _("Běžný uživatel")

class UserProjectRoles(models.TextChoices):
    MANAGER = "MANAGER", _("Manažer"),
    EXTERNAL = "EXTERNAL", _("Externí uživatel"),
    EMPLOYEE = "EMPLOYEE", _("Zaměstnanec")

class Probability(models.TextChoices):
    TINY = "TINY", _("Nepatrná"),
    LOW = "LOW", _("Malá"),
    MEDIUM = "MEDIUM", _("Stredná")
    HIGH = "HIGH", _("Veľká")
    EXTREME = "EXTREME", _("Mimoriadne veľká")

class Impact(models.TextChoices):
    TINY = "TINY", _("Nepatrný"),
    LOW = "LOW", _("Malý"),
    MEDIUM = "MEDIUM", _("Cítiteľný")
    HIGH = "HIGH", _("Kritický")
    EXTREME = "EXTREME", _("Katastrofický")

class Status(models.TextChoices):
    CONCEPT = "CONCEPT", _("Koncept"),
    ACTIVE = "ACTIVE", _("Aktívne"),
    CLOSED = "CLOSED", _("Uzatvorené"),
    DELETED = "DELETED", _("Zmazané"),
    TRANSPIRED = "TRANSPIRED", _("Prihodilo sa"),

class Phase(models.TextChoices):
    STUDY = "STUDY", _("Úvodní studie"),
    DESIGN = "DESIGN", _("Návrh"),
    IMPLEMENTATION = "IMPLEMENTATION", _("Implementace"),
    TESTING = "TESTING", _("Testování"),
    MANAGEMENT = "MANAGEMENT", _("Vedení projektu"),