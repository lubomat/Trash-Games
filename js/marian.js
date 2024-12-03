const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Wymiary gry
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Marian
const marian = {
    x: 50,
    y: 235, // Dopasowanie wysokości do oryginalnego tła
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
let obstacleSpawnRate = 300; // Większe przerwy między przeszkodami

// Tło
let backgroundX = 0;
let backgroundSpeed = 0.8; // Wolniejsze przesuwanie tła

// Wynik i status gry
let isGameOver = false;
let score = 0;
let distance = 0; // Liczba przebytych metrów
let gameSpeedTimer = 0; // Licznik czasu do zwiększania tempa

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
    marian.y = 220; // Reset wysokości postaci
    marian.velocityY = 0;
    marian.jumpCount = 0;
    isGameOver = false;
    score = 0;
    distance = 0;
    obstacles.length = 0;
    obstacleSpeed = 1; // Reset tempa przeszkód
    obstacleSpawnRate = 300; // Reset częstotliwości przeszkód
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
        let image;
        if (obstacle.type === "bad") {
            image = badObstacleImage; // zlakupa po 1000 m
        } else if (obstacle.type === "dangerous") {
            image = obstacleImage2; // kupa2 po 2000 m
        } else {
            image = obstacleImage; // domyślnie kupa
        }
        ctx.drawImage(image, obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
    });
}

// Aktualizacja przeszkód
function updateObstacles() {
    if (gameSpeedTimer % obstacleSpawnRate === 0) {
        let obstacleType = "normal"; // Domyślny typ przeszkody

        if (distance >= 2000) {
            obstacleType = "dangerous"; // Zmieniamy na kupa2 po 2000 m
        } else if (distance >= 1000) {
            obstacleType = "bad"; // Zmieniamy na zlakupa po 1000 m
        }

        obstacles.push({
            x: canvasWidth,
            y: 235, // Wysokość przeszkód dopasowana do tła
            type: obstacleType, // Typ przeszkody
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
    // Usunięte zielone i brązowe pasy
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

    if (marian.y + marian.height > 275) { // Dopasowanie do brązowego obszaru tła
        marian.y = 275 - marian.height;
        marian.velocityY = 0;
        marian.jumpCount = 0; // Reset liczby skoków
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
        obstacleSpawnRate = Math.max(60, obstacleSpawnRate - 5); // Minimalna przerwa: 60 klatek
    }

    gameSpeedTimer++;
    requestAnimationFrame(loop);
}

// Obsługa klawiatury
document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp" || e.code === "Space" && marian.jumpCount < marian.maxJumps) {
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
