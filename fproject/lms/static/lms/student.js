import {
    showSubjects,
    showSubject,
    createEl,
    loadSubjects, 
    loadAssingnments
} from './functions.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('subjects').onclick = () => showSubjects();
    document.getElementById('submissions').onclick = () => showSubmissions();
    document.getElementById('notifications').onclick = () => showNotifications();

    showSubjects();
})



