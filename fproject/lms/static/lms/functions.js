function createEl(type, append_to, id) {
    const el = document.createElement(type);
    if (id != undefined) {
        el.setAttribute('id', id);
    }
    append_to.append(el);
    return el;
}

function showSubjects() {
    // Show subject view
    const subjsView = document.getElementById('subjects-view');
    subjsView.style.display = 'block';
    subjsView.innerHTML = '';
    document.getElementById('submissions-view').style.display = 'none';
    document.getElementById('one-submission-view').style.display = 'none';
    document.getElementById('one-subject-view').style.display = 'none';
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
    subjView.innerHTML = '';
    document.getElementById('subjects-view').style.display = 'none';
    document.getElementById('submissions-view').style.display = 'none';
    document.getElementById('one-assignment-view').style.display = 'none';
    document.getElementById('one-submission-view').style.display = 'none';

    
    const subj = createEl('div', subjView, 'subj');
    subj.innerHTML = `<h3>${subject.title}</h3>`;


    // Create container for assignment divs
    const assignContainer = createEl('div', subjView, 'assign-container');

    loadAssingnments(subject.id, assignContainer);

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

    const assignTitle = createEl('div', assignDiv);
    assignTitle.setAttribute('class', 'assignment-title');
    assignTitle.innerHTML = assignment.title; 

    const assignCreator = createEl('div', assignDiv);
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
    const assignmentView = document.getElementById('one-assignment-view');
    assignmentView.style.display = 'block';
    const showAssignDiv = document.getElementById('show-assignment');
    showAssignDiv.style.display = 'block';
    showAssignDiv.innerHTML = '';
    document.getElementById('questions-container').style.display = 'none';
    document.getElementById('subjects-view').style.display = 'none';
    document.getElementById('submissions-view').style.display = 'none';
    document.getElementById('one-subject-view').style.display = 'none';
    document.getElementById('one-submission-view').style.display = 'none';


    const title = createEl('h3', showAssignDiv, 'one-assignment-title');
    title.innerHTML = assignment.title;
    const creator = createEl('div', showAssignDiv, 'one-assignment-creator');
    creator.innerHTML = `<strong>Creator</strong>: ${assignment.creator}`;
    const deadline = createEl('div', showAssignDiv, 'one-assignment-deadline');
    deadline.innerHTML = `<strong>Deadline</strong>: ${assignment.deadline}`;
    const description = createEl('div', showAssignDiv, 'one-assignment-description');
    description.innerHTML = assignment.description;

    if (document.getElementById('create')) {
        showQuestionsTeacher(assignment.questions);
    } else {
        const buttonStartAssignment = 
        createEl('button', showAssignDiv, 'button-start-assignment');
        buttonStartAssignment.innerHTML = 'Start Assignment';
        buttonStartAssignment.onclick = function() {
            showQuestionsStudent(assignment);
        };
    }
}

function showQuestionsTeacher(questions) {
    document.getElementById('create').style.display = 'none';
    const qContainer = document.getElementById('questions-container');
    qContainer.style.display = 'block';
    for (const question of questions) {
        const questionDiv = createEl('div', qContainer);
        questionDiv.setAttribute('class', 'question-div');

        const questionText = createEl('div', questionDiv);
        questionText.setAttribute('class', 'question-text');
        questionText.innerHTML = `Question: ${question.text}`;

        const questionAnswer = createEl('div', questionDiv);
        questionAnswer.setAttribute('class', 'question-answer');
        questionAnswer.innerHTML = `Answer: ${question.answer}`;
    }
}

function showQuestionsStudent(assignment) {
    const showAssignmentDiv = document.getElementById('show-assignment');
    showAssignmentDiv.innerHTML = '';
    const assignmentTitle = createEl('h3', showAssignmentDiv);
    assignmentTitle.innerHTML = assignment.title;

    const progressBar = createEl('div', showAssignmentDiv, 'progress-bar');

    const qContainer = document.getElementById('questions-container');
    qContainer.style.display = 'block';

    fetch('/create/submission', {
        method: 'POST',
        body: JSON.stringify({
            assignment_id: assignment.id
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        showQuestion(assignment.questions, 0, qContainer, result.id);
    })
}

// very stupid realization
function showQuestion(questions, i, container, submission_id) {

    container.innerHTML = '';
    const qLength = questions.length;
    const progressBar = document.getElementById('progress-bar');
    progressBar.innerHTML = `Question ${i+1} out of ${qLength}`;

    const questionDiv = createEl('div', container);
    questionDiv.setAttribute('class', 'question-div');

    const questionText = createEl('div', questionDiv);
    questionText.setAttribute('class', 'question-text');
    questionText.innerHTML = `<strong>Question</strong>: ${questions[i].text}`;

    const answerForm = createEl('form', questionDiv, 'answer-form');
    const answerStudent = createEl('input', answerForm);
    answerStudent.setAttribute('type', 'text');
    answerStudent.setAttribute('class', 'answer-input');

    const nextButton = createEl('button', container, 'next-button');
    nextButton.disabled = true;
    if (i===qLength-1) {
        nextButton.innerHTML = 'Finish';
    } else {
        nextButton.innerHTML = 'Next';
    }

    answerStudent.addEventListener('keyup', () => {
        nextButton.disabled = false;
    })

    nextButton.onclick = () => {
        fetch('/create/answer',  {
            method: 'POST',
            body: JSON.stringify({
                text: answerStudent.value,
                question_id: questions[i].id,
                submission_id: submission_id
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            i++;
            if (i===qLength) {
                loadSubmission(submission_id);
            } else {
                showQuestion(questions, i, container, submission_id);
            }
        })
    }
}

function loadSubmission(submission_id) {
    fetch('/submissions/'+submission_id)
    .then(response => response.json())
    .then(submission => {
        console.log(submission);

        showSubmission(submission);
    })
}

function showSubmission(submission) {
    const submissionView = document.getElementById('one-submission-view');
    submissionView.style.display = 'block';
    submissionView.innerHTML = '';
    document.getElementById('subjects-view').style.display = 'none';
    document.getElementById('submissions-view').style.display = 'none';
    document.getElementById('one-subject-view').style.display = 'none';
    document.getElementById('one-assignment-view').style.display = 'none';

    const submissionTitle = createEl('h3', submissionView, 'submission-title');
    submissionTitle.innerHTML = `Submission: ${submission.assignment.title}`;    

    const submissionStudent = createEl('div', submissionView, 'submission-student');
    submissionStudent.innerHTML = `Student: ${submission.student}`;

    const submissionScore = createEl('div', submissionView, 'submission-score');
    submissionScore.innerHTML = `Score: ${submission.score}%`;

    for (let i = 0; i < submission.answers.length; i++) {
        const question = submission.assignment.questions[i];
        const answer = submission.answers[i];

        const questionDiv = createEl('div', submissionView);
        if (question.answer === answer.text) {
            questionDiv.setAttribute('class', 'question-div-right');
        } else {
            questionDiv.setAttribute('class', 'question-div-wrong');
        }

        const questionText = createEl('div', questionDiv);
        questionText.setAttribute('class', 'question-text');
        questionText.innerHTML = `<strong>Question</strong>: ${question.text}`;

        const questionAnswer = createEl('div', questionDiv);
        questionAnswer.setAttribute('class', 'question-answer');
        questionAnswer.innerHTML = `<strong>Your Answer</strong>: ${answer.text}`;
    }

}

function createSubmissionTable(container, student_id, subject_id) {
    const table = createEl('table', container, 'submissions-table');
    const thead = createEl('thead', table, 'table-head');
    const tbody = createEl('tbody', table, 'table-body');

    const rowHead = createEl('tr', thead);

    for (const el of ['Assignment', 'Subject', 'Score']) {
        const heading = createEl('th', rowHead);
        heading.innerHTML = el;
    }

    let url = '/submissions';
    if (student_id && subject_id) {
        url += `?student=${student_id}&subject=${subject_id}`;
    }
    fetch(url)
    .then(response => response.json())
    .then(submissions => {
        console.log(submissions);

        submissions.forEach(submission => {
            const row = createEl('tr', tbody);
            const assignment = submission.assignment.title;
            const subject = submission.assignment.subject;
            const score = submission.score === -1 ? 'Not scored' : submission.score;
            for (const el of [assignment, subject, score]) {
                const rowData = createEl('td', row);
                rowData.innerHTML = el;
            }
        });
    });
}

export {
    showSubjects,
    showSubject,
    createEl,
    loadSubjects, 
    loadAssingnments,
    loadAssignment,
    createSubmissionTable
};