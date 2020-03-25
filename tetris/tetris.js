const maincanvas = document.getElementById('gamearena');
const maincontext = maincanvas.getContext('2d');

const bullpencanvas = document.getElementById('bullpenarea');
const bullpencontext = bullpencanvas.getContext('2d');

maincontext.scale(30, 30);
bullpencontext.scale(20, 20);

const gamepiece = { position: { x: 0, y: 0 }, matrix: null };
const bullpenpiece = { position: { x: 0, y: 0 }, matrix: null };

const bp = { h: bullpencanvas.height, w: bullpencanvas.width, c: "#ccc" };

const gamearena = canvas(20, 10);
const bullpen = canvas(4, 2);

const colors = [
    null, 
    '0,     255, 255', /* I cyan */
    '0,     0,   255', /* J blue */
    '255,   165,   0', /* L orange */
    '255,   255,   0', /* O yellow */
    '0,     128,   0', /* S green */
    '128,   0,   128', /* T purple */
    '255,   0,     0'  /* Z red */
];

const bg = document.getElementById('bg');
const cube = document.getElementById('cube');
const tetris = document.getElementById('tetris');

var standby = assignPiece();
var cancelId = 0;

var dropCounter = 0;
var dropSpeed = 1000;
var time = 0;

var score = 0;
var level = 1;
var lines = 0;


maincontext.drawImage(bg, 0, 0, 10, 20);
document.addEventListener('keydown', kbcontrols);

function kbcontrols(event)
{
    if (event.keyCode === 32)
    {
        document.removeEventListener('keydown', kbcontrols);
        document.addEventListener('keydown', playercontrols);

        initiateNewGamePiece(standby);
        loadBullpen();
         
        requestAnimationFrame(run);
    }
}

function playercontrols(event)
{
    switch (event.keyCode) 
    {
        case 37: /* left arrow; move left   */ shiftShape(-1); break;
        case 39: /* right arrow; move right */ shiftShape(1); break;
        /* case 38 up arrow dropFast() */
        case 40: /* down arrow; drop piece  */ dropShape(); break;
        case 88: /* x; rotate right         */ rotateShape(1); break;
        case 90: /* z; rotate left          */ rotateShape(-1); break;
    }
}

function assignPiece() 
{
    let pieces = 'TJLOSZI';
    return pieces[pieces.length * Math.random() | 0];
}

function canvas(height, width)
{
    let space = [];

    while (height--)
    {
        space.push(new Array(width).fill(0));
    }

    return space;
}

function clearRow()
{
    let rows = 1;

    loop: for (let y = gamearena.length - 1; y > 0; --y) 
    {
        for (let x = 0; x < gamearena[y].length; ++x)
        {
            if (gamearena[y][x] === 0)
            {
                continue loop;
            }
        }

        let row = gamearena.splice(y, 1)[0].fill(0);
        gamearena.unshift(row);
        ++y;

        updateScore(rows);
    }

    displayScore();
}

function updateScore(rows) /* and level up! */
{
    score += rows * 10;
    lines += 1;
    if (score > 49 * level) 
    {
        level += 1;
        if (dropSpeed > 200)
        {
            dropSpeed -= 200;
        }
    }
    rows *= 2;
}

function collision() 
{
    for (let y = 0; y < gamepiece.matrix.length; ++y) 
    {
        for (let x = 0; x < gamepiece.matrix[y].length; ++x)
        {
            if (gamepiece.matrix[y][x] !== 0 && 
                (gamearena[y + gamepiece.position.y] && 
                gamearena[y + gamepiece.position.y][x + gamepiece.position.x]) !== 0)
            {
                return true;
            }
        }
    }

    return false;
}

function displayScore() 
{
    document.getElementById('score').innerText = score;
    document.getElementById('level').innerText = level;
    document.getElementById('lines').innerText = lines;
}

function dropShape() 
{
    gamepiece.position.y++;

    if (collision()) 
    {
        gamepiece.position.y--;
        fuse();
        initiateNewGamePiece(standby);
        loadBullpen();
        clearRow();
    }

    dropCounter = 0;
}

function fuse()
{
    gamepiece.matrix.forEach((row, y) =>
    {
        row.forEach((column, x) =>
        {
            if (column !== 0)
            {
                gamearena[y + gamepiece.position.y][x + gamepiece.position.x] = column;
            }
        });
    });
}

function gameOver() 
{
    //TODO: show "GAME OVER" plash, reset game

    //TODO: create web service to track high scores

}

function gamePiece(shape) 
{
    switch (shape) 
    {
        case 'I': 
        return [
            [0, 0, 0, 0], 
            [1, 1, 1, 1], 
            [0, 0, 0, 0], 
            [0, 0, 0, 0]
        ]; 

        case 'J': 
        return [
            [2, 0, 0], 
            [2, 2, 2], 
            [0, 0, 0]
        ]; 

        case 'L': 
        return [
            [0, 0, 3], 
            [3, 3, 3], 
            [0, 0, 0]
        ]; 

        case 'O': 
        return [
            [4, 4], 
            [4, 4]
        ]; 

        case 'S': 
        return [
            [0, 5, 5], 
            [5, 5, 0], 
            [0, 0, 0]
        ]; 

        case 'T': 
        return [
            [0, 6, 0], 
            [6, 6, 6], 
            [0, 0, 0]
        ];

        case 'Z': 
        return [
            [7, 7, 0], 
            [0, 7, 7], 
            [0, 0, 0]
        ]; 
    }
}

function initiateNewGamePiece(n) 
{
    gamepiece.matrix = gamePiece(n);
    gamepiece.position.x = (gamearena[0].length / 2 | 0) - (gamepiece.matrix[0].length / 2 | 0);
    gamepiece.position.y = 0;

    if (collision())
    {
        gameOver();
    }
}

function loadBullpen() 
{
    standby = assignPiece();

    bullpencontext.clearRect(0, 0, bp.w, bp.h);
    bullpencontext.fillStyle = "rgba(255, 255, 255, 0)";
    bullpencontext.fillRect(0, 0, bp.w, bp.h);

    bullpenpiece.matrix = gamePiece(standby);

    renderElement(bullpen, { x: 0, y: 1 }, bullpencontext);
    renderElement(bullpenpiece.matrix, { x: 0, y: 0 }, bullpencontext);
}

function drawCanvases()
{
    maincontext.clearRect(0, 0, maincanvas.width, maincanvas.height);
    maincontext.drawImage(bg, 0, 0, 10, 20);

    renderElement(gamearena, { x: 0, y: 0 }, maincontext);
    renderElement(gamepiece.matrix, gamepiece.position, maincontext);
}

function renderElement(element, offset, context) 
{
    element.forEach((row, ypos) =>
    {
        row.forEach((color, xpos) =>
        {
            if (color !== 0) 
            {
                context.drawImage(cube, xpos + offset.x, ypos + offset.y, 1, 1);
                context.fillStyle = "rgba(" + colors[color] + ", 0.6)";
                context.fillRect(xpos + offset.x, ypos + offset.y, 1, 1);
            }
        });
    });
}

function rotate(shape, direction) 
{
    for (let y = 0; y < shape.length; ++y)
    {
        for (let x = 0; x < y; ++x)
        {
            [shape[x][y], shape[y][x]] = [shape[y][x], shape[x][y]];
        }
    }

    if (direction > 0)
    {
        shape.forEach((row) =>
        { 
            row.reverse(); 
        });
    }
    else
    {
        shape.reverse();
    }
}

function rotateShape(direction) 
{
    let offset = 1;

    rotate(gamepiece.matrix, direction);

    while (collision()) 
    {
        gamepiece.position += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));

        if (offset > gamepiece.matrix[0].length) 
        {
            rotate(gamepiece.matrix, -direction);
            gamepiece.position.x = gamepiece.position;
            return;
        }
    }
}

function run(t = 0) 
{
    const newTime = t - time;

    dropCounter += newTime;

    if (dropCounter > dropSpeed)
    {
        dropShape();
    }

    time = t;

    drawCanvases();
    cancelId = requestAnimationFrame(run);
}

function shiftShape(offset) 
{
    gamepiece.position.x += offset;

    if (collision())
    {
        gamepiece.position.x -= offset;
    }
}
