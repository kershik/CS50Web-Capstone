# FinalProject CS50Web

This is a final project which aimed to design and implement a web application that utilizes Django on the back-end and JavaScript on the front-end.

## Distinctiveness and Complexity

This project is a learning management system that support multiple user types. User can have one role only and it is defined at user creation. User roles:

1) **'Teacher'**:
* Can create a teacher's profile;
* Is assigned to particular subject by admin;
* Can create assignments -> in particular subject, for particular group, with deadline;
* Can view their assignments;
* Can see students' submission scores.

2) **'Student'**:
* Can create a student's profile;
* Is assigned to particular group by admin;
* Can create submissions to assignments;
* Can view their submission scores.

3) **'Admin'**:
* Can create subjects and groups;
* Can assign teachers and groups to subjects;
* Can assign students to groups.

Several models were created for these purposes. First, ```CustomUser``` (extends ```django.contrib.auth.models.AbstractUser```) for common information related to all users with additional role field and default role equal to 'Admin' (so whenever user signs up it is going to be 'Admin' by default). Second, proxy model ```Student``` with default role 'Student' and manager ```StudentManager``` making it possible to work only with students' data. Proxy model ```Teacher``` and its manager ```TeacherManager``` were set up in the same way. Finally, OneToOne model ```StudentProfile``` was created to add data about a group to ```Student``` (```StudentProfile``` is automatically generated using django signals so all that remains to be done by admin is to set a group value).  

There are two distinct forms to sign up, one for students and one for teachers. Newly created user receives 'Student' or 'Teacher' role, respectively, in this way. At the same time, log in form is the same for all types of users.

Other models included in the project: ```Group```, ```Subject```, ```Assignment```, ```Question```, ```Submission```, ```StudentAnswer```.

For user an assignment is essentially a set of related open-ended questions with correct answers created by a teacher.  A submission, in turn, is a set of related students' answers. They are compared to correct ones to calculate a submission score. If deadline passed, an assignment is not longer available to solve for students. Information about submissions for students and teachers is presented in the form of table with fields 'Assignment', 'Subject', 'Date' and 'Score'. 

## Content of newly created files

```static/lms```:
* ```functions.js``` contains functions common for student's and teacher's view
* ```student.js``` contains functions for student's page
* ```teacher.js``` contains functions for teacher's page
* ```styles.css``` with description how HTML elements should be displayed

```templates/lms```:
* ```index.html``` - template with inital greeting
* ```layout.html``` - with layout
* ```login.html``` - for login page
* ```register.html``` - with registration form
* ```student.html``` - for student's page
* ```teacher.html``` - for teacher's page

```forms.py``` contains django forms to create student, teacher, assignment.

## Getting started

1. Go to fproject directory.

```
cd fproject
```

2. Make migrations for lms app.

```
python manage.py makemigrations lms
```

3. Apply migrations to your database.

```
python manage.py migrate
```

4. Create an admin user.

```
python manage.py createsuperuser
```

5. Visit the site and add ```/admin``` to the url (for example, ```http://127.0.0.1:8000/admin```).

6. Log in with the username and password for admin user (see paragraph 4).

7. Create subjects and groups. Assign teachers and groups to subjects. When a student signs up assign him to a group. 
