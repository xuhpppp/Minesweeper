let blocks = document.getElementsByClassName('block');

//create 2d array[10][8]
let matrix = new Array(8);
for (let i = 0; i < 8; i++) {
    matrix[i] = new Array(10);
}

let resetBoard = () => {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 10; j++) {
            if (matrix[i][j] != -1) {
                matrix[i][j] = 0;
            }
        }
    }
}

resetBoard();

//random int to place bomb
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let getRandomXY = () => {
    let randomX = getRandomInt(0, 7);
    let randomY = getRandomInt(0, 9);

    return [randomX, randomY];
}

let countBomb = 0;
while (countBomb < 15) {
    let [randomX, randomY] = getRandomXY();

    if (matrix[randomX][randomY] != -1) {
        matrix[randomX][randomY] = -1;

        countBomb++;
    }
}
countBomb = 15;

//gen number for each block
let placeNumber = () => {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 10; j++) {
    
            if (matrix[i][j] != -1) {
                for (let k = i-1; k <= i+1; k++) {
                    for (let l = j-1; l <= j+1; l++) {
    
                        if (k >= 0 && k < 8 && l >= 0 && l < 10) {
                            if (matrix[k][l] == -1) {
                                matrix[i][j]++;
                            }
                        }
    
                    }
                }
            }
    
        }
    }
}

placeNumber();

let renderBoard = () => {
    for (let i = 0; i < 80; i++) {
        let y = i % 10;
        let x = (i - y) / 10;
    
        blocks[i].innerHTML = matrix[x][y];
    }
}

let paintBombRed = () => {
    for (let i = 0; i < 80; i++) {
        let y = i % 10;
        let x = (i - y) / 10;

        blocks[x * 10 + y].style.background = 'white';
    
        if (matrix[x][y] == -1) {
            blocks[x * 10 + y].style.background = 'red';
        } else {
            blocks[x * 10 + y].style.background = 'lightgray';
        }
    }
}

let expand = (x, y) => {
    for (let i = x-1; i <= x+1; i++) {
        for (let j = y-1; j <= y+1; j++) {
            
            if (i >= 0 && i < 8 && j >= 0 && j < 10) {
                if (matrix[i][j] == 0 && blocks[i * 10 + j].style.background != 'lightgray') {
                    blocks[i * 10 + j].style.background = 'lightgray';
                    blocks[i * 10 + j].innerHTML = matrix[i][j];

                    expand(i, j);
                } else if (matrix[i][j] > 0 && blocks[i * 10 + j].style.background != 'lightgray') {
                    blocks[i * 10 + j].style.background = 'lightgray';
                    blocks[i * 10 + j].innerHTML = matrix[i][j];
                }
            }

        }
    }
}

let firstMove = 0;
for (let i = 0; i < 80; i++) {
    let y = i % 10;
    let x = (i - y) / 10;

    //renderBoard();

    blocks[i].addEventListener("click", e => {
        if (blocks[i].innerHTML != '?') {
            if (firstMove == 0) {
                for (let i = x-1; i <= x+1; i++) {
                    for (let j = y-1; j <= y+1; j++) {
                        if (i >= 0 && i < 8 && j >= 0 && j < 10) {
                            if (matrix[i][j] == -1) {
                                isThrownAway = 0;
    
                                while (isThrownAway == 0) {
                                    let [randomX, randomY] = getRandomXY();
    
                                    if ((randomX < x-1 || randomX > x+1) && (randomY < y-1 || randomY > y+1)) {
                                        if (matrix[randomX][randomY] != -1) {
                                            matrix[randomX][randomY] = -1;
                                            matrix[i][j] = 0;
    
                                            isThrownAway = 1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
    
                resetBoard();
                placeNumber();
                //renderBoard();
    
                expand(x, y);
    
                firstMove = 1;
            } else {
                if (matrix[x][y] == 0) {
                    expand(x, y);
                } else if (matrix[x][y] > 0 && blocks[x * 10 + y].style.background != 'lightgray') {
                    blocks[x * 10 + y].style.background = 'lightgray';
                    blocks[x * 10 + y].innerHTML = matrix[x][y];
                } else if (matrix[x][y] > 0 && blocks[x * 10 + y].style.background == 'lightgray') {
                    for (let i = x-1; i <= x+1; i++) {
                        for (let j = y-1; j <= y+1; j++) {
    
                            if (i >= 0 && i < 8 && j >= 0 && j < 10) {
                                if (blocks[i * 10 + j].style.background != 'lightyellow') {
                                    if (matrix[i][j] == 0) {
                                        expand(i, j);
                                    } else if (matrix[i][j] > 0) {
                                        blocks[i * 10 + j].style.background = 'lightgray';
                                        blocks[i * 10 + j].innerHTML = matrix[i][j];
                                    } else {
                                        renderBoard();
                                        paintBombRed();
                                    }
                                }
                            }
                            
                        }
                    }
                } else {
                    renderBoard();
                    paintBombRed();
                }
            }
        }
    });

    blocks[i].addEventListener("contextmenu", e => {
        if (blocks[i].innerHTML == '?') {
            blocks[i].innerHTML = '';
            blocks[i].style.background = 'white';

            countBomb++;
        } else {
            if (blocks[i].innerHTML == '') {
                if (countBomb > 0) {
                    blocks[i].innerHTML = '?';
                    blocks[i].style.background = 'lightyellow';
                }
            }
        }
    });
}

console.log(matrix);