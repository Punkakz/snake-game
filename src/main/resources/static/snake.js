const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const SIZE = 420;
const GRID = 21;
const CELL = SIZE / GRID;

let snake, food, dir;

/* INIT */
function init() {
    snake = [{ x: 10, y: 10 }];
    food = spawnFood();
    dir = null;
}
init();

/* FOOD */
function spawnFood() {
    return {
        x: Math.floor(Math.random() * GRID),
        y: Math.floor(Math.random() * GRID),
        pulse: 0
    };
}

/* FAKE 3D PROJECTION */
function project(x, y) {
    const depth = 1 - y * 0.02;
    return {
        x: x * CELL + (CELL * (1 - depth)) / 2,
        y: y * CELL * depth,
        size: CELL * depth
    };
}

/* DRAW BOARD */
function drawBoard() {
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, SIZE, SIZE);
}

/* DRAW FOOD */
function drawFood() {
    food.pulse += 0.1;
    const p = project(food.x, food.y);

    ctx.shadowBlur = 25;
    ctx.shadowColor = "#ff3344";
    ctx.fillStyle = "#ff3344";

    ctx.beginPath();
    ctx.arc(
        p.x + p.size / 2,
        p.y + p.size / 2,
        p.size / 3 + Math.sin(food.pulse) * 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;
}

/* DRAW SNAKE (3D STYLE) */
function drawSnake() {
    snake.forEach((s, i) => {
        const p = project(s.x, s.y);

        const grad = ctx.createLinearGradient(
            p.x, p.y,
            p.x, p.y + p.size
        );
        grad.addColorStop(0, "#66ffcc");
        grad.addColorStop(1, "#0f5132");

        ctx.fillStyle = grad;
        ctx.shadowBlur = i === 0 ? 20 : 8;
        ctx.shadowColor = "#22ffaa";

        ctx.beginPath();
        ctx.roundRect(
            p.x,
            p.y,
            p.size,
            p.size,
            p.size / 2
        );
        ctx.fill();

        // Eyes on head
        if (i === 0) {
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.arc(p.x + p.size * 0.65, p.y + p.size * 0.35, 2, 0, Math.PI * 2);
            ctx.arc(p.x + p.size * 0.65, p.y + p.size * 0.65, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

/* MOVE */
function update() {
    if (!dir) return;

    let head = { ...snake[0] };

    if (dir === "L") head.x--;
    if (dir === "R") head.x++;
    if (dir === "U") head.y--;
    if (dir === "D") head.y++;

    head.x = (head.x + GRID) % GRID;
    head.y = (head.y + GRID) % GRID;

    if (snake.some(s => s.x === head.x && s.y === head.y)) {
        alert("Game Over");
        init();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = spawnFood();
    } else {
        snake.pop();
    }
}

/* LOOP */
function loop() {
    drawBoard();
    drawFood();
    drawSnake();
    update();
    requestAnimationFrame(loop);
}
loop();

/* CONTROLS */
document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft" && dir !== "R") dir = "L";
    if (e.key === "ArrowRight" && dir !== "L") dir = "R";
    if (e.key === "ArrowUp" && dir !== "D") dir = "U";
    if (e.key === "ArrowDown" && dir !== "U") dir = "D";
});

