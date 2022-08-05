import {includeHTML, current_id} from '../includeHTML.js'

const answer_json_example = {
   x4: 10,
   x3: 20,
   x2: 50,
   x1: 111,
   games: 20,
   winrate: 0.80
}

window.onload = () => {
    includeHTML();
    draw_table_stats();
}

/** @param {{x4: number, x3: number, x2: number, x1: number, games: number, winrate: number}} json  */
async function draw_table_stats() {
    var json = answer_json_example;
    
    document.querySelector('main').innerHTML = `
    <h2>Game stats:</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">Ships destroyed</th>
                        <td></td>
                    </tr>
                    <tr>
                        <td>4x cage:</td>
                        <td>${json.x4}</td>
                    </tr>
                    <tr>
                        <td>3x cage:</td>
                        <td>${json.x3}</td>
                    </tr>
                    <tr>
                        <td>2x cage</td>
                        <td>${json.x2}</td>
                    </tr>
                    <tr>
                        <td>1x cage</td>
                        <td>${json.x1}</td>
                    </tr>
                    <tr>
                        <th scope="row">Games played</th>
                        <td>${json.games}</td>
                    </tr>
                    <tr>
                        <th scope="row">Win rate</th>
                        <td>${Math.round(json.winrate * 100) + '%'}</td>
                    </tr>
                </tbody>
            </table>
    `
}
