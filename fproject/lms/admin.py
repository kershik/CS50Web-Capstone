from django.contrib import admin
from .models import CustomUser, Student, StudentProfile, Teacher, Group, Subject, Student, Assignment, Submission
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

# Register your models here.
class UserProfileInline(admin.StackedInline):
    model = CustomUser
    can_delete = False

class AccountsUserAdmin(UserAdmin):
    inlines = [UserProfileInline]

# admin.site.unregister(User)
admin.site.register(CustomUser, AccountsUserAdmin)