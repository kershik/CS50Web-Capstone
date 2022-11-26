from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("student", views.student_view, name="student"),
    path("teacher", views.teacher_view, name="teacher"),
    path("register/<str:type>", views.register, name="register"),
    path("subjects", views.subjects_view, name="subjects"),
    path("subjects/<int:subj_id>", views.subject_view, name="subject"),
    path("subjects/<int:subj_id>/assignments", views.assigns_view, name="assignments"),
    path("assignments/<int:assign_id>", views.assign_view, name="assignment"),
    path('create/assignment', views.create_assignment, name="create_assignment"),
    path('create/question', views.create_question, name="create_question")
]
