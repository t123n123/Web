const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const SQUARE_SIZE = 50;

const ROWS = CANVAS_HEIGHT / SQUARE_SIZE;
const COLS = CANVAS_WIDTH / SQUARE_SIZE;

class Wall{
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
    }

    displayWall(canvas_context, color = "#000000", width = 5) {
        canvas_context.strokeStyle = color;
        canvas_context.lineWidth = width;
        if(this.direction === 'h') {
            canvas_context.beginPath();
            canvas_context.moveTo(this.y * SQUARE_SIZE, this.x * SQUARE_SIZE);
            canvas_context.lineTo((this.y + 1) * SQUARE_SIZE,this.x * SQUARE_SIZE);
            canvas_context.stroke();
        } else if (this.direction === 'v') {
            canvas_context.beginPath();
            canvas_context.moveTo(this.y * SQUARE_SIZE, this.x * SQUARE_SIZE);
            canvas_context.lineTo(this.y * SQUARE_SIZE, (this.x + 1) * SQUARE_SIZE);
            canvas_context.stroke();
        }
    }
}

function generateWalls(probability){
    let walls = [];
    // horizontal
    for(let y = 0; y < COLS; y++) {
        walls.push(new Wall(0, y, 'h'));
        walls.push(new Wall(ROWS, y, 'h'));
    }
    // vertical
    for(let x = 0; x < ROWS; x++) {
        walls.push(new Wall(x, 0, 'v'));
        walls.push(new Wall(x, COLS, 'v'));
    }

    // random internal walls horizontal
    for(let x = 1; x < ROWS; x++) {
        for(let y = 0; y < COLS; y++) {
            if(Math.random() >= probability ? true : false) {
                walls.push(new Wall(x, y, 'h'));
            }
        }
    }

    // random internal walls vertical  
    for(let x = 0; x < ROWS; x++) {
        for(let y = 1; y < COLS; y++) {
            if(Math.random() >= probability ? true : false) {
                walls.push(new Wall(x, y, 'v'));
            }
        }
    }

    return walls;
}

class Cell{
    constructor(x, y, content = '', walls = []) {
        this.x = x;
        this.y = y;
        this.content = content;
        this.walls = walls;
    }

    displayCell(canvas_context) {
        let color;
        if(this.content === 'player') color = "#0000ff";
        else if(this.content === 'target') color = "#00ff00";
        else color = "#ffffff";
        canvas_context.fillStyle = color;
        canvas_context.fillRect(this.y * SQUARE_SIZE, this.x * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
        this.walls.forEach(e => e.displayWall(canvas_context));
    }
}

class Maze{
    constructor(walls = generateWalls(0.5), cells = []) {
        this.cells = [];
        for(let x = 0; x < ROWS; x++) {
            this.cells.push([]);
            for(let y = 0; y < COLS; y++) {
                this.cells[x].push(new Cell(x, y, [], []));
            }
        }

        for(let i = 0; i < cells.length; i++) {
            let x = cells[i].x , y = cells[i].y;
            this.cells[x][y].content = cells[i].content;
        }

        for(let i = 0; i < walls.length; i++) {
            console.log(walls[i]);
            if(walls[i].direction === 'h') {
                let x, y;    
                x = walls[i].x;
                y = walls[i].y;
                console.log( x + " " + y + " " + (x - 1) + " " + y);
                if(x >= 0 && x < ROWS && y >= 0 && y < COLS) {
                    this.cells[x][y].walls.push(walls[i]);
                }
                x = walls[i].x - 1;
                y = walls[i].y;
                if(x >= 0 && x < ROWS && y >= 0 && y < COLS) {
                    this.cells[x][y].walls.push(walls[i]);
                }
            } else {
                let x, y;    
                x = walls[i].x;
                y = walls[i].y;
                console.log( x + " " + y + " " + x + " " + (y - 1));
                if(x >= 0 && x < ROWS && y >= 0 && y < COLS) {
                    this.cells[x][y].walls.push(walls[i]);
                }
                x = walls[i].x;
                y = walls[i].y - 1;
                if(x >= 0 && x < ROWS && y >= 0 && y < COLS) {
                    this.cells[x][y].walls.push(walls[i]);
                }
            }
        }
        console.log(this);
    }

    displayMaze(canvas_context) {
        canvas_context.clearRect(0, 0, canvas.width, canvas.height);
        for(let x = 0; x < ROWS; x++) {
            for(let y = 0; y < COLS; y++) {
                this.cells[x][y].displayCell(canvas_context);
            }
        }
    }

    setCellContent(x, y, content) {
        this.cells[x][y].content = content;
    }

    possibleMoves(x, y) {
        if(x < 0 || y < 0 || x > ROWS || y > COLS) {
            return [];
        }
        let result = [];
        // check up 
        if(!(this.cells[x][y].walls.some(e => e.x === x && e.y === y && e.direction === 'h'))) {
            result.push('up');
        }
        // check down
        if(!(this.cells[x][y].walls.some(e => e.x === x+1 && e.y === y && e.direction === 'h'))) {
            result.push('down');
        }
        // check left
        if(!(this.cells[x][y].walls.some(e => e.x === x && e.y === y && e.direction === 'v'))) {
            result.push('left');
        }
        // check right
        if(!(this.cells[x][y].walls.some(e => e.x === x && e.y === y+1 && e.direction === 'v'))) {
            result.push('right');
        }
        return result;
    }
}


$(document).ready(function() {
    let canvas = document.getElementById('canvas');
    let score = document.getElementById('score_points');
    let restart = document.getElementById('restart_points');
    let body = document.getElementById('body');
    body.height = 1000;
    let restarts = 0;
    let scoreValue = 10;
    let ctx = canvas.getContext("2d");
    canvas.setAttribute("height",CANVAS_HEIGHT);
    canvas.setAttribute("width",CANVAS_WIDTH);

    let wall_probability = 0.5;
    let currentWalls = generateWalls(wall_probability);
    let currentMaze = new Maze(currentWalls);

    ctx.lineWidth = 5;

    let playerX = 0;
    let playerY = 0;

    let targetX = Math.floor(Math.random() * ROWS);
    let targetY = Math.floor(Math.random() * COLS);

    // initialize maze
    currentMaze = new Maze();

    // set player and target position
    currentMaze.cells[playerX][playerY].content = 'player';
    currentMaze.cells[targetX][targetY].content = 'target';

    // display maze
    currentMaze.displayMaze(ctx);

    $("#restart_button").click(function() {
        console.log("clicked");
        if(scoreValue < 3) {
            return;
        }
        scoreValue -= 3;
        score.innerText = "Score: " + scoreValue;
        
        // reload maze
        currentWalls = generateWalls(wall_probability);
        currentMaze = new Maze(currentWalls, [new Cell(playerX, playerY, 'player'), new Cell(targetX, targetY, 'target')]);
        // display maze
        currentMaze.displayMaze(ctx);
    });

    $("#reduce_button").click(function() {
        console.log("click");
        if(scoreValue < 10) {
            return; 
        }
        scoreValue -= 10;
        score.innerText = "Score: " + scoreValue;
        wall_probability += 0.1;
    });


    $("#rotate_button").click(function() {
        if(scoreValue < 2) {
            return;
        } 
        scoreValue -= 2;
        score.innerText = "Score: " + scoreValue;
        console.log("rotated");
        let new_walls = [];
        for(let i = 0; i < currentWalls.length; i++) {
            let new_wall = currentWalls[i];
            if(new_wall.direction === 'h') {
                new_wall.direction = 'v';
                let old_x = new_wall.x;
                let old_y = new_wall.y;
                new_wall.y = COLS - old_x;
                new_wall.x = old_y;
                new_walls.push(new_wall);
            } else {
                new_wall.direction = 'h';
                let old_x = new_wall.x;
                let old_y = new_wall.y;
                new_wall.y = COLS - old_x - 1;
                new_wall.x = old_y;
                new_walls.push(new_wall);
            }
        }
        update();
    });


    // mobile inputs 
    var hammertime = new Hammer(body);
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    hammertime.on('swipeleft swiperight swipeup swipedown', function(ev) {
        if(ev.type === "swipeup" && currentMaze.possibleMoves(playerX, playerY).includes("up")) playerX -= 1;
        if(ev.type === "swipedown" && currentMaze.possibleMoves(playerX, playerY).includes("down")) playerX += 1;
        if(ev.type === "swiperight" && currentMaze.possibleMoves(playerX, playerY).includes("right")) playerY += 1;
        if(ev.type === "swipeleft" && currentMaze.possibleMoves(playerX, playerY).includes("left")) playerY -= 1;
        update();
    });


    function update() {

        console.log(playerX + " " + playerY);
        console.log(currentMaze.possibleMoves(playerX, playerY));

        // display maze
        currentMaze = new Maze(currentWalls, [new Cell(playerX, playerY, 'player'), new Cell(targetX, targetY, 'target')]);
        currentMaze.displayMaze(ctx);
        if(playerX === targetX && playerY === targetY) {
            console.log(targetX + " " + targetY);
            scoreValue += 5;
            score.innerText = "Score: " + scoreValue;

            if(scoreValue > 99) {
                alert("Congratulations!");
            }
            // reload maze
            playerX = 0;
            playerY = 0;
            targetX = Math.floor(Math.random() * ROWS);
            targetY = Math.floor(Math.random() * COLS);

            currentWalls = generateWalls(wall_probability);
            currentMaze = new Maze(currentWalls, [new Cell(playerX, playerY, 'player'), new Cell(targetX, targetY, 'target')]);

            currentMaze.displayMaze(ctx);
        }
    }

    document.addEventListener('keyup', (e) => {
        if(e.code === "ArrowUp" && currentMaze.possibleMoves(playerX, playerY).includes("up")) playerX -= 1;
        if(e.code === "ArrowDown" && currentMaze.possibleMoves(playerX, playerY).includes("down")) playerX += 1;
        if(e.code === "ArrowRight" && currentMaze.possibleMoves(playerX, playerY).includes("right")) playerY += 1;
        if(e.code === "ArrowLeft" && currentMaze.possibleMoves(playerX, playerY).includes("left")) playerY -= 1;
        
        update();
    });
});