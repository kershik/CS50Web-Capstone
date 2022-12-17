from django.contrib.auth.forms import UserCreationForm
from django import forms

from .models import Student, Teacher, Assignment

class StudentCreationForm(UserCreationForm):

    class Meta(UserCreationForm.Meta):
        model = Student
        fields = ('username', 'email', 'first_name','last_name',)

class TeacherCreationForm(UserCreationForm):

    class Meta(UserCreationForm.Meta):
        model = Teacher
        fields = ('username', 'email', 'first_name','last_name',)

class AssignmentCreationForm(forms.ModelForm):
    deadline = forms.DateField(input_formats=['%Y-%m-%d'])

    class Meta:
        model = Assignment
        fields = ('title', 'description', 'subject', 'group', 'deadline',)

    def __init__(self, choices, *args, **kwargs):
        super(AssignmentCreationForm, self).__init__(*args, **kwargs)
        self.fields['subject'] = forms.ModelChoiceField(queryset=choices)



