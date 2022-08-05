import {includeHTML, current_id} from '../includeHTML.js'

const answer_json_example = {
   data: [
       {
           name: 'Mark',
           winrate: 0.8,
           games: 88
       },
       {
           name: 'Jacob',
           winrate: 0.85,
           games: 812
       },
       {
           name: 'Larry',
           winrate: 0.2,
           games: 12
       },
       {
           name: 'yrraL',
           winrate: 0.2,
           games: 1
       }
   ]
}

window.onload = () => {
    includeHTML();
    draw_table_best();
}

async function draw_table_best() {
    let json = answer_json_example.data
    
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
