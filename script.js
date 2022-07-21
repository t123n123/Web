const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const SQUARE_SIZE = 50;

const ROWS = CANVAS_HEIGHT / SQUARE_SIZE;
const COLS = CANVAS_WIDTH / SQUARE_SIZE;

$(document).ready(function() {
    let canvas = document.getElementById('canvas');
    let button = document.getElementById('button');
    let score = document.getElementById('score');
    let restart = document.getElementById('restart');
    let restarts = 0;
    let scoreValue = 0;
    let currentMaze = getRandomMaze(["empty", "wall-left", "wall-up", "wall-both"]);
    let ctx = canvas.getContext("2d");
    canvas.setAttribute("height",CANVAS_HEIGHT);
    canvas.setAttribute("width",CANVAS_WIDTH);

    ctx.lineWidth = 5;

    // fills the cell (i,j) with the given color
    function drawSquare(i, j, color) {
        ctx.fillStyle = color;
        ctx.fillRect(i * SQUARE_SIZE, j*SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    }

    // draws a line starting in the top-left color of cell (i,j), direction either "vertical" or "horizontal"
    function drawWall(i, j, direction, color = "#000000", width = 5) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        if(direction === "vertical") {
            ctx.beginPath();
            ctx.moveTo(i*SQUARE_SIZE, j*SQUARE_SIZE);
            ctx.lineTo((i+1)*SQUARE_SIZE, j*SQUARE_SIZE);
            ctx.stroke();
        } else if(direction === "horizontal") {
            ctx.beginPath();
            ctx.moveTo(i*SQUARE_SIZE, j*SQUARE_SIZE);
            ctx.lineTo(i*SQUARE_SIZE, (j+1)*SQUARE_SIZE);
            ctx.stroke();
        }
    }

    let playerX = 0;
    let playerY = 0;

    let targetX = Math.floor(Math.random() * ROWS);
    let targetY = Math.floor(Math.random() * COLS);

    $("#button").click(function() {
        /*
        drawSquare(8,8,"#ff0000");
        drawSquare(9,9,"#00ff00");
        drawWall(8,8,"horizontal", color = "#000000" , 3);
        */
        restarts += 1;
        restart.innerText = "Restars: " + restarts;
        // load maze
        currentMaze = getRandomMaze(["empty", "wall-left", "wall-up", "wall-both"]);
        // display maze
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSquare(playerX, playerY, "#0000ff");
        drawSquare(targetX, targetY, "#00ff00");
        displayMaze(currentMaze);
    });

    document.addEventListener('keyup', (e) => {
        if(e.code === "ArrowUp" && canMove(currentMaze, playerX, playerY).includes("up")) playerY -= 1;
        if(e.code === "ArrowDown" && canMove(currentMaze, playerX, playerY).includes("down")) playerY += 1;
        if(e.code === "ArrowRight" && canMove(currentMaze, playerX, playerY).includes("right")) playerX += 1;
        if(e.code === "ArrowLeft" && canMove(currentMaze, playerX, playerY).includes("left")) playerX -= 1;
        // display maze
        console.log(playerX + " " + playerY);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSquare(playerX, playerY, "#0000ff");
        drawSquare(targetX, targetY, "#00ff00");
        displayMaze(currentMaze);
        if(playerX === targetX && playerY === targetY) {

            console.log(targetX + " " + targetY);
            scoreValue += 1;
            score.innerText = "Score: " + scoreValue;

            // reload maze
            currentMaze = getRandomMaze(["empty", "wall-left", "wall-up", "wall-both"]);

            playerX = 0;
            playerY = 0;

            targetX = Math.floor(Math.random() * ROWS);
            targetY = Math.floor(Math.random() * COLS);
            // display maze again
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawSquare(playerX, playerY, "#0000ff");
            drawSquare(targetX, targetY, "#00ff00");
            displayMaze(currentMaze);
        }
    });

    function getEmptyMaze() { 
        let maze = [];
        for(let i = 0; i <= ROWS; i++){
            maze.push([]);
            for(let j = 0; j <= COLS; j++) {
                maze[i].push("empty");
            }
        }
        return maze;
    }

    function getRandomMaze(options) {
        let maze = getEmptyMaze();
        for(let i = 0; i < maze.length; i++) {
            for(let j = 0; j < maze[i].length; j++) {
                maze[i][j] = options[Math.floor(Math.random() * options.length)];
            }
        }
        //console.log(maze);
        return maze;
    }


    // return possible move directions from cell (i,j)
    function canMove(maze, i, j) {
        let directions = [];
        if(maze?.[i]?.[j] != undefined) {
            switch(maze[i][j]) {
                case "empty":
                    directions.push("up");
                    directions.push("left");
                    break;
                case "wall-left":
                    directions.push("up");
                    break;
                case "wall-up":
                    directions.push("left");
                    break;
                case "wall-both":
                    break;
                default: 
                    break;
            }
        }
        if(maze?.[i]?.[j+1] != undefined) {
            if(!(maze[i][j+1] === "wall-up" || maze[i][j+1] === "wall-both")) {
                directions.push("down");
            }
        }
        if(maze?.[i+1]?.[j] != undefined) {
            if(!(maze[i+1][j] === "wall-left" || maze[i+1][j] === "wall-both")) {
                directions.push("right");
            }
        }
        return directions;
    }


    function displayMaze(maze) {
        for(let i = 0; i < maze.length; i++) {
            for(let j = 0; j < maze[i].length; j++) {
                //console.log(i + " " + j + " " + canMove(maze,i,j));
                switch(maze[i][j]) {
                    case "empty":
                        drawWall(i,j,"horizontal", color="#eeeeee", 3);
                        drawWall(i,j,"vertical", color="#eeeeee", 3);
                        break;
                    case "wall-up":
                        drawWall(i,j,"horizontal", color="#eeeeee", 3);
                        drawWall(i,j,"vertical");
                        break;
                    case "wall-left":
                        drawWall(i,j,"horizontal");
                        drawWall(i,j,"vertical", color="#eeeeee", 3);
                        break;
                    case "wall-both":
                        drawWall(i,j,"horizontal");
                        drawWall(i,j,"vertical");
                        break;
                    default: 
                        break;
                }
            }
        }
    }

});