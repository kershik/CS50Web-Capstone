from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.db.models.signals import post_save
from django.dispatch import receiver


# Create your models here.
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        STUDENT = 'STUDENT', 'Student'
        TEACHER = 'TEACHER', 'Teacher'
    
    base_role = Role.ADMIN

    role = models.CharField(max_length=50, choices=Role.choices)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = self.base_role
            return super().save(*args, **kwargs)

class Group(models.Model):
    name = models.CharField(max_length=5)

    def __str__(self):
        return self.name

class StudentManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=CustomUser.Role.STUDENT)

class Student(CustomUser):
    base_role = CustomUser.Role.STUDENT
    
    student = StudentManager()

    class Meta:
        proxy = True

class StudentProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='students', null=True, blank=True)

    def __str__(self):
        return self.user.username

@receiver(post_save, sender=Student)
def create_user_profile(sender, instance, created, **kwargs):
    if created and instance.role == 'STUDENT':
        StudentProfile.objects.create(user=instance)

class TeacherManager(BaseUserManager):
    def get_queryset(self, *args, **kwargs):
        results = super().get_queryset(*args, **kwargs)
        return results.filter(role=CustomUser.Role.TEACHER)

class Teacher(CustomUser):
    base_role = CustomUser.Role.TEACHER
    
    teacher = TeacherManager()

    class Meta:
        proxy = True


class Subject(models.Model):
    name = models.CharField(max_length=20)
    teachers = models.ManyToManyField(Teacher, related_name='subjects')

class Assignment(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='assignments')
    creator = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='assignments')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='assignments')
    content = models.CharField(max_length=10000) # how to implement
    answers = models.CharField(max_length=10000) # optional or not...

class Submission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='submissions') 
    content = models.CharField(max_length=10000)
    score = models.IntegerField() # set min and max?
