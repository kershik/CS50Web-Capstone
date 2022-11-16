from django.contrib import admin
from .models import CustomUser, Student, Teacher, StudentProfile, Group, Subject, Assignment, Submission
from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(UserAdmin):
    fieldsets = (
        *UserAdmin.fieldsets,
        (
            'Additional Field',
            {
                'fields':(
                    'role',
                )
            }
        )
    )
 # do anothing about this dry
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Student, CustomUserAdmin)
admin.site.register(Teacher, CustomUserAdmin)
admin.site.register(StudentProfile)
admin.site.register(Group)
admin.site.register(Subject)
admin.site.register(Assignment)
admin.site.register(Submission)