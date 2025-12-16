const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;                 // size of each cell
const rows = canvas.height / box;
const cols = canvas.width / box;

let snake;
let food;
let direction;
let score;
let gameInterval;

function init() {
    snake = [{ x: 10 * box, y: 10 * box }];
    food = spawnFood();
    direction = null;
    score = 0;
    updateScore();

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(draw, 120);
}
init();

/* FOOD */
function spawnFood() {
    return {
        x: Math.floor(Math.random() * cols) * box,
        y: Math.floor(Math.random() * rows) * box
    };
}

/* DRAW GRID */
function drawGrid() {
    ctx.strokeStyle = "#ddd";
    for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * box, 0);
        ctx.lineTo(i * box, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * box);
        ctx.lineTo(canvas.width, i * box);
        ctx.stroke();
    }
}

/* MAIN DRAW */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Draw snake
    ctx.fillStyle = "green";
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, box, box);
    });

    if (!direction) return;

    // Move snake
    let head = { ...snake[0] };

    if (direction === "LEFT") head.x -= box;
    if (direction === "UP") head.y -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "DOWN") head.y += box;

    // Wall collision (game over)
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height
    ) {
        gameOver();
        return;
    }

    // Self collision
    if (snake.some(p => p.x === head.x && p.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        food = spawnFood();
    } else {
        snake.pop();
    }
}

/* SCORE */
function updateScore() {
    document.getElementById("score").innerText = `Score: ${score}`;
}

/* GAME OVER */
function gameOver() {
    clearInterval(gameInterval);
    alert("Game Over! Score: " + score);
    init();
}

/* CONTROLS */
document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

