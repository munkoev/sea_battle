import {includeHTML, current_id} from '../includeHTML.js';

const settings = {
    current: {
        field: [  // 0-empty, 1-ship, 2-ship damaged, 3-ship border, 4-selection, 5-miss
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
        ],
        enemy_field_mask: [  // 0-empty, 1-ship, 2-ship damaged, 3-ship border, 4-selection, 5-miss
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            ],
        enemy_field: [  // 0-empty, 1-ship, 2-ship damaged, 3-ship border, 4-selection, 5-miss
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            ],
        cell: [0, 0],
        ship_size: 4,
        ship_dir: 0,  // 0-horizontal, 1-vertical
    },
    ships: {
        ours: {
            x4: 1,
            x3: 2,
            x2: 3,
            x1: 4
        },
        enemy: {
            x4: 1,
            x3: 2,
            x2: 3,
            x1: 4
        }
    },
    sizes: {
        f_width: 10,
        f_width_px: 400,
        f_w_scale: 40,  // f_width_px/f_width
        f_height: 10,
        f_height_px: 400,
        f_h_scale: 40,
        border: 1,
    },
    canvas1: null,
    canvas2: null,
    color: {
        0: 'rgb(220, 220, 220)',
        1: 'rgb(50, 50, 220)',
        2: 'rgb(220, 50, 50)',
        3: 'rgb(240, 240, 240)',
        4: 'rgb(180, 180, 220)',
        5: 'rgb(150, 150, 150)',
    },
    game_started: false,
    pc_turn_delay: 400,
}

window.onload = _ => {
    includeHTML();
    init_canvas();
}

function init_canvas() {
    settings.canvas1 = document.getElementById('canvas1');
    settings.canvas2 = document.getElementById('canvas2');
    draw_field(settings.canvas1, settings.current.field);
    generate_random_field(settings.current.enemy_field);
    draw_field(settings.canvas2, settings.current.enemy_field_mask);
    // draw_field(settings.canvas2, settings.current.enemy_field);
    add_elisteners();
}

function add_elisteners() {
    settings.canvas1.addEventListener("mousemove", highlight_mouse_move , false);
    settings.canvas2.addEventListener("mousemove", highlight_mouse_move_enemy , false);
    settings.canvas1.addEventListener("mousedown", place_ship, false);
    settings.canvas2.addEventListener("mousedown", fire, false);
    settings.canvas1.addEventListener("mouseout", remove_highlight_mouse, false);
    settings.canvas2.addEventListener("mouseout", remove_highlight_mouse, false);
    document.getElementById('play_btn').addEventListener("click", start_game, false);
    document.getElementById('play_random_btn').addEventListener("click", () => {
        generate_random_field(settings.current.field);
        draw_field(settings.canvas1, settings.current.field);
        Object.keys(settings.ships.ours).forEach(e => settings.ships.ours[e] = 0);
        start_game();
    }, false);
    document.getElementById('field_bottom').addEventListener("mousedown", select_ship, false);
}

function start_game() {
    if (Object.values(settings.ships.ours).reduce((a,e) => e + a, 0) === 0) {
        document.getElementById('enemy_stats').classList.remove('invisible');
        document.getElementById('play_btn').classList.add('d-none');
        document.getElementById('play_random_btn').classList.add('d-none');
        document.querySelectorAll('.to_hide').forEach(e => e.classList.add('invisible'));
        document.querySelectorAll('.selected').forEach(e => e.classList.remove('selected'));
        settings.ships.ours.x4 = 1;
        settings.ships.ours.x3 = 2;
        settings.ships.ours.x2 = 3;
        settings.ships.ours.x1 = 4;
        settings.game_started = true;
        update_ships_quantity();
    } else {
        $('.toast').toast('show');
    }
}

function end_game() {
    document.getElementById('enemy_stats').classList.add('invisible');
    document.getElementById('play_btn').classList.remove('invisible');
    document.querySelectorAll('.to_hide').forEach(e => e.classList.remove('invisible'));
    settings.game_started = false;
    settings.current.field.forEach(e => e = [0,0,0,0,0,0,0,0,0,0]);
    settings.current.enemy_field_mask.forEach(e => e = [0,0,0,0,0,0,0,0,0,0]);
    generate_random_field(settings.current.enemy_field);
    draw_field(settings.canvas1, settings.current.field);
    draw_field(settings.canvas2, settings.current.enemy_field_mask);
}

// 0-not finished, 1- we win, 2 - enemy win
function check_end_of_game() {
    if (Object.values(settings.ships.ours).reduce((a,e) => e + a, 0) === 0) return 2;
    if (Object.values(settings.ships.enemy).reduce((a,e) => e + a, 0) === 0) return 1;
    return 0;
}

function draw_field(canvas, field) {
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');
        for (let i = 0; i < settings.sizes.f_width; i++) {
            for (let j = 0; j < settings.sizes.f_height; j++) {
                // 0-empty, 1-ship, 2-ship damaged, 3-ship border, 4-selection, 5-miss
                switch (field[i][j]) {
                    case (0):
                        ctx.fillStyle = settings.color[0];
                        break;
                    case (1):
                        ctx.fillStyle = settings.color[1];
                        break;
                    case (2):
                        ctx.fillStyle = settings.color[2];
                        break;
                    case (3):
                        ctx.fillStyle = settings.color[3];
                        break;
                    case (4):
                        ctx.fillStyle = settings.color[4];
                        break;
                    case (5):
                        ctx.fillStyle = settings.color[5];
                        break;
                }
                ctx.fillRect(j*(settings.sizes.f_w_scale) + settings.sizes.border,
                            i*(settings.sizes.f_h_scale) + settings.sizes.border,
                            (settings.sizes.f_w_scale) - settings.sizes.border * 2,
                            (settings.sizes.f_h_scale) - settings.sizes.border * 2);
            }
        }
    }
}

function draw_text(x, y, canvas, text) {
    if (canvas.getContext) {
        const ctx = canvas.getContext('2d');
        ctx.font = '40px sans serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillText(text, (x + 0.5)*(settings.sizes.f_w_scale), (y + 0.5)*(settings.sizes.f_h_scale) - settings.sizes.border);
    }
}

function highlight_mouse_move(e) {
    if (!settings.game_started) {
        e.stopPropagation();
        let cursor = {
            i: (e.offsetY - e.offsetY%settings.sizes.f_h_scale)/settings.sizes.f_h_scale,
            j: (e.offsetX - e.offsetX%settings.sizes.f_w_scale)/settings.sizes.f_w_scale,
        };
        let tmp = JSON.parse(JSON.stringify(settings.current.field));
        if (tmp !== undefined &&
            cursor.i < settings.sizes.f_height && cursor.j < settings.sizes.f_width) {
            if (settings.current.ship_dir === 1) {
                for (let ii = cursor.i; ii < cursor.i + settings.current.ship_size; ii++) {
                    if (ii < settings.sizes.f_height) tmp[ii][cursor.j] = 4;
                }
            } else {
                for (let ii = cursor.j; ii < cursor.j + settings.current.ship_size; ii++) {
                    if (ii < settings.sizes.f_width) tmp[cursor.i][ii] = 4;
                }
            }
        }
        draw_field(settings.canvas1, tmp);
    }
}

function highlight_mouse_move_enemy(e) {
    e.stopPropagation();
    let cursor = {
        i: (e.offsetY - e.offsetY%settings.sizes.f_h_scale)/settings.sizes.f_h_scale,
        j: (e.offsetX - e.offsetX%settings.sizes.f_w_scale)/settings.sizes.f_w_scale,
    };
    let tmp = JSON.parse(JSON.stringify(settings.current.enemy_field_mask));
    if (tmp !== undefined && cursor.i < settings.sizes.f_height && cursor.j < settings.sizes.f_width) {
        tmp[cursor.i][cursor.j] = 4;
    }
    draw_field(settings.canvas2, tmp);
}

function remove_highlight_mouse(e) {
    if (e.target.id === 'canvas1') {
        draw_field(canvas1, settings.current.field);
    } else {
        draw_field(canvas2, settings.current.enemy_field_mask);
    }
}

function place_ship(e) {
    if (!settings.game_started) {
        settings.current.cell[0] = (e.offsetY - e.offsetY%settings.sizes.f_h_scale)/settings.sizes.f_h_scale;
        settings.current.cell[1] = (e.offsetX - e.offsetX%settings.sizes.f_w_scale)/settings.sizes.f_w_scale;
    
        if (check_ship_placement(settings.current.cell[0], settings.current.cell[1],
            settings.current.field, settings.current.ship_dir, settings.current.ship_size)) {
            let cursor = {
                i: (e.offsetY - e.offsetY%settings.sizes.f_h_scale)/settings.sizes.f_h_scale,
                j: (e.offsetX - e.offsetX%settings.sizes.f_w_scale)/settings.sizes.f_w_scale,
            };
            if (cursor.i < settings.sizes.f_height && cursor.j < settings.sizes.f_width &&
                settings.ships.ours['x' + settings.current.ship_size] > 0) {
                if (settings.current.ship_dir === 1) {
                    for (let ii = cursor.i; ii < cursor.i + settings.current.ship_size; ii++) {
                        settings.current.field[ii][cursor.j] = 1;
                        for (let i_ = ii - 1; i_ <= ii + 1; i_++) {
                            for (let j_ = cursor.j - 1; j_ <= cursor.j + 1; j_++) {
                                if (i_ >= 0 && i_ < settings.sizes.f_height &&
                                    j_ >= 0 && j_ < settings.sizes.f_width) {
                                    if (settings.current.field[i_][j_] !== 1) settings.current.field[i_][j_] = 3;
                                }
                            }
                        }
                    }
                } else {
                    for (let ii = cursor.j; ii < cursor.j + settings.current.ship_size; ii++) {
                        settings.current.field[cursor.i][ii] = 1;
                        for (let i_ = cursor.i - 1; i_ <= cursor.i + 1; i_++) {
                            for (let j_ = ii - 1; j_ <= ii + 1; j_++) {
                                if (i_ >= 0 && i_ < settings.sizes.f_height &&
                                    j_ >= 0 && j_ < settings.sizes.f_width) {
                                    if (settings.current.field[i_][j_] !== 1) settings.current.field[i_][j_] = 3;
                                }
                            }
                        }
                    }
                }
                settings.ships.ours['x' + settings.current.ship_size]--;
                update_ships_quantity();
            }
        } else {
            console.log('Wrong ship placement')
        }
    }
}

function check_ship_placement(x, y, field, dir, size) {
    if (dir === 0) {
        if (y + size <= settings.sizes.f_height) {
            for (let i = y; i < y + size; i++) {
                if (field[x][i] !== 0) return false;
            }
        } else {
            return false
        }
    } else {
        if (x + size <= settings.sizes.f_width) {
            for (let i = x; i < x + size; i++) {
                if (field[i][y] !== 0) return false;
            }
        } else {
            return false
        }
    }
    return true;
}

function update_ships_quantity() {
    document.querySelectorAll('.left_text').forEach(e => {
        e.innerText = `left: ${settings.ships.ours[e.id]}`;
    })
    document.querySelectorAll('.right_text').forEach(e => {
        e.innerText = `left: ${settings.ships.enemy[e.id]}`;
    })
}

// need to refactor this
function select_ship(e) {
    let element = e.target;
    switch (element.id) {
        case ('ship_4_v'):
            document.getElementById('ship_4_h').classList.remove('selected');
            document.getElementById('ship_4_h').classList.add('not_selected');
            document.getElementById('ship_4_v').classList.remove('not_selected');
            document.getElementById('ship_4_v').classList.add('selected');
            document.querySelectorAll(".ship_wrapper").forEach(e => e.classList.remove('selected'));
            document.getElementById('ship_4').classList.add('selected');
            settings.current.ship_size = 4;
            settings.current.ship_dir = 1;
            break;
        case ('ship_4_h'):
            document.getElementById('ship_4_v').classList.remove('selected');
            document.getElementById('ship_4_v').classList.add('not_selected');
            document.getElementById('ship_4_h').classList.remove('not_selected');
            document.getElementById('ship_4_h').classList.add('selected');
            document.querySelectorAll(".ship_wrapper").forEach(e => e.classList.remove('selected'));
            document.getElementById('ship_4').classList.add('selected');
            settings.current.ship_size = 4;
            settings.current.ship_dir = 0;
            break;
        case ('ship_3_v'):
            document.getElementById('ship_3_h').classList.remove('selected');
            document.getElementById('ship_3_h').classList.add('not_selected');
            document.getElementById('ship_3_v').classList.remove('not_selected');
            document.getElementById('ship_3_v').classList.add('selected');
            document.querySelectorAll(".ship_wrapper").forEach(e => e.classList.remove('selected'));
            document.getElementById('ship_3').classList.add('selected');
            settings.current.ship_size = 3;
            settings.current.ship_dir = 1;
            break;
        case ('ship_3_h'):
            document.getElementById('ship_3_v').classList.remove('selected');
            document.getElementById('ship_3_v').classList.add('not_selected');
            document.getElementById('ship_3_h').classList.remove('not_selected');
            document.getElementById('ship_3_h').classList.add('selected');
            document.querySelectorAll(".ship_wrapper").forEach(e => e.classList.remove('selected'));
            document.getElementById('ship_3').classList.add('selected');
            settings.current.ship_size = 3;
            settings.current.ship_dir = 0;
            break;
        case ('ship_2_v'):
            document.getElementById('ship_2_h').classList.remove('selected');
            document.getElementById('ship_2_h').classList.add('not_selected');
            document.getElementById('ship_2_v').classList.remove('not_selected');
            document.getElementById('ship_2_v').classList.add('selected');
            document.querySelectorAll(".ship_wrapper").forEach(e => e.classList.remove('selected'));
            document.getElementById('ship_2').classList.add('selected');
            settings.current.ship_size = 2;
            settings.current.ship_dir = 1;
            break;
        case ('ship_2_h'):
            document.getElementById('ship_2_v').classList.remove('selected');
            document.getElementById('ship_2_v').classList.add('not_selected');
            document.getElementById('ship_2_h').classList.remove('not_selected');
            document.getElementById('ship_2_h').classList.add('selected');
            document.querySelectorAll(".ship_wrapper").forEach(e => e.classList.remove('selected'));
            document.getElementById('ship_2').classList.add('selected');
            settings.current.ship_size = 2;
            settings.current.ship_dir = 0;
            break;
        case ('ship_1_v'):
            document.getElementById('ship_1_h').classList.remove('selected');
            document.getElementById('ship_1_h').classList.add('not_selected');
            document.getElementById('ship_1_v').classList.remove('not_selected');
            document.getElementById('ship_1_v').classList.add('selected');
            document.querySelectorAll(".ship_wrapper").forEach(e => e.classList.remove('selected'));
            document.getElementById('ship_1').classList.add('selected');
            settings.current.ship_size = 1;
            settings.current.ship_dir = 1;
            break;
        case ('ship_1_h'):
            document.getElementById('ship_1_v').classList.remove('selected');
            document.getElementById('ship_1_v').classList.add('not_selected');
            document.getElementById('ship_1_h').classList.remove('not_selected');
            document.getElementById('ship_1_h').classList.add('selected');
            document.querySelectorAll(".ship_wrapper").forEach(e => e.classList.remove('selected'));
            document.getElementById('ship_1').classList.add('selected');
            settings.current.ship_size = 1;
            settings.current.ship_dir = 0;
            break;
    }
}

async function fire(e) {
    if (settings.game_started) {
        let cursor = {
            i: (e.offsetY - e.offsetY%settings.sizes.f_h_scale)/settings.sizes.f_h_scale,
            j: (e.offsetX - e.offsetX%settings.sizes.f_w_scale)/settings.sizes.f_w_scale,
        };
    
        if (cursor.i < settings.sizes.f_height && cursor.j < settings.sizes.f_width) {
            if (settings.current.enemy_field[cursor.i][cursor.j] === 1 ||
                settings.current.enemy_field[cursor.i][cursor.j] === 2) {
                settings.current.enemy_field[cursor.i][cursor.j] = 2;
                settings.current.enemy_field_mask[cursor.i][cursor.j] = 2;
                if (is_killed(cursor.j, cursor.i, settings.current.enemy_field, 0)) {
                    let siz = get_killed_size(cursor.j, cursor.i, settings.current.enemy_field, 0);



                    settings.ships.enemy['x' + siz]--;
                    paint_border(cursor.j, cursor.i, settings.current.enemy_field_mask, 0);
                }
            } else {
                settings.current.enemy_field_mask[cursor.i][cursor.j] = 5;
                let tmp = false;
                while (!tmp) {
                    tmp = enemy_fire(getRandomInt(0, 10), getRandomInt(0, 10));
                }
            }
            if (check_end_of_game() === 1) {
                
                alert('you won');
                location.reload();
                // end_game();
                // return;
            }
            update_ships_quantity();
        }
    }
}

function is_killed(x, y, field, dir=0) {
    if (x >= 0 && x < settings.sizes.f_width &&
        y >= 0 && y < settings.sizes.f_height) {
    if (dir === 0 && field[y][x] !== 2) return false;
    switch (field[y][x]) {
        case (2):

                let res = true;
                if (dir === 1) {
                    res &=
                        is_killed(x, y - 1, field, 4) &&
                        is_killed(x + 1, y, field, 1) &&
                        is_killed(x, y + 1, field, 2)
                } else if (dir === 2) {
                    res &=
                        is_killed(x - 1, y, field, 3) &&
                        is_killed(x + 1, y, field, 1) &&
                        is_killed(x, y + 1, field, 2)
                } else if (dir === 3) {
                    res &=
                        is_killed(x - 1, y, field, 3) &&
                        is_killed(x, y - 1, field, 4) &&
                        is_killed(x, y + 1, field, 2)
                } else if (dir === 4) {
                    res &=
                        is_killed(x - 1, y, field, 3) &&
                        is_killed(x, y - 1, field, 4) &&
                        is_killed(x + 1, y, field, 1)
                } else if (dir === 0) {
                    res &=
                        is_killed(x - 1, y, field, 3) &&
                        is_killed(x, y - 1, field, 4) &&
                        is_killed(x + 1, y, field, 1) &&
                        is_killed(x, y + 1, field, 2)
                }
                return res;

            break;
        case (1):
            return false;
        default:
            return true;
    }
}
    return true
}

function get_killed_size(x, y, field, dir=0) {
    let ret = 0;
    if (x >= 0 && x < settings.sizes.f_width &&
        y >= 0 && y < settings.sizes.f_height) {
    if (dir === 0 && field[y][x] !== 2) return ret;
    switch (field[y][x]) {
        case (2):

                ret = 1;
                if (dir === 1) {
                    ret +=
                        get_killed_size(x, y - 1, field, 4) +
                        get_killed_size(x + 1, y, field, 1) +
                        get_killed_size(x, y + 1, field, 2)
                } else if (dir === 2) {
                    ret +=
                        get_killed_size(x - 1, y, field, 3) +
                        get_killed_size(x + 1, y, field, 1) +
                        get_killed_size(x, y + 1, field, 2)
                } else if (dir === 3) {
                    ret +=
                        get_killed_size(x - 1, y, field, 3) +
                        get_killed_size(x, y - 1, field, 4) +
                        get_killed_size(x, y + 1, field, 2)
                } else if (dir === 4) {
                    ret +=
                        get_killed_size(x - 1, y, field, 3) +
                        get_killed_size(x, y - 1, field, 4) +
                        get_killed_size(x + 1, y, field, 1)
                } else if (dir === 0) {
                    ret +=
                        get_killed_size(x - 1, y, field, 3) +
                        get_killed_size(x, y - 1, field, 4) +
                        get_killed_size(x + 1, y, field, 1) +
                        get_killed_size(x, y + 1, field, 2)
                }
                return ret;

            break;
        case (1):
            return 0;
        default:
            return ret;
    }
}
    return ret
}

function paint_border(x, y, field, dir=0) {
    if (x >= 0 && x < settings.sizes.f_width &&
        y >= 0 && y < settings.sizes.f_height) {
        if (field[y][x] === 2) {
            for (let ii = y - 1; ii <= y + 1; ii++) {
                for (let jj = x - 1; jj <= x + 1; jj++) {
                    // if (field[ii][jj] !== 2 && field[ii][jj] !== 5) field[ii][jj] = 3;
                    if (field[ii] !== undefined && field[ii][jj] !== 2) field[ii][jj] = 3;
                }
            }
            switch (dir) {
                case (0):
                    paint_border(x, y-1, field, 4);
                    paint_border(x-1, y, field, 3);
                    paint_border(x, y+1, field, 2);
                    paint_border(x+1, y, field, 1);
                    break;
                case (1):
                    paint_border(x, y-1, field, 4);
                    paint_border(x, y+1, field, 2);
                    paint_border(x+1, y, field, 1);
                    break;
                case (2):
                    paint_border(x-1, y, field, 3);
                    paint_border(x, y+1, field, 2);
                    paint_border(x+1, y, field, 1);
                    break;
                case (3):
                    paint_border(x, y-1, field, 4);
                    paint_border(x-1, y, field, 3);
                    paint_border(x, y+1, field, 2);
                    break;
                case (4):
                    paint_border(x, y-1, field, 4);
                    paint_border(x-1, y, field, 3);
                    paint_border(x+1, y, field, 1);
                    break;
            }
        }
    }
}

async function enemy_fire(x, y) {
    settings.canvas2.removeEventListener("mousedown", fire);
    let ans = true;
    setTimeout(async () => {
        if (y < settings.sizes.f_height && x < settings.sizes.f_width) {
            // 0-empty, 1-ship, 2-ship damaged, 3-ship border, 4-selection, 5-miss
            switch (settings.current.field[y][x]) {
                case (0):
                    settings.current.field[y][x] = 5;
                    ans = true;
                    break;
                case (1):
                    settings.current.field[y][x] = 2;
                    if (is_killed(x, y, settings.current.field)) {
                        settings.ships.ours['x' + get_killed_size(x, y, settings.current.field)]--;
                    }
                    ans = true;
                    if (check_end_of_game() === 2) {


                        alert('you lost');
                        location.reload();
                        // end_game();
                        // ans = true;
                    }
                    draw_field(settings.canvas1, settings.current.field);
                    draw_text(x, y, settings.canvas1, 'x');
                    return enemy_fire(getRandomInt(0, 10), getRandomInt(0, 10));
                    break;
                case (2):
                    ans = false;
                    break;
                case (3):
                    settings.current.field[y][x] = 5;
                    ans = true;
                    break;
                case (5):
                    ans = false;
                    break;
            }
            draw_field(settings.canvas1, settings.current.field);
            draw_text(x, y, settings.canvas1, 'x');
            // update_ships_quantity();
        }
        settings.canvas2.addEventListener("mousedown", fire);
    }, settings.pc_turn_delay)
    return ans;
}

function generate_random_field(field) {
    for (let i = 0; i < settings.sizes.f_height; i++) {
        for (let j = 0; j < settings.sizes.f_width; j++) {
            field[i][j] = 0;
        }
    }

    for (let [key, value] of Object.entries(settings.ships.enemy)) {
        const tmp = value;
        for (let i = 0; i < value; i++) {
loop2:
            while(1) {
                let b = place_ship_enemy(getRandomInt(0, 10),getRandomInt(0, 10),
                field, getRandomInt(0, 2), Number(key.substring(1)))
                if (b) {
                    break loop2;
                }
            }
        }
        settings.ships.enemy[key] = tmp;
        update_ships_quantity();
    }


}

function place_ship_enemy(x, y, field, dir, size) {
    if (check_ship_placement(y, x, field, dir, size)) {
        if (y < settings.sizes.f_height && x < settings.sizes.f_width &&
            settings.ships.enemy['x' + size] > 0) {
            if (dir === 1) {
                for (let ii = y; ii < y + size; ii++) {
                    field[ii][x] = 1;
                    for (let i_ = ii - 1; i_ <= ii + 1; i_++) {
                        for (let j_ = x - 1; j_ <= x + 1; j_++) {
                            if (i_ >= 0 && i_ < settings.sizes.f_height &&
                                j_ >= 0 && j_ < settings.sizes.f_width) {
                                if (field[i_][j_] !== 1) field[i_][j_] = 3;
                            }
                        }
                    }
                }
            } else {
                for (let ii = x; ii < x + size; ii++) {
                    field[y][ii] = 1;
                    for (let i_ = y - 1; i_ <= y + 1; i_++) {
                        for (let j_ = ii - 1; j_ <= ii + 1; j_++) {
                            if (i_ >= 0 && i_ < settings.sizes.f_height &&
                                j_ >= 0 && j_ < settings.sizes.f_width) {
                                if (field[i_][j_] !== 1) field[i_][j_] = 3;
                            }
                        }
                    }
                }
            }
            settings.ships.enemy['x' + size]--;
            update_ships_quantity();
        }
        return true;
    } else {
        return false;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
