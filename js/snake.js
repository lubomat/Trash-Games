const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 30; // Rozmiar jednego segmentu węża (zwiększony z 20 do 30)
canvas.width = 600; // Szerokość canvas
canvas.height = 600; // Wysokość canvas

let snake = [{ x: 10 * box, y: 10 * box }]; // Wąż zaczyna z długością 1
let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box }; // Losowa pozycja jedzenia
let direction = null; // Kierunek ruchu
let previousDirection = null; // Poprzedni kierunek ruchu
let score = 0;
let isGameOver = false; // Flaga kontrolująca stan gry
let gameInterval = null; // Zmienna przechowująca interwał gry
let speed = 200; // Początkowa prędkość gry
let showStartText = true; // Flaga do kontrolowania wyświetlania tekstu startowego

// Ładowanie grafiki tła
const backgroundImage = new Image();
backgroundImage.src = 'assets/background/trawa3.png';

// Ładowanie grafiki głowy węża
const headImage = new Image();
headImage.src = 'assets/character/wegorz.png';

// Ładowanie grafiki segmentu ciała węża
const bodyImage = new Image();
bodyImage.src = 'assets/character/tulow.png';

// Ładowanie grafiki jedzenia
const foodImage = new Image();
foodImage.src = 'assets/obstacles/pilka.png';

// Elementy DOM
const restartBtn = document.getElementById('restartBtn');
const backToMenuBtn = document.getElementById('backToMenuBtn');
const levelSelector = document.getElementById('levelSelector');

// Funkcja rysowania
function draw() {
    // Rysujemy tło gry
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Rysujemy ciało węża
    snake.slice(1).forEach(segment => {
        ctx.drawImage(bodyImage, segment.x, segment.y, box, box); // Rysujemy segment ciała
    });

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
    ctx.drawImage(foodImage, food.x, food.y, box, box);

    // Wyświetlamy tekst startowy, jeśli gra jeszcze się nie rozpoczęła
    if (showStartText) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(50, canvas.height / 2 - 30, canvas.width - 100, 60);

        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            'Select a level and use your keyboard to start',
            canvas.width / 2,
            canvas.height / 2 + 5
        );
    }

    // Rysujemy wynik
    document.getElementById('score').textContent = score;
}

// Funkcja do poruszania węża
function moveSnake() {
    if (isGameOver || direction === null) return; // Jeśli gra jest zakończona lub nie rozpoczęła się, wąż się nie porusza

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
        food = { x: Math.floor(Math.random() * (canvas.width / box)) * box, y: Math.floor(Math.random() * (canvas.height / box)) * box }; // Nowe jedzenie
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
    food = { x: Math.floor(Math.random() * (canvas.width / box)) * box, y: Math.floor(Math.random() * (canvas.height / box)) * box };
    showStartText = true; // Przywracamy tekst startowy
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

    if (!direction) {
        // Jeśli gra nie wystartowała, startujemy grę i usuwamy tekst startowy
        showStartText = false;
        setGameSpeed();
    }

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

// Rysujemy początkowy stan gry
resetGame();
