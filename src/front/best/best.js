import {includeHTML, current_id} from '../includeHTML.js'

window.onload = () => {
//    if (current_id == 0) {
//        window.open(window.location.origin + "/signIn/","_self");
//    }
    includeHTML();
    draw_table_best();
}

async function draw_table_best() {
    const url = window.location.origin + "/api/users";
    const response = await fetch(url);
    var json = await response.json();
    
    const data = JSON.parse(JSON.stringify(json)).sort((a, b) => {
        let n = b.winrate - a.winrate;
        if (n !== 0) return n;
        return b.games - a.games;
    });
    const elem = document.querySelector('main');
    elem.innerHTML = `
    <h2>Best players:</h2>
    <table class="table">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Nickname</th>
            <th scope="col">Winrate</th>
            <th scope="col">Game count</th>
            </tr>
        </thead>
        <tbody id="table_body">
        </tbody>
    </table>
    `
    const table_body = document.getElementById('table_body')
    data.forEach((e,i,arr) => {
        table_body.innerHTML += `
        <tr>
        <th scope="row">${i+1}</th>
        <td>${e.name}</td>
        <td>${Math.round(e.winrate * 100) + '%'}</td>
        <td>${e.games}</td>
        </tr>
        <tr>
        `
    });
}
