const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Wymiary gry
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Marian
const marian = {
    x: 50,
    y: 235,
    width: 40,
    height: 40,
    velocityY: 0,
    gravity: 0.1,
    jumpPower: 6,
    maxJumps: 2,
    jumpCount: 0,
    isJumping: false,
};

// Przeszkody
const obstacles = [];
const obstacleWidth = 40;
const obstacleHeight = 40;
let obstacleSpeed = 0.7;
let obstacleSpawnRate = 300;

// Tło
let backgroundX = 0;
let backgroundSpeed = 0.8;

// Wynik i status gry
let isGameOver = false;
let isGameStarted = false; // Nowa zmienna kontrolująca stan gry
let score = 0;
let distance = 0;
let gameSpeedTimer = 0;

// Obrazki przeszkód
const marianImage = new Image();
marianImage.src = "assets/character/Marianprzezroczysty.png";

const obstacleImage = new Image();
obstacleImage.src = "assets/obstacles/kupa.png";

const badObstacleImage = new Image();
badObstacleImage.src = "assets/obstacles/zlakupa.png";

const obstacleImage2 = new Image();
obstacleImage2.src = "assets/obstacles/kupa2.png";

// Funkcja resetująca grę
function resetGame() {
    marian.x = 50;
    marian.y = 220;
    marian.velocityY = 0;
    marian.jumpCount = 0;
    isGameOver = false;
    isGameStarted = false; // Reset stanu gry
    score = 0;
    distance = 0;
    obstacles.length = 0;
    obstacleSpeed = 1;
    obstacleSpawnRate = 300;
    backgroundSpeed = 0.8;
    gameSpeedTimer = 0;
    backgroundX = 0;
    document.getElementById("restartBtn").style.display = "none";
    showStartMessage(); // Wyświetlenie napisu startowego
}

function showStartMessage() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Use Up arrow to jump. Double click = double jump", canvasWidth / 2, canvasHeight / 2);
}

// Rysowanie Marian
function drawMarian() {
    ctx.drawImage(marianImage, marian.x, marian.y, marian.width, marian.height);
}

// Rysowanie przeszkód
function drawObstacles() {
    obstacles.forEach((obstacle) => {
        let image;
        if (obstacle.type === "bad") {
            image = badObstacleImage;
        } else if (obstacle.type === "dangerous") {
            image = obstacleImage2;
        } else {
            image = obstacleImage;
        }
        ctx.drawImage(image, obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
    });
}

// Aktualizacja przeszkód
function updateObstacles() {
    if (gameSpeedTimer % obstacleSpawnRate === 0) {
        let obstacleType = "normal";

        if (distance >= 2000) {
            obstacleType = "dangerous";
        } else if (distance >= 1000) {
            obstacleType = "bad";
        }

        obstacles.push({
            x: canvasWidth,
            y: 235,
            type: obstacleType,
        });
    }

    obstacles.forEach((obstacle, index) => {
        obstacle.x -= obstacleSpeed;

        if (obstacle.x + obstacleWidth < 0) {
            obstacles.splice(index, 1);
            score++;
        }

        if (
            marian.x + 8 < obstacle.x + obstacleWidth - 8 &&
            marian.x + marian.width - 8 > obstacle.x + 8 &&
            marian.y + 5 < obstacle.y + obstacleHeight - 5 &&
            marian.y + marian.height - 5 > obstacle.y + 5
        ) {
            endGame();
        }
    });
}

// Rysowanie tła i licznika metrów
function drawBackgroundAndUI() {
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText(`Distance: ${distance} m`, 10, 20);

    backgroundX -= backgroundSpeed;
}

// Ruch Marian
function updateMarian() {
    marian.velocityY += marian.gravity;
    marian.y += marian.velocityY;

    if (marian.y + marian.height > 275) {
        marian.y = 275 - marian.height;
        marian.velocityY = 0;
        marian.jumpCount = 0;
    }
}

// Koniec gry
function endGame() {
    isGameOver = true;
    document.getElementById("restartBtn").style.display = "inline-block";
}

// Główna pętla gry
function loop() {
    if (isGameOver || !isGameStarted) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    drawBackgroundAndUI();
    updateMarian();
    drawMarian();

    updateObstacles();
    drawObstacles();

    distance = Math.floor(gameSpeedTimer / 10);

    if (gameSpeedTimer % 600 === 0) {
        obstacleSpeed += 0.3;
        backgroundSpeed += 0.1;
        obstacleSpawnRate = Math.max(60, obstacleSpawnRate - 5);
    }

    gameSpeedTimer++;
    requestAnimationFrame(loop);
}

// Obsługa klawiatury
document.addEventListener("keydown", (e) => {
    if (!isGameStarted) {
        isGameStarted = true; // Rozpoczęcie gry po naciśnięciu klawisza
        loop();
        return;
    }

    if ((e.code === "ArrowUp" || e.code === "Space") && marian.jumpCount < marian.maxJumps) {
        marian.velocityY = -marian.jumpPower;
        marian.jumpCount++;
    }
});

// Obsługa dotyku
canvas.addEventListener("touchstart", () => {
    if (!isGameStarted) {
        isGameStarted = true; // Rozpoczęcie gry po dotknięciu ekranu
        loop();
        return;
    }

    if (marian.jumpCount < marian.maxJumps) {
        marian.velocityY = -marian.jumpPower;
        marian.jumpCount++;
    }
});

// Obsługa przycisków
document.getElementById("restartBtn").addEventListener("click", resetGame);
document.getElementById("backToMenuBtn").addEventListener("click", () => {
    window.location.href = "index.html";
});

// Start gry
resetGame();
