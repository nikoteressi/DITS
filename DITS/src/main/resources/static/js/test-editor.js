/**
 * TODO:
 * 
 * - rewrite using classes
 * - add function to send custom request and rewrite all functions
 * that sending requests using new function. Here I mean next functions:
 * -- addThemeForm.addEventListener
 * -- getTestsData
 * -- submitNewTheme
 * -- deleteTheme
 * -- addNewTest
 * -- editTest
 * -- deleteTest
 * -- addNewQuestion
 * 
 * -- getAnswers
 * -- deleteQuestion
 * 
 * 
 */

let prevQuestion = null;
const questionFormQuestion = document.getElementById('questionFormQuestion');
const activateAddTestButton = document.getElementById('activateAddTestButton');
const addTestForm = document.getElementById('addTestForm');
const addAnswerButton = document.getElementById('addAnswerButton');
const createQuestionForm = document.getElementById('createQuestionForm');
const questionFormAnswerField = document.getElementById('questionFormAnswerField');
let isNewQuestion = false;
let currentTestId = null;
let currentQuestionId = null;
let isNewTest = true;
const createNewTestButton = document.getElementById('createNewTestButton');

const questionModalCloseButton = document.getElementById('questionModalCloseButton');

function getQuestionHtml({name, description, testId, questions}) {
    const question = document.createElement('div');
    question.className = 'test';
    question.dataset.id = testId;
    question.dataset.id = testId;
    question.innerHTML = `
    <div class="row">
      <a class="col-md-9 test__text" data-bs-toggle="collapse" href='#test${testId}' role="button" aria-expanded="false" aria-controls="collapseExample">
        ${name}
      </a>
      <button class="col-md-3 test__add-button text-md-end text-start" data-bs-toggle="modal" data-bs-target="#questionModal">new question <img class="pl-1 icon-btn" src="/img/add-icon.svg" alt="Add new question"></button>
      <div class="col-md-3 test__control text-md-end">
        <button class="test__edit-button"><img src="/img/edit-icon.svg" alt="Edit test" class="icon-btn"></button>
        <button class="test__delete-button"><img src="/img/delete-icon.svg" alt="Delete test" class="icon-btn"></button>
      </div>
    </div>
    <div class="collapse question__list mt-3" id=test${testId} data-test-id=${testId}>
      ${
        questions.reduce((accum, {questionId, description}, index) => {
            return accum += (`
            <div class="row question__item mb-2 mt-3" data-id=${questionId}>
              <span class="index-num">${index + 1}.</span>
              <div class="col-10 form-input" type="text">${description}</div>
              <div class="question-control col-2 text-end">
                <button class='question__edit-button' data-bs-toggle="modal" data-bs-target="#questionModal"><img src="/img/edit-icon.svg" alt="Edit test question" class="icon-btn"></button>
                <button class='question__delete-button'><img src="/img/delete-icon.svg" alt="Delete test question" class="icon-btn"></button>
              </div>
            </div>
          `)
        }, '')
    }
    </div>
  `
    return question
}

const token = document.head.querySelector('meta[name="_csrf"]').getAttribute('content');
const detail = document.getElementById('detail');
const detailList = document.getElementById('detailList');
const addThemeForm = document.getElementById('addThemeForm');
const themeSection = document.querySelector('.theme__section');
const addThemeFormInput = document.querySelector('.add-theme-form__input');
// const token = "${_csrf.token}";
let prevEditedTheme = null;
let prevEditedThemeValue = null;
let currentThemeId = null;
let dataByTopicId = null;

function changeActiveAddThemeFormStatus() {
    addThemeForm.classList.toggle('active');
    addThemeForm.previousElementSibling.classList.toggle('active');
}

function addThemeClickHandler(target) {
    if (target.closest('.sidebar-add-theme__button')) {
        changeActiveAddThemeFormStatus();
    }
}

function deactivateAddThemeForm() {
    addThemeForm.reset();
    addThemeForm.classList.remove('active');
}

addThemeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const newThemeValue = addThemeFormInput.value;
    console.log(newThemeValue);
    deactivateAddThemeForm();
    if (newThemeValue.length) {
        const url = new URL("http://localhost:8080/admin/addTopic");
        console.log(newThemeValue);
        const params = {name: newThemeValue};
        url.search = new URLSearchParams(params).toString();
        const response = await fetch(url, {
            method: 'POST', headers: {
                "X-CSRF-TOKEN": token
            }
        });
        const result = await response.json();
        updateThemesList(result);
    }
})

let result = null;

async function getTestsData(themeId) {
    const url = new URL("http://localhost:8080/admin/getTests");
    const params = {id: themeId};
    url.search = new URLSearchParams(params).toString();
    const response = await fetch(url);
    result = await response.json();
    dataByTopicId = result;
    return result;
}

async function setNewThemeTests(data) {
    console.log(data);
    let testsData;
    if (data) {
        testsData = data;
    } else {
        const themeId = currentThemeId;
        testsData = await getTestsData(themeId);
    }
    detail.classList.add('active');
    detailList.innerHTML = '';
    console.log(testsData);
    testsData.forEach(testData => {
        detailList.appendChild(getQuestionHtml(testData))
    })
}

async function submitNewTheme(target) {
    const themeItem = target.closest('.theme__item');
    const themeId = themeItem.dataset.id;
    const {value: name} = themeItem.querySelector('.theme-item__input');
    const url = new URL("http://localhost:8080/admin/editTopic");
    let params = {name, id: themeId};
    url.search = new URLSearchParams(params).toString();
    console.log(token);
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": token
        }
    });
    const result = await response.json();
    updateThemesList(result);
}

async function deleteTheme(target) {
    const themeItem = target.closest('.theme__item');
    const themeId = themeItem.dataset.id;
    const url = new URL("http://localhost:8080/admin/removeTopic");
    let params = {topicId: themeId};
    url.search = new URLSearchParams(params).toString();
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": token
        }
    });
    const result = await response.json();
    updateThemesList(result);
}

function testThemeClickHandler(event) {
    event.preventDefault();
    const {target} = event;
    const themeItem = target.closest('.theme-item');
    if (themeItem) {
        const themeId = themeItem.dataset.id;
        if (target.closest('.theme-item__input')) {
            if (themeId !== currentThemeId) {
                detail.classList.remove('active');
                currentThemeId = themeId;
                const themeName = themeItem.querySelector('.theme-item__input').value;
                setThemeTitle(themeName);
                setNewThemeTests();
            }
        } else if (target.closest('.theme-item__edit')) {
            setThemeEditMode(themeItem);
        } else if (target.closest('.theme-item__submit')) {
            submitNewTheme(target);
        } else if (target.closest('.theme-item__delete')) {
            deleteTheme(target);
        }
    }
}

const detailTitle = document.querySelector('.detail__title');

function setThemeTitle(newName) {
    detailTitle.textContent = newName;
}

const createNewTestForm = document.getElementById('newTestForm');
const newTestFormCloseButton = document.getElementById('newTestFormCloseButton');

async function addNewTest(name, description) {
    newTestFormCloseButton.click();
    const url = new URL("http://localhost:8080/admin/addTest");
    let params = {name, description, topicId: currentThemeId};
    url.search = new URLSearchParams(params).toString();
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": token
        }
    });
    const result = await response.json();
    setNewThemeTests(result);
}

async function editTest(name, description) {
    newTestFormCloseButton.click();
    const url = new URL("http://localhost:8080/admin/editTest");
    let params = {name, description, topicId: currentThemeId, testId: currentTestId};
    url.search = new URLSearchParams(params).toString();
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": token
        }
    });
    const result = await response.json();
    setNewThemeTests(result);
}

async function deleteTest() {
    const url = new URL("http://localhost:8080/admin/removeTest");
    let params = {topicId: currentThemeId, testId: currentTestId};
    url.search = new URLSearchParams(params).toString();
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": token
        }
    });
    const result = await response.json();
    setNewThemeTests(result);
}


createNewTestForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(createNewTestForm);
    const testName = formData.get('testName');
    const testDescription = formData.get('testDescription');
    if (isNewTest) {
        addNewTest(testName, testDescription);
    } else {
        editTest(testName, testDescription);
    }
    createNewTestForm.reset();
});

function setCreateTestFormStartData() {
    if (dataByTopicId != null && dataByTopicId.length !== 0) {
        const {name, description} = dataByTopicId.find(({testId}) => {
            return testId == currentTestId
        });
        createNewTestForm.querySelector('[name=testName]').value = name;
        createNewTestForm.querySelector('[name=testDescription]').value = description;
    }
}

function createTestClickHandler(event) {
    const {target, isTrusted} = event;
    console.log(event)
    const openFormButton = target.closest('#createNewTestButton');
    if (openFormButton) {
        createNewTestForm.reset();
    }
    if (!isTrusted) {
        setCreateTestFormStartData();
        isNewTest = false;
    } else {
        isNewTest = true;
    }
}

document.addEventListener('click', (event) => {
    const {target} = event;
    const targetClassList = target.classList;
    if (target.closest('#testThemes')) {
        testThemeClickHandler(event);
        deactivateAddThemeForm();
    } else if (target.closest('.sidebar-add-theme')) {
        addThemeClickHandler(target);
    } else if (target.closest('.detail__create')) {
        createTestClickHandler(event);
    } else if (target.closest('#detailList')) {
        refreshThemesValues();
        detailClickHandler(target);
        deactivateAddThemeForm();
    }
})

function setThemeEditMode(newTheme) {
    if (prevEditedTheme) {
        prevEditedTheme.classList.remove('edit');
        prevEditedTheme.querySelector('.theme-item__input').setAttribute('readonly', '');
        prevEditedTheme.querySelector('.theme-item__input').value = prevEditedThemeValue;
    }
    prevEditedTheme = newTheme;
    if (newTheme) {
        newTheme.classList.add('edit');
        newTheme.querySelector('.theme-item__input').removeAttribute('readonly');
        newTheme.querySelector('.theme-item__input').focus();
        prevEditedThemeValue = newTheme.querySelector('.theme-item__input').value;
    }
}

function refreshThemesValues() {
    setThemeEditMode(null);
    prevEditedThemeValue = null;
}

async function addNewQuestion() {
    let data = null;
    let url = null;
    const formData = new FormData(createQuestionForm);
    const questionName = formData.get('question');
    const answersData = Array.from(questionFormAnswerField.querySelectorAll('.answer')).map(answer => {
        return {
            correct: answer.querySelector('[name=correct]:checked') ? true : false,
            answer: answer.querySelector('[name=answer]').value,
        }
    });
    if (answersData.filter((el) => el.correct === true).length < 1) {
        alert('You should choose Correct Answer')
        return;
    } else if (answersData.length < 2) {
        alert('answer is less than 2')
        return;
    }

    if (isNewQuestion) {
        url = '/admin/addQuestion'
        data = {
            questionName,
            topicId: currentThemeId,
            testId: currentTestId,
            answersData,
        }
    } else {
        url = '/admin/editQuestionAnswers'
        data = {
            questionName,
            topicId: currentThemeId,
            questionId: currentQuestionId,
            answersData,
        }
    }
    isNewQuestion = false;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": token
        },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    setNewThemeTests(result);
}

/**
 * TODO:
 * - If you want to use string as HTML code that will be parsed
 * it is a good idea to move it in separate function with
 * appropriate name
 * 
 * - Check all document on such mistake
 * 
 *  */

function updateThemesList(data) {
    console.log(data)
    themeSection.innerHTML = '';
    themeSection.innerHTML = `
    ${data.map(({topicName, topicId}) => {
        return `
        <div class="theme__item theme-item d-flex" data-id=${topicId} >
        <input class="theme-item__input" value="${topicName}" readonly="">
        <span class="theme-item__control">
          <button class="theme-item__submit"><img src="/img/submit-icon.svg" alt=""></button>
          <button class="theme-item__edit"><img src="/img/edit-icon.svg" alt=""></button>
          <button class="theme-item__delete"><img src="/img/delete-icon.svg" alt=""></button>
        </span>
      </div>
      `
    }).join('')}
  `
}


createQuestionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    questionModalCloseButton.click();
    addNewQuestion();
})

function refreshQuestionForm() {
    questionFormQuestion.textContent = '';
    questionFormAnswerField.textContent = '';
}

function openQuestionCreateForm() {
    isNewQuestion = true;
    refreshQuestionForm();
}

function getNewAnswerField(data) {
    const nextAnswerNumber = questionFormAnswerField.childNodes.length;
    const answer = document.createElement('div');
    answer.className = 'answer w-100';
    const description = data ? data.description : '';
    const correct = data ? data.correct : false;
    answer.innerHTML = `
        <input class="answer__correct" name="correct" type="checkbox" ${correct ? 'checked' : ''} id="answer_${nextAnswerNumber}">
        <label class="col-12 answer__title py-2"  for="answer_${nextAnswerNumber}">Answer ${nextAnswerNumber + 1}</label>
        <input class="col-11 answer-input" name="answer" type="text" value="${description}" placeholder="write answer"  required>
        <button class="col-1 answer__delete-button" type="button"><img src="/img/delete-icon.svg"></button>
  `;
    return answer;
}


function openQuestionEditForm({questionId, description, answerDTOList}) {
    refreshQuestionForm();
    questionFormQuestion.textContent = description;
    answerDTOList.forEach(itemData => {
        questionFormAnswerField.append((getNewAnswerField(itemData)));
    })
}

async function getAnswers(questionId) {
    const url = new URL("http://localhost:8080/admin/getAnswers");
    const params = {id: questionId};
    url.search = new URLSearchParams(params).toString();
    let response = await fetch(url);
    return await response.json();
}

async function editQuestion() {
    const result = await getAnswers(currentQuestionId);
    openQuestionEditForm(result);
}

function setCurrentTestId(target) {
    const testId = target.closest('.test').dataset.id;
    currentTestId = testId;
}

function setCurrentQuestionId(target) {
    const questionId = target.closest('.question__item').dataset.id;
    currentQuestionId = questionId;
    console.log('Set current questionId', currentQuestionId);
}

function questionClickHandler(target) {
    setCurrentQuestionId(target);
    if (target.closest('.question__edit-button')) {
        editQuestion();
    } else if (target.closest('.question__delete-button')) {
        deleteQuestion();
    }
}

function detailClickHandler(target) {
    console.log()
    if (target.closest('.question__item')) {
        questionClickHandler(target);
    }
}


function createNewQuestion() {
    questionFormAnswerField.append(getNewAnswerField());
}

createQuestionForm.addEventListener('click', ({target}) => {
    if (target.closest('.add-answer-button')) {
        createNewQuestion()
    } else if (target.closest('.answer__delete-button')) {
        target.closest('.answer').remove();
    }
})


function clickTestHandler(target) {
    setCurrentTestId(target);
    if (target.classList.contains('test__text')) {
        target.closest('.test').classList.toggle('open');
    } else if (target.closest('.test__add-button')) {
        openQuestionCreateForm();
        createQuestionForm.reset();
    } else if (target.closest('.test__edit-button')) {
        isNewTest = false;
        createNewTestButton.click();
    } else if (target.closest('.test__delete-button')) {
        deleteTest();
    }
}

async function deleteQuestion() {
    const url = new URL("http://localhost:8080/admin/removeQuestion");
    const params = {questionId: currentQuestionId, topicId: currentThemeId};
    url.search = new URLSearchParams(params).toString();
    let response = await fetch(url, {
        method: 'DELETE',
        headers: {
            "X-CSRF-TOKEN": token
        }
    });
    let result = await response.json();
    await setNewThemeTests(result);
    console.log('delete question')
}

detailList.addEventListener('click', ({target}) => {
    if (target.closest('.test')) {
        clickTestHandler(target);
    }
})

// TODO: change this id name. It is awfull :/
document.getElementById('themeItemIndex0').click();