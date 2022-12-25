from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json
from datetime import datetime

from .models import Student, StudentProfile, \
    Group, Subject, Assignment, Question, Submission, StudentAnswer
from .forms import StudentCreationForm, TeacherCreationForm, AssignmentCreationForm


def index(request):
     return render(request, 'lms/index.html')

@login_required
def student_view(request):
    return render(request, "lms/student.html")

@login_required
def teacher_view(request):
    subjects = Subject.objects.filter(teachers__id=request.user.id)
    form = AssignmentCreationForm(choices=subjects)
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
            return HttpResponseRedirect(reverse(type.lower()))
    return render(request, "lms/register.html", {
            'type': type,
            'form': form
        })    

@login_required
def subjects_view(request):
    if request.method == "GET":
        if request.user.role == 'STUDENT':
            student = StudentProfile.objects.get(user=request.user)
            try:
                subjects = student.group.subjects.all()
            except AttributeError:
                # if admin hasn't set group for student yet
                return JsonResponse({
                    "message": "You have no subjects yet."
                }, status=201)
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

@login_required
def subject_view(request, subj_id):
    if request.method == "GET":
        subject = Subject.objects.get(id=subj_id)
        return JsonResponse(subject.serialize(), safe=False)
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)

@login_required
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

@login_required
def assign_view(request, assign_id):
    if request.method == "GET":
        assignment = Assignment.objects.get(id=assign_id)
        return JsonResponse(assignment.serialize(), safe=False)
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)

@login_required
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

@login_required
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

@login_required
@csrf_exempt
def create_submission(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    assignment_id = data.get('assignment_id', '')

    assignment = Assignment.objects.get(id=assignment_id)

    submission = Submission(
        assignment=assignment,
        student=request.user,
        score=0,
        date=datetime.now().date()
    )
    submission.save()

    return JsonResponse({
        "message": "Submission created successfully.",
        "id": submission.id
        }, status=201)

@login_required
@csrf_exempt
def create_answer(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    text = data.get('text', '')
    question_id = data.get('question_id', '')
    submission_id = data.get('submission_id', '')

    question = Question.objects.get(id=question_id)
    submission = Submission.objects.get(id=submission_id)

    student_answer = StudentAnswer(
        text=text,
        question=question,
        submission=submission
    )
    student_answer.save()

    if student_answer.text == question.answer:
        submission.score += 1 * 100 // question.assignment.questions.count()
    submission.save()

    return JsonResponse({
        "message": "Answer created successfully."
        }, status=201)

@login_required
def submission_view(request, submission_id):
    if request.method == "GET":
        submission = Submission.objects.get(id=submission_id)
        return JsonResponse(submission.serialize(), safe=False)
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)

@login_required    
def submissions_view(request): 
    if request.method == "GET":
        if request.user.role == 'STUDENT':
            submissions = Submission.objects.filter(student=request.user)
        elif request.user.role == 'TEACHER':
            subject_id = request.GET.get('subject')
            subject = Subject.objects.get(id=subject_id)
            student_id = request.GET.get('student')
            student = Student.objects.get(id=student_id)
            assignments = Assignment.objects.filter(subject=subject)
            submissions = Submission.objects.filter(student=student, assignment__in=assignments)
        return JsonResponse([s.serialize() for s in submissions], safe=False)
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)
 
@login_required
def groups_view(request, subj_id):
    if request.method == "GET":
        subject = Subject.objects.get(id=subj_id)
        groups = subject.groups.all()
        return JsonResponse([g.serialize() for g in groups], safe=False)
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)

@login_required
def students_view(request):
    if request.method == "GET":
        group = Group.objects.get(id=request.GET.get('group'))
        student_profiles = StudentProfile.objects.filter(group=group)
        return JsonResponse([sp.user.serialize() for sp in student_profiles], safe=False)
    else:
        return JsonResponse({
            "error": "GET request required."
        }, status=400)