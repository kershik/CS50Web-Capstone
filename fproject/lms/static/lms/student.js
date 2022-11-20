function createEl(type, append_to, id) {
    const el = document.createElement(type);
    if (id != undefined) {
        el.setAttribute('id', id);
    }
    append_to.append(el);
    return el;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('subjects').onclick = () => showSubjects();
    document.getElementById('submissions').onclick = () => showSubmissions();
    document.getElementById('notifications').onclick = () => showNotifications();

    showSubjects();
})

function showSubjects() {
    // Show subject view
    const subjsView = document.getElementById('subjects-view');
    subjsView.style.display = 'block';
    document.getElementById('submissions-view').style.display = 'none';
    document.getElementById('one-subject-view').style.display = 'none';
    document.getElementById('notifications-view').style.display = 'none';
    document.getElementById('one-assignment-view').style.display = 'none';

    const heading = createEl('h2', subjsView, 'subj-heading');
    heading.innerHTML = 'Subjects';

    // Create container for subject divs
    const subjContainer = createEl('div', subjsView, 'subj-container');

    loadSubjects(subjContainer);

}

function loadSubjects(container) {
    fetch('/subjects')
    .then(response => response.json())
    .then(subjects => {
        console.log(subjects);

        subjects.forEach((subject) => {
            createSubjDiv(subject, container);
        });
    });
}

function createSubjDiv(subject, container) {
    const subjDiv = createEl('div', container);
    subjDiv.setAttribute('class', 'subj-div');

    const subjTitle = createEl('div', subjDiv);
    subjTitle.innerHTML = subject.title;

    // Add smth else

    subjDiv.onclick = () => loadSubject(subject.id);
}

function loadSubject(subject_id) {
    fetch('/subjects/'+subject_id)
    .then(response => response.json())
    .then(subject => {
        console.log(subject);

        showSubject(subject);
    })
}

function showSubject(subject) {
    const subjView = document.getElementById('one-subject-view');
    subjView.style.display = 'block';
    document.getElementById('submissions-view').style.display = 'none';
    document.getElementById('subjects-view').style.display = 'none';
    document.getElementById('notifications-view').style.display = 'none';
    document.getElementById('one-assignment-view').style.display = 'none';

    
    const subj = createEl('div', subjView, 'subj');
    subj.innerHTML = `<h3>${subject.title}</h3>`;

    // Create container for assignment divs
    const assignContainer = createEl('div', subjView, 'assign-container');


    loadAssingnments(subject.id, assignContainer)
}

function loadAssingnments(subj_id, container) {
    fetch('/subjects/'+subj_id+'/assignments')
    .then(response => response.json())
    .then(assignments => {
        console.log(assignments);

        assignments.forEach((assignment) => {
            createAssignDiv(assignment, container);
        });
    });
}

function createAssignDiv(assignment, container) {
    const assignDiv = createEl('div', container);
    assignDiv.setAttribute('class', 'assign-div');

    const assignTitle = createEl('h3', assignDiv);
    assignTitle.innerHTML = assignment.title; // maybe set class later

    const assignCreator = createEl('h4', assignDiv);
    assignCreator.innerHTML = assignment.creator; // maybe set class later

    const assignDescription = createEl('div', assignDiv);
    assignDescription.innerHTML = assignment.description;

    assignDiv.onclick = () => loadAssignment(assignment.id);
}

function loadAssignment(assign_id) {
    fetch('/assignments/'+assign_id)
    .then(response => response.json())
    .then(assignment => {
        console.log(assignment);

        showAssignment(assignment);
    })
}

function showAssignment(assignment) {
    // Stop here
}

