from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json
from datetime import datetime

from .models import CustomUser, Student, Teacher, StudentProfile, Group, Subject, Assignment, Question
from .forms import StudentCreationForm, TeacherCreationForm, AssignmentCreationForm


# Create your views here.
def index(request):
     return render(request, 'lms/index.html')

def student_view(request):
    return render(request, "lms/student.html")

def teacher_view(request):
    form = AssignmentCreationForm()
    return render(request, "lms/teacher.html", {
            'form': form
        })   

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        
        # Check if authentication successful
        if user is not None:
            login(request, user)
            role = user.role
            if role == 'ADMIN':
                return HttpResponse('This is admin')
            elif role == 'TEACHER':
                return HttpResponseRedirect(reverse("teacher"))
            elif role == 'STUDENT':
                return HttpResponseRedirect(reverse("student"))
            else:
                return HttpResponseRedirect(reverse("login"))
        else:
            return render(request, "lms/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "lms/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request, type):
    if type == 'STUDENT':
        form = StudentCreationForm()
    elif type == 'TEACHER':
        form = TeacherCreationForm()
    
    if request.method == "POST":
        if type == 'STUDENT':
            form = StudentCreationForm(request.POST)
        elif type == 'TEACHER':
            form = TeacherCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return HttpResponseRedirect(reverse("subjects"))
    return render(request, "lms/register.html", {
            'type': type,
            'form': form
        })    

def subjects_view(request):
    if request.method == "GET":
        if request.user.role == 'STUDENT':
            student = StudentProfile.objects.get(user=request.user)
            subjects = student.group.subjects.all()
        elif request.user.role == 'TEACHER':
            subjects = Subject.objects.filter(teachers__id=request.user.id)
        else:
            return JsonResponse({
                "error": "User is not teacher or student."
            }, status=400)

        return JsonResponse([subject.serialize() for subject in subjects], safe=False)
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)

def subject_view(request, subj_id):
    if request.method == "GET":
        subject = Subject.objects.get(id=subj_id)
        return JsonResponse(subject.serialize(), safe=False)
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)

def assigns_view(request, subj_id):
    if request.method == "GET":
        subject = Subject.objects.get(id=subj_id)
        if request.user.role == 'STUDENT':
            student_group = StudentProfile.objects.get(user=request.user).group
            assignments = Assignment.objects.filter(subject=subject, group=student_group)
        elif request.user.role == 'TEACHER':
            assignments = Assignment.objects.filter(subject=subject, creator=request.user)
        else:
            return JsonResponse({
                "error": "User is not teacher or student."
            }, status=400)
        return JsonResponse([a.serialize() for a in assignments], safe=False)
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)

def assign_view(request, assign_id):
    if request.method == "GET":
        assignment = Assignment.objects.get(id=assign_id)
        return JsonResponse(assignment.serialize(), safe=False)
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)

@csrf_exempt
def create_assignment(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    title = data.get('title', '')
    description = data.get('description', '')
    subject = data.get('subject', '')
    group = data.get('group', '')
    deadline = data.get('deadline', '')
    deadline = datetime.strptime(deadline, "%Y-%m-%d").date()

    assignment = Assignment(
        title=title,
        description=description, 
        creator=request.user,
        subject=Subject.objects.get(id=subject),
        group=Group.objects.get(id=group),
        deadline=deadline
    )
    assignment.save()
    return JsonResponse({
        "message": "Assignment created successfully.",
        "id": assignment.id
        }, status=201)

@csrf_exempt
def create_question(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    text = data.get('text', '')
    answer = data.get('answer', '')
    assignment_id = data.get('assignment_id', '')

    question = Question(
        text=text,
        answer=answer,
        assignment=Assignment.objects.get(id=assignment_id)
    )
    question.save()

    return JsonResponse({
        "message": "Question created successfully."
        }, status=201)


 

