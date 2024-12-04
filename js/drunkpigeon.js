const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Wymiary gry
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Gracz (pijany gołąb)
const pigeon = {
    x: 100,
    y: canvasHeight / 2,
    width: 40, // Dostosowana szerokość
    height: 40, // Dostosowana wysokość
    gravity: 0.025, // Wolniejsze opadanie
    lift: -1.5,     // Mocniejszy podskok
    velocity: 0,
    image: new Image(), // Obraz gołębia
};
pigeon.image.src = "assets/character/drunkpigeon.png"; // Ścieżka do obrazu gołębia

// Przeszkody
const pipes = [];
const pipeWidth = 45;
const pipeGap = 160; // Szersze szczeliny
let pipeSpeed = 1;   // Mniejsza prędkość startowa

// Ładowanie obrazu rury
const pipeImage = new Image();
pipeImage.src = "assets/obstacles/rura.png"; // Ścieżka do obrazu rury

// Wynik i status gry
let isGameOver = false;
let score = 0;
let frameCounter = 0;
const pipeFrequency = 195; // Odstęp między przeszkodami (w klatkach)

// Funkcja resetująca grę
function resetGame() {
    pigeon.y = canvasHeight / 2;
    pigeon.velocity = 0;
    pipes.length = 0;
    score = 0;
    frameCounter = 0;
    pipeSpeed = 1; // Reset prędkości przeszkód
    isGameOver = false;
    document.getElementById("gameOverMessage").style.display = "none";
    loop();
}

// Rysowanie gracza (pijanego gołębia)
function drawPigeon() {
    ctx.drawImage(pigeon.image, pigeon.x, pigeon.y, pigeon.width, pigeon.height);
}

// Rysowanie przeszkód
function drawPipes() {
    pipes.forEach(pipe => {
        // Rysowanie górnej rury
        ctx.drawImage(pipeImage, pipe.x, 0, pipeWidth, pipe.top);

        // Rysowanie dolnej rury
        ctx.drawImage(pipeImage, pipe.x, pipe.top + pipeGap, pipeWidth, canvasHeight - pipe.top - pipeGap);
    });
}

// Dodawanie przeszkód
function addPipe() {
    const top = Math.random() * (canvasHeight / 2 - 50) + 20; // Losowa wysokość górnej rury
    pipes.push({ x: canvasWidth, top });
}

// Aktualizacja przeszkód
function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
    });

    // Usuwanie przeszkód poza ekranem
    if (pipes.length && pipes[0].x + pipeWidth < 0) {
        pipes.shift();
        score++;
    }
}

// Aktualizacja gracza (pijanego gołębia)
function updatePigeon() {
    pigeon.velocity += pigeon.gravity;
    pigeon.y += pigeon.velocity;

    // Zatrzymanie gołębia w obrębie ekranu
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
    document.getElementById("gameOverMessage").style.display = "block";
}

// Główna pętla gry
function loop() {
    if (isGameOver) return;

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
        pipeSpeed += 0.2; // Zwiększenie prędkości przeszkód
    }

    frameCounter++;
    requestAnimationFrame(loop);
}

// Obsługa klawiatury i dotyku
document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp" || e.code === "Space") {
        handleJump();
    }
});

canvas.addEventListener("touchstart", () => {
    handleJump();
});

// Funkcja obsługująca skok
function handleJump() {
    if (isGameOver) {
        resetGame();
    } else {
        pigeon.velocity = pigeon.lift; // Podskok gołębia
    }
}

// Obsługa przycisków
document.getElementById("backToMenuBtn").addEventListener("click", () => {
    window.location.href = "index.html";
});

// Start gry
loop();
