const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20; // Rozmiar jednego segmentu węża
let snake = [{ x: 10 * box, y: 10 * box }]; // Wąż zaczyna z długością 1
let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box }; // Losowa pozycja jedzenia
let direction = null; // Kierunek ruchu
let score = 0;

// Rysowanie elementów
function draw() {
    // Czyścimy planszę
    ctx.fillStyle = '#a2d149';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Rysujemy węża
    ctx.fillStyle = '#000';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, box, box));

    // Rysujemy jedzenie
    ctx.fillStyle = '#d9534f';
    ctx.fillRect(food.x, food.y, box, box);

    // Rysujemy wynik
    document.getElementById('score').textContent = score;
}

// Funkcja do poruszania węża
function moveSnake() {
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

    // Sprawdzamy, czy wąż uderzył w ścianę
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        alert('Game Over!');
        resetGame();
        return;
    }

    // Sprawdzamy, czy wąż uderzył w siebie
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            alert('Game Over!');
            resetGame();
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

// Funkcja resetująca grę
function resetGame() {
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = null;
    score = 0;
    food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
}

// Obsługa klawiatury
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});

// Uruchamiamy grę
setInterval(moveSnake, 200); // Ruch co 200ms
draw();
