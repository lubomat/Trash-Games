const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20; // Rozmiar jednego segmentu węża
let snake = [{ x: 10 * box, y: 10 * box }]; // Wąż zaczyna z długością 1
let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box }; // Losowa pozycja jedzenia
let direction = null; // Kierunek ruchu
let previousDirection = null; // Poprzedni kierunek ruchu
let score = 0;
let isGameOver = false; // Flaga kontrolująca stan gry
let gameInterval = null; // Zmienna przechowująca interwał gry
let speed = 200; // Początkowa prędkość gry

// Ładowanie grafiki głowy węża
const headImage = new Image();
headImage.src = 'assets/character/wegorz.png';

// Elementy DOM
const restartBtn = document.getElementById('restartBtn');
const backToMenuBtn = document.getElementById('backToMenuBtn');
const levelSelector = document.getElementById('levelSelector');

// Funkcja rysowania
function draw() {
    // Czyścimy planszę
    ctx.fillStyle = '#a2d149';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Rysujemy ciało węża
    ctx.fillStyle = '#000';
    snake.slice(1).forEach(segment => ctx.fillRect(segment.x, segment.y, box, box));

    // Rysujemy głowę węża
    const head = snake[0];
    ctx.save(); // Zapisujemy aktualny stan kontekstu
    ctx.translate(head.x + box / 2, head.y + box / 2); // Przesuwamy układ współrzędnych na środek głowy

    switch (direction) {
        case 'UP':
            ctx.rotate(Math.PI); // Obrót o 180 stopni (z dołu na górę)
            break;
        case 'DOWN':
            // Domyślnie, brak obrotu (głowa węża skierowana w dół w oryginalnym obrazku)
            break;
        case 'LEFT':
            ctx.rotate(Math.PI / 2); // Obrót o 90 stopni (z dołu na lewo)
            break;
        case 'RIGHT':
            ctx.rotate((Math.PI * 3) / 2); // Obrót o 270 stopni (z dołu na prawo)
            break;
        default:
            break;
    }

    ctx.drawImage(headImage, -box / 2, -box / 2, box, box); // Rysujemy głowę w odpowiednim kierunku
    ctx.restore(); // Przywracamy poprzedni stan kontekstu

    // Rysujemy jedzenie
    ctx.fillStyle = '#d9534f';
    ctx.fillRect(food.x, food.y, box, box);

    // Rysujemy wynik
    document.getElementById('score').textContent = score;
}


// Funkcja do poruszania węża
function moveSnake() {
    if (isGameOver) return; // Jeśli gra jest zakończona, wąż się nie porusza

    const head = { ...snake[0] };

    switch (direction) {
        case 'UP':
            head.y -= box;
            break;
        case 'DOWN':
            head.y += box;
            break;
        case 'LEFT':
            head.x -= box;
            break;
        case 'RIGHT':
            head.x += box;
            break;
        default:
            return;
    }

    // Aktualizujemy poprzedni kierunek
    previousDirection = direction;

    // Sprawdzamy, czy wąż uderzył w ścianę
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        endGame();
        return;
    }

    // Sprawdzamy, czy wąż uderzył w siebie
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            endGame();
            return;
        }
    }

    // Dodajemy głowę na początek węża
    snake.unshift(head);

    // Sprawdzamy, czy wąż zjadł jedzenie
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box }; // Nowe jedzenie
    } else {
        snake.pop(); // Usuwamy ostatni segment węża, jeśli nie zjadł jedzenia
    }

    draw();
}

// Funkcja kończąca grę
function endGame() {
    clearInterval(gameInterval); // Zatrzymujemy interwał
    alert('Game Over!');
    direction = null; // Zatrzymujemy węża
    isGameOver = true; // Ustawiamy flagę końca gry
    restartBtn.style.display = 'inline-block'; // Pokazujemy przycisk "Start Again"
}

// Funkcja resetująca grę
function resetGame() {
    clearInterval(gameInterval); // Zatrzymujemy interwał, jeśli istnieje
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = null;
    previousDirection = null;
    score = 0;
    isGameOver = false; // Resetujemy flagę końca gry
    food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
    restartBtn.style.display = 'none'; // Ukrywamy przycisk "Start Again"
    setGameSpeed(); // Uruchamiamy grę z wybraną prędkością
    draw();
}

// Funkcja ustawiająca prędkość gry na podstawie wybranego poziomu trudności
function setGameSpeed() {
    clearInterval(gameInterval); // Czyścimy poprzedni interwał
    const level = levelSelector.value;

    if (level === 'easy') {
        speed = 200;
    } else if (level === 'medium') {
        speed = 100;
    } else if (level === 'mutant') {
        speed = 50;
    }

    gameInterval = setInterval(moveSnake, speed);
}

// Obsługa klawiatury
document.addEventListener('keydown', e => {
    if (isGameOver) return; // Ignorujemy zdarzenia klawiatury, jeśli gra jest zakończona

    // Blokada zawracania węża
    if (e.key === 'ArrowUp' && previousDirection !== 'DOWN') direction = 'UP';
    if (e.key === 'ArrowDown' && previousDirection !== 'UP') direction = 'DOWN';
    if (e.key === 'ArrowLeft' && previousDirection !== 'RIGHT') direction = 'LEFT';
    if (e.key === 'ArrowRight' && previousDirection !== 'LEFT') direction = 'RIGHT';
});

// Obsługa przycisków
restartBtn.addEventListener('click', () => {
    resetGame();
});

backToMenuBtn.addEventListener('click', () => {
    window.location.href = 'index.html'; // Przejście na stronę główną
});

// Uruchamiamy grę na początkowym poziomie trudności
setGameSpeed();
draw();
