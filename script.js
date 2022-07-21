const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const SQUARE_SIZE = 50;

const ROWS = CANVAS_HEIGHT / SQUARE_SIZE;
const COLS = CANVAS_WIDTH / SQUARE_SIZE;

$(document).ready(function() {
    let canvas = document.getElementById('canvas');
    let button = document.getElementById('button');
    let ctx = canvas.getContext("2d");
    canvas.setAttribute("height",CANVAS_HEIGHT);
    canvas.setAttribute("width",CANVAS_WIDTH);

    ctx.lineWidth = 5;

    // fills the cell (i,j) with the given color
    function drawSquare(i, j, color) {
        ctx.fillStyle = color;
        ctx.fillRect(i * SQUARE_SIZE, j*SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    }

    // draws a line starting in the top-left color of cell (i,j) 
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
    $("#button").click(function() {
        /*
        drawSquare(8,8,"#ff0000");
        drawSquare(9,9,"#00ff00");
        drawWall(8,8,"horizontal", color = "#000000" , 3);
        */
       displayMaze(getRandomMaze(["empty", "wall-vert", "wall-horz", "wall-both"]));
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
        console.log(maze);
        return maze;
    }


    console.log(getEmptyMaze());

    function displayMaze(maze) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(let i = 0; i < maze.length; i++) {
            for(let j = 0; j < maze[i].length; j++) {
                switch(maze[i][j]) {
                    case "empty":
                        drawWall(i,j,"horizontal", color="#eeeeee", 3);
                        drawWall(i,j,"vertical", color="#eeeeee", 3);
                        break;
                    case "wall-vert":
                        drawWall(i,j,"horizontal", color="#eeeeee", 3);
                        drawWall(i,j,"vertical");
                        break;
                    case "wall-horz":
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