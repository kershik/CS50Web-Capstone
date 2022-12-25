import {
    createEl,
    showSubjects,
    createSubmissionTable
} from './functions.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('subjects').onclick = () => showSubjects();
    document.getElementById('submissions').onclick = () => showSubmissions();

    showSubjects();
})

function showSubmissions() {
    const submissionsView = document.getElementById('submissions-view');
    submissionsView.style.display = 'block';
    submissionsView.innerHTML = '';

    document.getElementById('show-assignment').style.display = 'none';
    document.getElementById('subjects-view').style.display = 'none';
    document.getElementById('one-assignment-view').style.display = 'none';
    document.getElementById('one-subject-view').style.display = 'none';
    document.getElementById('one-submission-view').style.display = 'none';

    createSubmissionTable(submissionsView);
}



