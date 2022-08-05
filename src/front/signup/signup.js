import {includeHTML, current_id} from '../includeHTML.js'

window.onload = () => {
    includeHTML();
    document.getElementById('signup_btn').addEventListener("click", get_json_answer);
}

/** @returns {{login: string, password: string} | undefined} */
async function get_json_answer() {

    const l = document.getElementById('input_login').value
    const p = document.getElementById('input_password').value
    const r = document.getElementById('input_password_repeat').value
    if (is_input_valid(l, p, r)) {
        const answer = {};
        answer.name = l;
        answer.password = p;
        // document.getElementById('input_login').value = '';
        document.getElementById('input_password').value = '';
        document.getElementById('input_password_repeat').value = '';
        // console.log(answer)
        answer.winrate = 0.0;
        answer.games = 0;
        answer.x1 = 0;
        answer.x2 = 0;
        answer.x3 = 0;
        answer.x4 = 0;
        senddata(answer);
        window.open(window.location.origin + "/signIn/","_self");
        return answer;
    } else {
        $('.toast').toast('show');
        document.getElementById('input_password').value = '';
        document.getElementById('input_password_repeat').value = '';
        return undefined;
    }
}

function is_input_valid(username, password, repeat) {
    const username_regex = /^[a-zA-Z0-9_]+$/;
    // 2-30 characters, can consist of letters, numbers, special chars
    const password_regex = /^[A-Za-z\d#$@!%&*?]{2,30}$/;
    return username_regex.test(username) && password_regex.test(password) && password === repeat;
}

async function senddata(data) {
    const url = window.location.origin + "/api/users";
    console.log(url);
    console.log(data);
    try {
      const response = await fetch(url, {
        method: 'POST', // или 'PUT'
        body: JSON.stringify(data), // данные могут быть 'строкой' или {объектом}!
        headers: {
          'Content-Type': 'application/json'
        }
      });
      await response.json();
    } catch (error) {
        $('.toast').toast(error)
    }
}
