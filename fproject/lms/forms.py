from .models import CustomUser, Student, Teacher
from django.contrib.auth.forms import UserCreationForm
from django import forms

class CustomCreationForm(UserCreationForm):

    class Meta:
        model = Student
        fields = ('username', 'first_name','last_name', 'password1' ,'password2',)
    
    def save(self, type):
        if type == "STUDENT":
            student = Student.objects.create_user()
            return student
        elif type == "TEACHER":
            teacher = Teacher.objects.create_user()
            return teacher
