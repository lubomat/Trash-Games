const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Wymiary gry
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Marian
const marian = {
    x: 50,
    y: 300,
    width: 40,
    height: 40,
    velocityY: 0,
    gravity: 0.1, // Zmniejszona grawitacja
    jumpPower: 6, // Moc pojedynczego skoku
    maxJumps: 2, // Maksymalna liczba skoków
    jumpCount: 0, // Licznik wykonanych skoków
    isJumping: false,
};

// Przeszkody
const obstacles = [];
const obstacleWidth = 40;
const obstacleHeight = 40;
let obstacleSpeed = 0.7; // Startowe tempo przeszkód
let obstacleSpawnRate = 200; // Czas między przeszkodami w klatkach

// Tło
let backgroundX = 0;
let backgroundSpeed = 0.8; // Wolniejsze przesuwanie tła

// Wynik i status gry
let isGameOver = false;
let score = 0;
let distance = 0; // Liczba przebytych metrów
let gameSpeedTimer = 0; // Licznik czasu do zwiększania tempa

// Obrazki
const marianImage = new Image();
marianImage.src = "assets/character/Marianpostac.png";

const obstacleImage = new Image();
obstacleImage.src = "assets/obstacles/przeszkoda1.png";

// Funkcja resetująca grę
function resetGame() {
    marian.x = 50;
    marian.y = 300;
    marian.velocityY = 0;
    marian.jumpCount = 0;
    isGameOver = false;
    score = 0;
    distance = 0;
    obstacles.length = 0;
    obstacleSpeed = 1; // Reset tempa przeszkód
    obstacleSpawnRate = 180; // Reset częstotliwości przeszkód
    backgroundSpeed = 0.8; // Reset prędkości tła
    gameSpeedTimer = 0;
    backgroundX = 0;
    document.getElementById("restartBtn").style.display = "none";
    loop();
}

// Rysowanie Marian
function drawMarian() {
    ctx.drawImage(marianImage, marian.x, marian.y, marian.width, marian.height);
}

// Rysowanie przeszkód
function drawObstacles() {
    obstacles.forEach((obstacle) => {
        ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
    });
}

// Aktualizacja przeszkód
function updateObstacles() {
    if (gameSpeedTimer % obstacleSpawnRate === 0) {
        // Co obstacleSpawnRate klatek dodajemy przeszkodę
        obstacles.push({
            x: canvasWidth,
            y: 300,
        });
    }

    obstacles.forEach((obstacle, index) => {
        obstacle.x -= obstacleSpeed;

        // Usuwanie przeszkód poza ekranem
        if (obstacle.x + obstacleWidth < 0) {
            obstacles.splice(index, 1);
            score++;
        }

        // Kolizja z Marian
        if (
            marian.x < obstacle.x + obstacleWidth &&
            marian.x + marian.width > obstacle.x &&
            marian.y < obstacle.y + obstacleHeight &&
            marian.y + marian.height > obstacle.y
        ) {
            endGame();
        }
    });
}

// Rysowanie tła i licznika metrów
function drawBackgroundAndUI() {
    ctx.fillStyle = "#5CAD67";
    ctx.fillRect(0, 300, canvasWidth, canvasHeight - 300); // Trawa
    ctx.fillStyle = "#D2691E";
    ctx.fillRect(0, 340, canvasWidth, canvasHeight - 340); // Ziemia

    // Licznik metrów
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText(`Distance: ${distance} m`, 10, 20);

    backgroundX -= backgroundSpeed;
}

// Ruch Marian
function updateMarian() {
    marian.velocityY += marian.gravity;
    marian.y += marian.velocityY;

    if (marian.y + marian.height > 340) {
        marian.y = 340 - marian.height;
        marian.velocityY = 0;
        marian.jumpCount = 0; // Reset licznika skoków po lądowaniu
    }
}

// Koniec gry
function endGame() {
    isGameOver = true;
    document.getElementById("restartBtn").style.display = "inline-block";
}

// Główna pętla gry
function loop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    drawBackgroundAndUI();
    updateMarian();
    drawMarian();

    updateObstacles();
    drawObstacles();

    // Aktualizacja przebytych metrów
    distance = Math.floor(gameSpeedTimer / 10);

    // Zwiększ tempo gry co 10 sekund
    if (gameSpeedTimer % 600 === 0) {
        obstacleSpeed += 0.3; // Zwiększ prędkość przeszkód
        backgroundSpeed += 0.1; // Zwiększ prędkość tła
        obstacleSpawnRate = Math.max(120, obstacleSpawnRate - 10); // Zmniejsz czas między przeszkodami
    }

    gameSpeedTimer++;
    requestAnimationFrame(loop);
}

// Obsługa klawiatury
document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp" && marian.jumpCount < marian.maxJumps) {
        marian.velocityY = -marian.jumpPower;
        marian.jumpCount++; // Zwiększ licznik skoków
    }
});

// Obsługa przycisków
document.getElementById("restartBtn").addEventListener("click", resetGame);
document.getElementById("backToMenuBtn").addEventListener("click", () => {
    window.location.href = "index.html";
});

// Start gry 
resetGame();
