import {includeHTML, current_id} from '../includeHTML.js'

window.onload = () => {
    includeHTML();
}

function is_input_valid(username, password, repeat) {
    const username_regex = /^[a-zA-Z0-9_]+$/;
    // 2-30 characters, can consist of letters, numbers, special chars
    const password_regex = /^[A-Za-z\d#$@!%&*?]{2,30}$/;
    return username_regex.test(username) && password_regex.test(password) && password === repeat;
}
