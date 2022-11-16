from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

from .models import CustomUser, Student, Teacher
from .forms import CustomCreationForm

# Create your views here.
def index(request):
     return render(request, 'lms/index.html')

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
                return HttpResponse('This is teacher')
            elif role == 'STUDENT':
                return HttpResponse('This is student')
            else:
                return HttpResponseRedirect(reverse("login_view"))
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
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        first_name = request.POST["first_name"]
        last_name = request.POST["last_name"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "lms/register.html", {
                "message": "Passwords must match.",
                "type": type
            })

        # Attempt to create new user
        try:
            if type == "STUDENT":
                user = Student.objects.create_user(username, email, password, 
                                                   first_name=first_name, last_name=last_name)
            elif type == "TEACHER":
                user = Teacher.objects.create_user(username, email, password, 
                                                   first_name=first_name, last_name=last_name)
        except IntegrityError:
            return render(request, "lms/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "lms/register.html", {
            'type': type
        })    