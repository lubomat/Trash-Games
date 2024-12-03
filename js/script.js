const lights = document.querySelectorAll('.light');
const message = document.getElementById('message');
const timer = document.getElementById('timer');
const startButton = document.getElementById('startButton');

let isCounting = false; // Czy trwa odliczanie (zapalanie i gaszenie świateł)
let canClick = false; // Czy gracz może kliknąć po zgaszeniu świateł
let startTime; // Czas rozpoczęcia stopera
let timeoutIds = []; // Tablica przechowująca ID timeoutów do ich anulowania

// Funkcja do resetowania gry
function resetGame() {
    lights.forEach(light => light.classList.remove('active'));
    message.textContent = 'Tap/click to start the game!';
    timer.textContent = '00.000';
    isCounting = false;
    canClick = false;

    // Anulowanie wszystkich timeoutów
    timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutIds = [];
}

// Funkcja do rozpoczęcia sekwencji świateł
function startLightsSequence() {
    resetGame();
    isCounting = true; // Odliczanie rozpoczęte
    message.textContent = 'Get ready...';

    let delay = 1100; // Opóźnienie między zapalaniem świateł w milisekundach
    const columns = 5; // Liczba kolumn
    const lightsPerColumn = 4; // Liczba świateł na kolumnę

    // Zapalanie świateł w kolumnach
    for (let col = 0; col < columns; col++) {
        const timeoutId = setTimeout(() => {
            // Zapal dolne 2 światła w danej kolumnie
            for (let row = lightsPerColumn - 2; row < lightsPerColumn; row++) {
                const index = col * lightsPerColumn + row;
                lights[index].classList.add('active');
            }
        }, delay * (col + 1));
        timeoutIds.push(timeoutId); // Zapisujemy ID timeoutu
    }

    // Losowe opóźnienie przed zgaszeniem wszystkich świateł
    const randomDelay = Math.random() * 3000 + 1000;
    const timeoutId = setTimeout(() => {
        lights.forEach(light => light.classList.remove('active')); // Gasimy wszystkie światła
        startTimer(); // Startujemy stoper
        isCounting = false; // Odliczanie zakończone
        canClick = true; // Gracz może teraz kliknąć
        message.textContent = 'GO!';
    }, delay * columns + randomDelay);
    timeoutIds.push(timeoutId); // Zapisujemy ID timeoutu
}

// Funkcja do uruchamiania stopera
function startTimer() {
    startTime = performance.now();
}

// Funkcja do zatrzymania gry w przypadku falstartu
function triggerFalseStart() {
    // Zatrzymanie odliczania i timeoutów
    isCounting = false;
    canClick = false;
    timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutIds = [];
    message.textContent = 'FALSE START!'; // Wyświetlenie komunikatu
}

// Obsługa kliknięcia na ekranie
document.body.addEventListener('click', () => {
    if (isCounting && !canClick) {
        // Jeśli gracz kliknie podczas odliczania
        triggerFalseStart();
    } else if (canClick) {
        // Jeśli gracz kliknie po zgaszeniu świateł (prawidłowy klik)
        const endTime = performance.now();
        const reactionTime = (endTime - startTime) / 1000;
        timer.textContent = reactionTime.toFixed(3);
        canClick = false;
    }
});

// Przycisk startowy
startButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Zapobiegamy rejestrowaniu kliknięcia jako fałszywego kliknięcia w grze
    startLightsSequence();
});
