const token = document.head.querySelector('meta[name="_csrf"]').getAttribute('content');
const createNewUserForm = document.getElementById('newUserForm');
const editUserForm = document.getElementById('editUserForm');
const newUserFormButton = document.getElementById('newUserFormCloseButton');
const editUserFormButton = document.getElementById('editUserFormCloseButton');
const detailList = document.getElementById('detailList');
const deleteConfirmationModal = document.getElementById('confirmDeleteModal');
const processModal = document.getElementById('processModal');
const processModalContent = document.getElementById('processModalContent');
const htmlOriginal = processModalContent.innerHTML;
let usersData = null;
let currentUserId = null;


window.onLoad = fillUsers();

detailList.addEventListener('click', ({target}) => {
    if (target.closest('.user-info')) {
        clickUserHandler(target);
    }
});

deleteConfirmationModal.addEventListener('click', ({target}) => {
    if (target.closest('.confirmation-modal')) {
        userDeleteClickHandler(target);
    }
})

createNewUserForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(createNewUserForm);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const role = formData.get('role');
    const login = formData.get('login');
    const password = formData.get('password');
    addNewUser(firstName, lastName, role, login, password);
    createNewUserForm.reset();
});

editUserForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(editUserForm);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const role = formData.get('role');
    const login = formData.get('login');
    const password = formData.get('password');
    editUser(currentUserId, firstName, lastName, role, login, password);
    createNewUserForm.reset();
});


function setCurrentUserId(target) {
    currentUserId = target.closest('.user-info').dataset.id;
}

function clickUserHandler(target) {
    setCurrentUserId(target);
    if (target.classList.contains('users-list-item')) {
        target.closest('.user-info').classList.toggle('open');
    } else if (target.closest('.user__edit-button')) {
        fillEditUserForm(currentUserId);
    }
}

function userDeleteClickHandler(target) {
    if (target.closest('.confirm-button')) {
        deleteUser(currentUserId).then(r => console.log('user with id:' + currentUserId + ' was deleted'));
    } else {

    }
}

function getUserInfoHtml({userId, firstName, lastName, role, login, password}) {
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info mb-5';
    userInfo.dataset.id = userId;
    userInfo.innerHTML = `
    <div class="row">
      <a class="col-md-9 d-flex users-list-item" data-bs-toggle="collapse" href='#user${userId}' role="button" aria-expanded="false" aria-controls="collapseExample">
        <p class="user-info__name">${firstName} ${lastName}</p>
        <p class="user-info__email">${login}</p>
      </a>
      <div class="col-md-3 test__control text-md-end">
        <button class="user__edit-button" id="editUserFormButton" data-bs-target="#editUserModal" data-bs-toggle="modal"><img src="/img/edit-icon.svg" alt="Edit user" class="icon-btn"></button>
        <button class="user__delete-button"><img src="/img/delete-icon.svg" data-bs-target="#confirmDeleteModal" data-bs-toggle="modal" alt="Delete user" class="icon-btn"></button>
      </div>
    </div>
    <div class="collapse user-detail-info mt-3" id=user${userId} data-user-id=${userId}>
            <div class="row user-detail-item mb-2 mt-3" data-id=${userId}>
              <div class="user-param">
                <span>Name</span><input class="form-input mb-1 w-50" type="text" value="${firstName}" disabled="disabled"/>
              </div>
              <div class="user-param">
                 <span>Surname</span><input class="form-input mb-1 w-50" type="text" value="${lastName}" disabled="disabled"/>
              </div>
              <div class="user-param">
                <span>Role</span><input class="form-input mb-1 w-50" type="text" value="${role}" disabled="disabled"/>
              </div>
              <div class="user-param">
                <span>Login</span><input class="form-input mb-1 w-50" type="text" value="${login}" disabled="disabled"/>
              </div>
              <div class="user-param">
                <span>Password</span><input class="form-input mb-1 w-50" type="text" value="${password}" disabled="disabled"/>
              </div>
            </div>
    </div>
  `
    return userInfo
}

function getUserInfoEditFormHtml(userId, firstName, lastName, role, login, password) {
    document.getElementById('firstName').value = firstName;
    document.getElementById('lastName').value = lastName;
    document.getElementById('role').value = role;
    document.getElementById('login').value = login;
    document.getElementById('password').value = password;
}

function showProcessModal() {
    processModal.classList.add('show');
    processModal.style.display = 'block';
}

function showSuccessModal() {
    processModalContent.innerHTML = `
        <div id="processModalContent">
                <div class="confirmation-modal-title mb-5">SUCCESS</div>
                <div class="row">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                      <circle class="path circle" fill="none" stroke="#73AF55" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                      <polyline class="path check" fill="none" stroke="#73AF55" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
                    </svg>
                    <p class="confirmation-modal-additional">It is all set</p>
                </div>
            </div>
  `;
    closeProcessModal();
}

function showErrorModal() {
    processModalContent.innerHTML = `
        <div id="processModalContent">
                <div class="confirmation-modal-title mb-5">ERROR</div>
                <div class="row">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                      <circle class="path circle" fill="none" stroke="#d0181c" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                      <line class="path line" fill="none" stroke="#d0181c" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
                      <line class="path line" fill="none" stroke="#d0181c" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
                    </svg>
                    <p class="confirmation-modal-additional">Something went wrong</p>
                </div>
            </div>
  `;
    closeProcessModal();
}

function closeProcessModal() {
    setTimeout(function () {
        processModal.classList.remove('show');
        processModal.style.display = 'none'
        processModalContent.innerHTML = htmlOriginal;
    }, 1500);
}

async function updateUsers(usersList) {
    console.log(usersList);
    detailList.classList.add('active');
    detailList.innerHTML = '';
    Array.from(await usersList).forEach(data => {
        detailList.appendChild(getUserInfoHtml(data))
    });
}

async function fillUsers() {
    usersData = getUsersData();
    console.log(usersData);
    detailList.classList.add('active');
    detailList.innerHTML = '';
    Array.from(await usersData).forEach(data => {
        detailList.appendChild(getUserInfoHtml(data))
    });
}

async function getUsersData() {
    const url = new URL("http://localhost:8080/admin/get-users");
    const response = await fetch(url);
    usersData = await response.json();
    return usersData;
}

async function fillEditUserForm(currentUserId) {
    let userInfo = usersData.find(({userId}) => {
        return currentUserId == userId;
    });
    console.log('Gotten user for edit/ ' + JSON.stringify(userInfo));
    getUserInfoEditFormHtml(currentUserId, userInfo.firstName, userInfo.lastName, userInfo.role, userInfo.login, userInfo.password);
}

async function addNewUser(firstName, lastName, role, login, password) {
    showProcessModal();
    newUserFormButton.click();
    const url = new URL("http://localhost:8080/admin/add-user");
    let userInfo = {firstName, lastName, role, login, password};
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": token
        },
        body: JSON.stringify(userInfo)
    });
    usersData = await response.json();
    if (response.status === 200) {
        showSuccessModal();
        console.log('Created new user with following info:');
        console.log(JSON.stringify(userInfo));
        await updateUsers(usersData);
    } else if (response.status === 400) {
        showErrorModal();
        console.log('New user with following info:');
        console.log(JSON.stringify(userInfo));
        console.log('NOT CREATED. problem on the user side.');
    } else if (response.status === 500) {
        showErrorModal();
        console.log('New user with following info:');
        console.log(JSON.stringify(userInfo));
        console.log('NOT CREATED. problem on the server side.');
    }
}

async function editUser(userId, firstName, lastName, role, login, password) {
    showProcessModal();
    editUserFormButton.click();
    const url = new URL("http://localhost:8080/admin/edit-user");
    let userInfo = {userId, firstName, lastName, role, login, password};
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": token
        },
        body: JSON.stringify(userInfo)
    });
    usersData = await response.json();
    if (response.status === 200) {
        showSuccessModal();
        console.log('User id:' + userId + ' updated');
        console.log('new user data:');
        console.log(JSON.stringify(userInfo));
        await updateUsers(usersData);
    } else if (response.status === 400) {
        showErrorModal();
        console.log('User id:' + userId + ' not updated');
        console.log('NOT DELETED. problem on the user side.');
    } else if (response.status === 500) {
        showErrorModal();
        console.log('User id:' + userId + ' not updated');
        console.log('NOT DELETED. problem on the server side.');
    }
    // await updateUsers(result);
}

async function deleteUser(userId) {
    showProcessModal();
    const url = new URL("http://localhost:8080/admin/remove-user");
    let params = {userId};
    url.search = new URLSearchParams(params).toString();
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": token
        }
    });
    usersData = await response.json();
    if (response.status === 200) {
        showSuccessModal();
        console.log('Deleted user with id:' + userId);
        await updateUsers(usersData);
    } else if (response.status === 400) {
        showErrorModal();
        console.log('User with id:' + userId);
        console.log('NOT DELETED. problem on the user side.');
    } else if (response.status === 500) {
        showErrorModal();
        console.log('User with id:' + userId);
        console.log('NOT DELETED. problem on the server side.');
    }
    console.log(usersData);
    // updateUsers(usersData);
}
