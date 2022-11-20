from django.contrib.auth.forms import UserCreationForm

from .models import Student, Teacher

class StudentCreationForm(UserCreationForm):

    class Meta(UserCreationForm.Meta):
        model = Student
        fields = ('username', 'email', 'first_name','last_name',)

class TeacherCreationForm(UserCreationForm):

    class Meta(UserCreationForm.Meta):
        model = Teacher
        fields = ('username', 'email', 'first_name','last_name',)



