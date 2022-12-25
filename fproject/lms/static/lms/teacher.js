import {
    showSubjects,
    loadAssignment,
    createEl,
    createSubmissionTable
} from './functions.js';

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('subjects').onclick = () => showSubjects();
    document.getElementById('submissions').onclick = () => showSubmissions();
    document.getElementById('new-assignment').onclick = () => createAssignment();

    showSubjects();
})

function createAssignment() {   
    const newAssignView = document.getElementById('one-assignment-view');
    newAssignView.style.display = 'block';
    document.getElementById('create').style.display = 'block';
    document.getElementById('questions-container').style.display = 'none';
    
    document.getElementById('show-assignment').style.display = 'none';
    document.getElementById('subjects-view').style.display = 'none';
    document.getElementById('submissions-view').style.display = 'none';
    document.getElementById('one-subject-view').style.display = 'none';
    document.getElementById('one-submission-view').style.display = 'none';

    const title = document.getElementById('id_title');
    title.value = '';
    const description = document.getElementById('id_description');
    description.value = '';
    const subject = document.getElementById('id_subject');
    subject.value = '';
    const group = document.getElementById('id_group');
    group.value = '';
    const deadline = document.getElementById('id_deadline');
    deadline.value = '';
    deadline.setAttribute('placeholder', 'yyyy-mm-dd')

    const questionList = document.getElementById('question-list');
    questionList.innerHTML = '';

    const addQuestionButton = document.getElementById('add-question');
    addQuestionButton.setAttribute('class', 'my-button');
    addQuestionButton.onclick = () => {
        const newQuestion = document.getElementById('question-form-empty').cloneNode(true);
        newQuestion.style.display = 'block';
        newQuestion.setAttribute('class', 'question-form');
        const questionCount = document.getElementsByClassName('question-form').length;
        newQuestion.setAttribute('id', 'question-form-'+questionCount);
        const buttonDeleteQuestion = createEl('button', newQuestion, 'delete-question');
        buttonDeleteQuestion.innerHTML = 'Delete Question';
        buttonDeleteQuestion.setAttribute('class', 'my-button');
        buttonDeleteQuestion.onclick = () => {
            newQuestion.remove();
        }
        questionList.append(newQuestion);
    }

    const saveButton = document.getElementById('save-assignment');
    saveButton.setAttribute('class', 'my-button');
    saveButton.addEventListener('click', () => {
        fetch('/create/assignment', {
            method: 'POST',
            body: JSON.stringify({
                title: title.value,
                description: description.value,
                subject: subject.value,
                group: group.value,
                deadline: deadline.value
            })
        })
        .then(response => response.json())
        .then(result => {
                console.log(result);
                createQuestions(result.id);
            });
    });

}

function createQuestions(assignment_id) {
    const questions = document.getElementsByClassName('question-form');
    for (let i = 0; i < questions.length; i++) {
        fetch('/create/question', {
            method: 'POST',
            body: JSON.stringify({
                text: questions[i].children[0].elements['text'].value,
                answer: questions[i].children[0].elements['answer'].value,
                assignment_id: assignment_id
            })
        })
        .then(response => response.json())
        .then(result => {
                console.log(result);
                if (i === questions.length-1) {
                    document.getElementById('create').style.display = 'none';
                    loadAssignment(assignment_id);
                }
            });
    }
}

function showSubmissions() {
    const submissionsView = document.getElementById('submissions-view');
    submissionsView.style.display = 'block';

    submissionsView.innerHTML = '';

    document.getElementById('show-assignment').style.display = 'none';
    document.getElementById('subjects-view').style.display = 'none';
    document.getElementById('one-assignment-view').style.display = 'none';
    document.getElementById('one-subject-view').style.display = 'none';
    document.getElementById('one-submission-view').style.display = 'none';

    fetch('/subjects')
    .then(response => response.json())
    .then(subjects => {
        console.log(subjects);

        const title = createEl('h2', submissionsView);
        title.innerHTML = 'Submissions → Subjects';

        subjects.forEach((subject) => {
            const subjDiv = createEl('div', submissionsView);
            subjDiv.setAttribute('class', 'subj-div');

            const subjTitle = createEl('div', subjDiv);
            subjTitle.innerHTML = subject.title;

            subjDiv.onclick = () => groupView(subject);
        });
    });
}

function groupView(subject) {
    const submissionsView = document.getElementById('submissions-view');
    submissionsView.innerHTML = '';

    const title = createEl('h2', submissionsView);
    title.innerHTML = `Submissions → ${subject.title} → Groups`;
    fetch("subjects/"+ subject.id + "/groups")
    .then(response => response.json())
    .then(groups => {
        console.log(groups);
        groups.forEach((group) => {
            const groupEl = createEl('div', submissionsView);
            groupEl.setAttribute('class', 'group-div');
            groupEl.innerHTML = group.name;
            groupEl.onclick = () => studentsView(subject, group);
        });
    });
}

function studentsView(subject, group) {
    const submissionsView = document.getElementById('submissions-view');
    submissionsView.innerHTML = '';

    const title = createEl('h2', submissionsView);
    title.innerHTML = `Submissions → ${subject.title} → Groups → ${group.name}`;

    fetch(`/students?group=${group.id}`)
    .then(response => response.json())
    .then(students => {
        console.log(students);

        students.forEach((student) => {
            const studentEl = createEl('div', submissionsView);
            studentEl.innerHTML = student.name;
            studentEl.setAttribute('class', 'student-subm-div')
            studentEl.onclick = () => studentSubmissionsView(subject, student);
        });
    });
}

function studentSubmissionsView(subject, student) {
    const submissionsView = document.getElementById('submissions-view');
    submissionsView.innerHTML = '';

    const title = createEl('h2', submissionsView);
    title.innerHTML = `Submissions → ${subject.title} → ${student.name}`;

    createSubmissionTable(submissionsView, student.id, subject.id);
}
