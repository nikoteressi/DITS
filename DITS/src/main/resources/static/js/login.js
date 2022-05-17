/**
 * TODO:
 * - remove all global variables
 * - left only one eventListener on 'password-control'
 * - remove passwordControlClickHandler()
 */

const passwordInput = document.getElementById('password-input');
const passwordControl = document.getElementById('password-control');


function passwordControlClickHandler(event) {
    const target = event.target;
    const isContainOpenClass = target.classList.contains('open');
    target.classList.toggle('open');
    if (isContainOpenClass) {
        passwordInput.setAttribute('type', 'password');
    } else {
        passwordInput.setAttribute('type', 'text');
    }
}

passwordControl.addEventListener('click', passwordControlClickHandler);


