import {includeHTML, current_id} from '../includeHTML.js'

window.onload = () => {
    includeHTML();
    document.getElementById('signin_form').addEventListener("click", get_json_answer);
}

/** @returns {{login: string, password: string}} */
function get_json_answer() {
    const l = document.getElementById('input_login').value
    const p = document.getElementById('input_password').value
    const answer = {};
    answer.name = l
    answer.password = p
    // document.getElementById('input_login').value = '';
    document.getElementById('input_password').value = '';
    // console.log(answer)
    return answer;
}

async function senddata(data) {
    const url = window.location.origin + "/api/users/auth";
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
      const json = await response.json();
      console.log(json);
    } catch (error) {
        $('.toast').toast(error)
    }
}
