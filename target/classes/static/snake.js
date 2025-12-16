const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let box = 20;
let snake;
let direction;
let food;
let gameInterval = null;
let gameRunning = false;

function initGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = null;
    food = randomFood();
    drawGame();
}

function randomFood() {
    return {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };
}

function startGame() {
    if (gameRunning) return;
    gameRunning = true;
    gameInterval = setInterval(drawGame, 150);
}

function stopGame() {
    gameRunning = false;
    clearInterval(gameInterval);
}

document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// MOBILE TOUCH CONTROLS
function setDirection(dir) {
    if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
    if (dir === "UP" && direction !== "DOWN") direction = "UP";
    if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
    if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
}

function drawGame() {
    ctx.clearRect(0, 0, 400, 400);

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Draw snake
    ctx.fillStyle = "lime";
    snake.forEach(s => ctx.fillRect(s.x, s.y, box, box));

    let head = { ...snake[0] };

    if (direction === null) return;

    // MOVEMENT with EDGE WRAP
    if (direction === "LEFT") head.x -= box;
    if (direction === "UP") head.y -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "DOWN") head.y += box;

    // 🔄 WRAP-AROUND LOGIC (NO GAME OVER)
    if (head.x < 0) head.x = 380;
    if (head.x > 380) head.x = 0;

    if (head.y < 0) head.y = 380;
    if (head.y > 380) head.y = 0;

    // Self collision → Game Over
    if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
        food = randomFood();
    } else {
        snake.pop();
    }
}

function gameOver() {
    stopGame();
    alert("Game Over!");
    initGame();
}

initGame();

