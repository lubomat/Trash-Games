const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Wymiary gry
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Gracz (pijany gołąb)
const pigeon = {
    x: 100,
    y: canvasHeight / 2,
    width: 40,
    height: 40,
    gravity: 0.025,
    lift: -1.5,
    velocity: 0,
    image: new Image(),
};
pigeon.image.src = "assets/character/crazypigeon.png";

// Przeszkody
const pipes = [];
const pipeWidth = 45;
const pipeGap = 160;
let pipeSpeed = 1;

// Ładowanie obrazu rury
const pipeImage = new Image();
pipeImage.src = "assets/obstacles/rura.png";

// Wynik i status gry
let isGameOver = false;
let isGameStarted = false; // Flaga kontrolująca, czy gra została rozpoczęta
let score = 0;
let frameCounter = 0;
const pipeFrequency = 195;
let awaitingRestart = false;

// Funkcja resetująca grę
function resetGame() {
    pigeon.y = canvasHeight / 2;
    pigeon.velocity = 0;
    pipes.length = 0;
    score = 0;
    frameCounter = 0;
    pipeSpeed = 1;
    isGameOver = false;
    awaitingRestart = false;
    isGameStarted = false; // Gra jeszcze się nie rozpoczęła
    document.getElementById("gameOverMessage").textContent = "Press Up or Space to fly";
    document.getElementById("gameOverMessage").style.display = "block";
}

// Rysowanie gracza
function drawPigeon() {
    ctx.drawImage(pigeon.image, pigeon.x, pigeon.y, pigeon.width, pigeon.height);
}

// Rysowanie przeszkód
function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(pipeImage, pipe.x, 0, pipeWidth, pipe.top);
        ctx.drawImage(pipeImage, pipe.x, pipe.top + pipeGap, pipeWidth, canvasHeight - pipe.top - pipeGap);
    });
}

// Dodawanie przeszkód
function addPipe() {
    const top = Math.random() * (canvasHeight / 2 - 50) + 20;
    pipes.push({ x: canvasWidth, top });
}

// Aktualizacja przeszkód
function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
    });

    if (pipes.length && pipes[0].x + pipeWidth < 0) {
        pipes.shift();
        score++;
    }
}

// Aktualizacja gracza
function updatePigeon() {
    pigeon.velocity += pigeon.gravity;
    pigeon.y += pigeon.velocity;

    if (pigeon.y + pigeon.height > canvasHeight) {
        pigeon.y = canvasHeight - pigeon.height;
        gameOver();
    }
    if (pigeon.y < 0) {
        pigeon.y = 0;
        pigeon.velocity = 0;
    }
}

// Sprawdzanie kolizji
function checkCollisions() {
    pipes.forEach(pipe => {
        if (
            pigeon.x < pipe.x + pipeWidth &&
            pigeon.x + pigeon.width > pipe.x &&
            (pigeon.y < pipe.top || pigeon.y + pigeon.height > pipe.top + pipeGap)
        ) {
            gameOver();
        }
    });
}

// Rysowanie wyniku
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Koniec gry
function gameOver() {
    isGameOver = true;
    document.getElementById("gameOverMessage").textContent = "Crash! Press Up or Space to fly";
    document.getElementById("gameOverMessage").style.display = "block";
    awaitingRestart = true;
}

// Główna pętla gry
function loop() {
    if (isGameOver || !isGameStarted) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // Dodawanie przeszkód co określoną liczbę klatek
    if (frameCounter % pipeFrequency === 0) {
        addPipe();
    }

    updatePigeon();
    updatePipes();
    checkCollisions();

    drawPigeon();
    drawPipes();
    drawScore();

    // Zwiększanie trudności gry z czasem
    if (frameCounter % 1000 === 0) {
        pipeSpeed += 0.2;
    }

    frameCounter++;
    requestAnimationFrame(loop);
}

// Obsługa klawiatury i dotyku
document.addEventListener("keydown", (e) => {
    if ((e.code === "ArrowUp" || e.code === "Space") && awaitingRestart) {
        resetGame();
    } else if (!isGameStarted && (e.code === "ArrowUp" || e.code === "Space")) {
        isGameStarted = true;
        document.getElementById("gameOverMessage").style.display = "none"; // Ukryj napis
        loop();
    } else if (e.code === "ArrowUp" || e.code === "Space") {
        handleJump();
    }
});

canvas.addEventListener("touchstart", () => {
    if (awaitingRestart) {
        resetGame();
    } else if (!isGameStarted) {
        isGameStarted = true;
        document.getElementById("gameOverMessage").style.display = "none";
        loop();
    } else {
        handleJump();
    }
});

// Funkcja obsługująca skok
function handleJump() {
    if (isGameOver || awaitingRestart) return;
    pigeon.velocity = pigeon.lift;
}

// Obsługa przycisków
document.getElementById("backToMenuBtn").addEventListener("click", () => {
    window.location.href = "index.html";
});

// Start gry
resetGame();
