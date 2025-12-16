const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const size = 400;
const grid = 20;
const box = size / grid;

let snake, food, direction, score, highScore;
let running = false;
let lastTime = 0;
let aiMode = false;

/* 🎨 THEMES */
const themes = {
    neon: {
        bg: "#020617",
        grid: "#0f172a",
        head: "#22c55e",
        body: "#16a34a",
        food: "#ef4444"
    },
    retro: {
        bg: "#1f2933",
        grid: "#374151",
        head: "#facc15",
        body: "#fde047",
        food: "#fb7185"
    },
    cyber: {
        bg: "#020617",
        grid: "#164e63",
        head: "#06b6d4",
        body: "#0891b2",
        food: "#a855f7"
    }
};

let theme = themes.neon;

/* INIT */
function initGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = null;
    food = randomFood();
    score = 0;
    draw();
}

function randomFood() {
    return {
        x: Math.floor(Math.random() * grid) * box,
        y: Math.floor(Math.random() * grid) * box
    };
}

/* DRAW */
function drawGrid() {
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = theme.grid;
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

function draw() {
    drawGrid();

    // FOOD
    ctx.fillStyle = theme.food;
    ctx.shadowBlur = 15;
    ctx.shadowColor = theme.food;
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // SNAKE
    snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? theme.head : theme.body;
        ctx.beginPath();
        ctx.roundRect(s.x + 1, s.y + 1, box - 2, box - 2, 6);
        ctx.fill();
    });

    // SCORE
    ctx.fillStyle = "#fff";
    ctx.font = "14px Arial";
    ctx.fillText(`Score: ${score}`, 10, 18);

    moveSnake();
}

/* MOVE */
function moveSnake() {
    if (!direction) return;

    let head = { ...snake[0] };

    if (direction === "LEFT") head.x -= box;
    if (direction === "UP") head.y -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "DOWN") head.y += box;

    // WRAP
    head.x = (head.x + size) % size;
    head.y = (head.y + size) % size;

    if (snake.some(s => s.x === head.x && s.y === head.y)) {
        running = false;
        initGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        food = randomFood();
    } else {
        snake.pop();
    }
}

/* GAME LOOP */
function gameLoop(time) {
    if (time - lastTime > 120) {
        if (aiMode) aiMove();
        draw();
        lastTime = time;
    }
    if (running) requestAnimationFrame(gameLoop);
}

/* CONTROLS */
document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

/* 📱 MOBILE SWIPE */
let touchStartX = 0, touchStartY = 0;

canvas.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", e => {
    let dx = e.changedTouches[0].clientX - touchStartX;
    let dy = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        direction = dx > 0 ? "RIGHT" : "LEFT";
    } else {
        direction = dy > 0 ? "DOWN" : "UP";
    }
});

/* 🤖 AI SNAKE */
function aiMove() {
    let head = snake[0];
    if (food.x > head.x) direction = "RIGHT";
    else if (food.x < head.x) direction = "LEFT";
    else if (food.y > head.y) direction = "DOWN";
    else if (food.y < head.y) direction = "UP";
}

/* UI FUNCTIONS */
function startGame() {
    if (running) return;
    running = true;
    requestAnimationFrame(gameLoop);
}

function stopGame() {
    running = false;
}

function toggleAI() {
    aiMode = !aiMode;
}

function setTheme(name) {
    theme = themes[name];
}

/* START */
initGame();

