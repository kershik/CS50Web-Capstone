import {
    showSubjects,
    loadAssignment
} from './functions.js';

document.addEventListener('DOMContentLoaded', () => {
    // think teacher don't need this at all
    document.getElementById('notifications-view').style.display = 'none';

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
    document.getElementById('notifications-view').style.display = 'none';
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

    const questionList = document.getElementById('question-list');
    questionList.innerHTML = '';

    const addQuestionButton = document.getElementById('add-question');
    addQuestionButton.onclick = () => {
        const newQuestion = document.getElementById('question-form-empty').cloneNode(true);
        newQuestion.style.display = 'block';
        newQuestion.setAttribute('class', 'question-form');
        const questionCount = document.getElementsByClassName('question-form').length;
        newQuestion.setAttribute('id', 'question-form-'+questionCount);
        questionList.append(newQuestion);
    }

    const saveButton = document.getElementById('save-assignment');
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
    for (const question of questions) {
        fetch('/create/question', {
            method: 'POST',
            body: JSON.stringify({
                text: question.elements['text'].value,
                answer: question.elements['answer'].value,
                assignment_id: assignment_id
            })
        })
        .then(response => response.json())
        .then(result => {
                console.log(result);
            });
    }
    document.getElementById('create').style.display = 'none';
    loadAssignment(assignment_id);
}



