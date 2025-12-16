const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
const size = canvas.width / box;

let snake, food, bonusFood, dir;
let score = 0;
let eatCount = 0;
let interval = null;
let running = false;

const foods = ["🐭","🕷️","🐜"];

/* INIT */
function reset() {
    snake = [{ x: 10, y: 10 }];
    dir = null;
    score = 0;
    eatCount = 0;
    bonusFood = null;
    updateScore();
}

/* FOOD */
function spawnFood() {
    return {
        x: Math.floor(Math.random() * size),
        y: Math.floor(Math.random() * size),
        icon: foods[Math.floor(Math.random() * foods.length)]
    };
}

/* BONUS FOOD */
function spawnBonus() {
    bonusFood = {
        x: Math.floor(Math.random() * size),
        y: Math.floor(Math.random() * size),
        time: Date.now()
    };
    setTimeout(() => bonusFood = null, 4000);
}

food = spawnFood();
reset();

/* DRAW */
function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Food
    ctx.font = "18px Arial";
    ctx.fillText(food.icon, food.x*box+2, food.y*box+18);

    // Bonus
    if (bonusFood) {
        ctx.fillText("🍎", bonusFood.x*box+2, bonusFood.y*box+18);
    }

    // Snake
    ctx.fillStyle = "green";
    snake.forEach((s,i) => {
        ctx.beginPath();
        ctx.roundRect(s.x*box, s.y*box, box, box, 8);
        ctx.fill();
    });

    if (!dir) return;

    let head = { ...snake[0] };
    if (dir==="L") head.x--;
    if (dir==="R") head.x++;
    if (dir==="U") head.y--;
    if (dir==="D") head.y++;

    // WRAP AROUND
    head.x = (head.x + size) % size;
    head.y = (head.y + size) % size;

    // SELF BITE
    if (snake.some(s => s.x===head.x && s.y===head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Eat food
    if (head.x===food.x && head.y===food.y) {
        score += 10;
        eatCount++;
        food = spawnFood();
        if (eatCount % 10 === 0) spawnBonus();
    }
    // Eat bonus
    else if (bonusFood && head.x===bonusFood.x && head.y===bonusFood.y) {
        score += 50;
        bonusFood = null;
    }
    else {
        snake.pop();
    }

    updateScore();
}

/* LOOP */
function startGame() {
    document.getElementById("gameOver").style.display="none";
    reset();
    running = true;
    clearInterval(interval);
    interval = setInterval(draw, 120);
    document.getElementById("status").innerText="Running";
}

function pauseGame() {
    if (!running) return;
    clearInterval(interval);
    running = false;
    document.getElementById("status").innerText="Paused";
}

function gameOver() {
    clearInterval(interval);
    running=false;
    document.getElementById("finalScore").innerText=`Score: ${score}`;
    document.getElementById("gameOver").style.display="flex";
}

/* SCORE */
function updateScore() {
    document.getElementById("score").innerText=`Score: ${score}`;
}

/* KEYBOARD */
document.addEventListener("keydown", e=>{
    if (e.key==="ArrowLeft" && dir!=="R") dir="L";
    if (e.key==="ArrowRight" && dir!=="L") dir="R";
    if (e.key==="ArrowUp" && dir!=="D") dir="U";
    if (e.key==="ArrowDown" && dir!=="U") dir="D";
});

/* TOUCH */
let touchStartX=0, touchStartY=0;
canvas.addEventListener("touchstart", e=>{
    touchStartX=e.touches[0].clientX;
    touchStartY=e.touches[0].clientY;
});
canvas.addEventListener("touchend", e=>{
    let dx=e.changedTouches[0].clientX-touchStartX;
    let dy=e.changedTouches[0].clientY-touchStartY;
    if (Math.abs(dx)>Math.abs(dy)) dir=dx>0?"R":"L";
    else dir=dy>0?"D":"U";
});
