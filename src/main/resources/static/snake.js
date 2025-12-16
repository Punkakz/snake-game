const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const size = 400;
const grid = 20;
const box = size / grid;

let snake, food, direction;
let score = 0;
let highScore = localStorage.getItem("snakeHigh") || 0;

document.getElementById("high").innerText = `High: ${highScore}`;

function init() {
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = null;
    food = spawnFood();
    score = 0;
    updateScore();
}
init();

/* ---------- DRAW BACKGROUND ---------- */
function drawGrid() {
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    for (let i = 0; i <= grid; i++) {
        ctx.beginPath();
        ctx.moveTo(i * box, 0);
        ctx.lineTo(i * box, size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * box);
        ctx.lineTo(size, i * box);
        ctx.stroke();
    }
}

/* ---------- FOOD ---------- */
function spawnFood() {
    return {
        x: Math.floor(Math.random() * grid) * box,
        y: Math.floor(Math.random() * grid) * box,
        pulse: 0
    };
}

function drawFood() {
    food.pulse += 0.08;
    const r = 6 + Math.sin(food.pulse) * 2;

    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ef4444";
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

/* ---------- SNAKE ---------- */
function drawSnake() {
    snake.forEach((s, i) => {
        const grad = ctx.createLinearGradient(s.x, s.y, s.x + box, s.y + box);
        grad.addColorStop(0, i === 0 ? "#22c55e" : "#16a34a");
        grad.addColorStop(1, "#4ade80");

        ctx.fillStyle = grad;
        ctx.shadowBlur = i === 0 ? 20 : 0;
        ctx.shadowColor = "#22c55e";

        ctx.beginPath();
        ctx.roundRect(s.x + 1, s.y + 1, box - 2, box - 2, 8);
        ctx.fill();

        // Eyes on head
        if (i === 0) {
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.arc(s.x + box * 0.65, s.y + box * 0.35, 2, 0, Math.PI * 2);
            ctx.arc(s.x + box * 0.65, s.y + box * 0.65, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

/* ---------- GAME LOGIC ---------- */
function move() {
    if (!direction) return;

    let head = { ...snake[0] };

    if (direction === "LEFT") head.x -= box;
    if (direction === "UP") head.y -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "DOWN") head.y += box;

    head.x = (head.x + size) % size;
    head.y = (head.y + size) % size;

    if (snake.some(s => s.x === head.x && s.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        food = spawnFood();
        updateScore();
    } else {
        snake.pop();
    }
}

function updateScore() {
    document.getElementById("score").innerText = `Score: ${score}`;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("snakeHigh", highScore);
        document.getElementById("high").innerText = `High: ${highScore}`;
    }
}

/* ---------- LOOP ---------- */
let last = 0;
function loop(t) {
    if (t - last > 120) {
        drawGrid();
        drawFood();
        drawSnake();
        move();
        last = t;
    }
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* ---------- CONTROLS ---------- */
document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

function gameOver() {
    alert(`Game Over! Score: ${score}`);
    init();
}

