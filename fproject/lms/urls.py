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
    path("submissions", views.submissions_view, name='submissions'),
    path("subjects/<int:subj_id>", views.subject_view, name="subject"),
    path("subjects/<int:subj_id>/assignments", views.assigns_view, name="assignments"),
    path("subjects/<int:subj_id>/groups", views.groups_view, name="groups"),
    path("assignments/<int:assign_id>", views.assign_view, name="assignment"),
    path("submissions/<int:submission_id>", views.submission_view, name="submission"),
    path('create/assignment', views.create_assignment, name="create_assignment"),
    path('create/question', views.create_question, name="create_question"),
    path('create/submission', views.create_submission, name='create_submission'),
    path('create/answer', views.create_answer, name='create-answer'),
    path('students', views.students_view, name='students')
]
