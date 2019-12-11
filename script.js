class wing {
    constructor(type, num) {
        this.x = -1;
        this.y = -1;
        this.i = -1;
        this.j = -1;
        this.del = false;
        this.type = type;
        this.num = num;
    }

    set(x, y, i, j) {
        this.x = x;
        this.y = y;
        this.i = i;
        this.j = j;
        this.del = false;
    }

    delete() {
        this.del = true;
    }

    isDeleted() {
        return this.del;
    }
}

const ceil = document.getElementsByClassName('ceil');
const img = document.getElementsByTagName('img');
const mainBlock = document.getElementsByTagName('main').item(0);
const game = document.getElementById('game');
const mix_button = document.getElementById('mix');
const reset_button = document.getElementById('reset');
let firstClick = false;
let firstWing;
let interval, timout;
let path = [];
const field = [];
let all_wings = [];
for (let i = 0; i < 10; i++) {
    field[i] = [];
}
let shuffled = [];
document.addEventListener("DOMContentLoaded", () => {
    generateWings();
    check();
    mix_button.onclick = () => {
        mix();
    };
    reset_button.onclick = () => {
        reset();
    };
});


function createImage(type) {
    return `<img src="img\\w${type}.png" class="wing${type}">`
}

function generateWings() {
    for (let i = 1; i <= 5; i++) {
        for (let j = 0; j < 20; j++) {
            game.innerHTML += createImage(i);
            all_wings.push(new wing(i, (i - 1) * 20 + j));
        }
    }
    reset();
}

function shuffleArray(array) {
    array.sort(() => Math.random() - 0.5);
}

function mix() {
    shuffled = [];
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (!field[i][j].isDeleted()) {
                shuffled.push(field[i][j]);
            }
        }
    }
    shuffleArray(shuffled);
    let c = 0;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (!field[i][j].isDeleted()) {
                console.log(i + " " + j)
                let x = ceil.item(i * 10 + j).getBoundingClientRect().x - mainBlock.offsetLeft + window.pageXOffset + 5;
                let y = ceil.item(i * 10 + j).getBoundingClientRect().y - mainBlock.offsetTop + window.pageYOffset + 2;
                shuffled[c].set(x, y, i, j);
                field[i][j] = shuffled[c];
                img.item(shuffled[c].num).style.transition = "top " + 0;
                img.item(shuffled[c].num).style.left = x + "px";
                img.item(shuffled[c].num).style.top = y + "px";
                c++;
            }
        }
    }
}

function reset() {
    clearInterval(interval);
    clearTimeout(timout);
    shuffled = all_wings;
    shuffleArray(shuffled);
    let c = 0;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let x = ceil.item(i * 10 + j).getBoundingClientRect().x - mainBlock.offsetLeft + window.pageXOffset + 5;
            let y = ceil.item(i * 10 + j).getBoundingClientRect().y - mainBlock.offsetTop + window.pageYOffset + 2;
            shuffled[c].set(x, y, i, j);
            field[i][j] = shuffled[c];
            img.item(shuffled[c].num).style.left = x + "px";
            img.item(shuffled[c].num).style.top = y + "px";
            img.item(shuffled[c].num).style.width = 35 + "px";
            img.item(shuffled[c].num).style.transitionDuration = 0 + "s";
            c++;
        }
    }
}

function check() {
    for (let i = 0; i < 100; i++) {
        let e = img.item(i);
        let obj = searchElement(img.item(i));
        e.onclick = function () {
            if (!firstClick) {
                firstClick = true;
                firstWing = obj;
                e.style.transform = "scale(-1, 1)";
            } else {
                firstClick = false;
                let pair = isItPair(obj);
                if (pair) {
                    fly(obj);
                } else {
                    img.item(firstWing.num).style.transform = "scale(1, 1)";
                }
            }
        }
    }
}

function searchElement(e) {
    const x = e.offsetLeft;
    const y = e.offsetTop;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (Math.abs(field[i][j].x - x) < 2 && Math.abs(field[i][j].y - y) < 2) {
                return field[i][j];
            }
        }
    }
}

function isItPair(secondWing) {
    if (firstWing.type !== secondWing.type || firstWing === secondWing) {
        return false;
    } else {
        return searchPath(firstWing, secondWing, 0, 0);
    }
}

function searchPath(cur, to, level, napr) {
    console.log(path.length);//////////////////////////////////////////////////////
    level = Number(level);
    if (cur.num === to.num) {
        path.push(cur);
        return true;
    } else if (cur.isDeleted() || napr === 0) {
        let x = cur.i;
        let y = cur.j;
        let f = false;
        if (x + 1 < 10 && napr !== 3) {
            if (napr === 1 || napr === 0) {
                f = searchPath(field[x + 1][y], to, level, 1);
                if (f) return true;
            } else if (level !== 2) {
                f = searchPath(field[x + 1][y], to, level + 1, 1);
                if (f) {
                    path.push(cur);
                    return true;
                }
            }
        }
        if (y + 1 < 10 && napr !== 4) {
            if (napr === 2 || napr === 0) {
                f = searchPath(field[x][y + 1], to, level, 2);
                if (f) return true;
            } else if (level !== 2) {
                f = searchPath(field[x][y + 1], to, level + 1, 2);
                if (f) {
                    path.push(cur);
                    return true;
                }
            }
        }
        if (x - 1 >= 0 && napr !== 1) {
            if (napr === 3 || napr === 0) {
                f = searchPath(field[x - 1][y], to, level, 1);
                if (f) return true;
            } else if (level !== 2) {
                f = searchPath(field[x - 1][y], to, level + 1, 3);
                if (f) {
                    path.push(cur);
                    return true;
                }
            }
        }
        if (y - 1 >= 0 && napr !== 2) {
            if (napr === 4 || napr === 0) {
                f = searchPath(field[x][y - 1], to, level, 4);
                if (f) return true;
            } else if (level !== 2) {
                f = searchPath(field[x][y - 1], to, level + 1, 4);
                if (f) {
                    path.push(cur);
                    return true;
                }
            }
        }
    }
    return false;
}


function fly(secondWing) {
    let cnt = 1;
    del(firstWing);
    del(secondWing);
    img.item(firstWing.num).style.transition = "left " + 1 + "s, top " + 1 + "s";
    img.item(secondWing.num).style.transition = "left " + 1 + "s, top " + 1 + "s";
    path.pop();
    move(path.pop());
    let w = path.pop();
    if (w !== undefined) {
        cnt++;
        setTimeout(() => {
                move(w);
                w = path.pop();
                if (w !== undefined) {
                    cnt++;
                    setTimeout(() => {
                        move(w);
                    }, 1000);
                }
            }, 1000
        );
    }
    flutter(firstWing, secondWing, cnt);
}

function flutter(w1, w2, cnt) {
    timout = setTimeout(() => {
        let cnt = 0;
        interval = setInterval(() => {
            if (cnt % 2 === 0) {
                console.log(img.item(w2.num).style.left);
                console.log(img.item(w2.num).offsetLeft);
                console.log(w2.num.x);
                img.item(w2.num).style.left = img.item(w2.num).offsetLeft + 15 + "px";
                img.item(w1.num).style.width = 20 + "px";
                img.item(w2.num).style.width = 20 + "px";
                cnt++;
            } else {
                img.item(w1.num).style.width = 40 + "px";
                img.item(w2.num).style.width = 40 + "px";
                img.item(w2.num).style.left = img.item(w2.num).offsetLeft - 15 + "px";
                cnt++;
            }
        }, 70);
        img.item(w1.num).style.zIndex = 100;
        img.item(w2.num).style.zIndex = 100;
        img.item(w1.num).style.transition = "top " + 5 + "s";
        img.item(w2.num).style.transition = "top " + 5 + "s";
        img.item(w2.num).style.top = -400 + "px";
        img.item(w1.num).style.top = -400 + "px";

    }, cnt * 1000 + 500);
}

function move(dest) {
    img.item(firstWing.num).style.left = dest.x + img.item(firstWing.num).width + "px";
    img.item(firstWing.num).style.top = dest.y + "px";
}

function del(wing) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (field[i][j].num === wing.num) {
                field[i][j].delete();
            }
        }
    }
}
