let blocks = document.getElementsByClassName('block');

//create 2d array[10][8]
let matrix = new Array(8);
for (let i = 0; i < 8; i++) {
    matrix[i] = new Array(10);
}
for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 10; j++) {
        matrix[i][j] = 0;
    }
}

//random int to place bomb
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let countBomb = 0;
while (countBomb < 10) {
    let randomX = getRandomInt(0, 7);
    let randomY = getRandomInt(0, 9);

    if (randomX != 0 && randomY != 0) {
        matrix[randomX][randomY] = -1;

        countBomb++;
    }
}

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
        }
    }
}

let firstMove = 0;
for (let i = 0; i < 80; i++) {
    let y = i % 10;
    let x = (i - y) / 10;

    renderBoard();
    paintBombRed();

    blocks[i].addEventListener("click", e => {
        if (firstMove == 0 && matrix[x][y] == -1) {
            matrix[0][0] = -1;
            matrix[x][y] = 0;

            //reset board
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 10; j++) {
                    if (matrix[i][j] != -1) {
                        matrix[i][j] = 0;
                    }
                }
            }

            placeNumber();
            renderBoard();
            paintBombRed();
        }
    });
}

console.log(matrix);