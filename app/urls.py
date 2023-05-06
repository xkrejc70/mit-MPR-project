from django.urls import path
from . import views


urlpatterns = [
    path('fake', views.create_fake_user, name='fake'),
    path('logged', views.check_user_logged, name='logged'),

    path('user/<str:pk>/', views.get_user, name='user'),
    path('login', views.login_user, name='login'),
    path('logout', views.logout_user, name='logout'),
    path('users', views.get_users, name='get_users'),
    path('projects', views.get_projects, name='get_projects'),
    path('risk_categories', views.get_risk_categories, name='get_risk_categories'),
    path('project/<str:pk>', views.get_project, name='get_project'),
    path('project_roles/<str:pk>', views.get_project_roles, name='get_project_roles'),
    path('user_risks/<str:pk>', views.get_user_risks, name='get_risks'),
    path('project_risks/<str:pk>', views.get_project_risks, name='get_risks'),
    path('risk/<str:pk>', views.get_risk, name='get_risk'),
    path('create_project', views.create_project, name='create_project'),
    path('create_project_role', views.create_project_role, name='create_project_role'),
    path('create_risk', views.create_risk, name='create_risk'),
    path('update_risk', views.update_risk, name='update_risk'),
    path('update_project', views.update_project, name='update_project'),
    path('update_project_role', views.update_project_role, name='update_project_role'),
    path('create_risk_category', views.create_risk_category, name='create_risk_category'),
    path('update_risk_category', views.update_risk_category, name='update_risk_category'),
    path('delete_risk_category/<str:pk>/', views.delete_risk_category, name='delete_risk_category'),
    path('delete_project/<str:pk>/', views.delete_project, name='delete_project'),
    path('delete_project_role/<str:pk>/', views.delete_project_role, name='delete_project_role'),
    path('delete_risk/<str:pk>/', views.delete_risk, name='delete_risk'),
    path('update_user', views.update_user, name='update_user'),
    path('delete_user/<str:pk>/', views.delete_user, name='delete_user'),
    path('all_risks', views.all_risks, name='all_risks'),
    path('project_user_role/', views.project_user_role, name='project_user_role'),
]
