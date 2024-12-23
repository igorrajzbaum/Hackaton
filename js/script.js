// Elements
const welcomeScreen = document.getElementById('welcome-screen');
const gameContainer = document.getElementById('game-container');
const endScreen = document.getElementById('end-screen');
const startButton = document.getElementById('start-button');
const retryButton = document.getElementById('retry-button');
const camion = document.getElementById('camion');
const scoreSpan = document.getElementById('score');
const highScoreSpan = document.getElementById('high-score');
const endMessage = document.getElementById('end-message');
const finalScore = document.getElementById('final-score');
const finalHighScore = document.getElementById('final-high-score');

// Variables
let score = 10;
let highScore = localStorage.getItem('highScore') || 0;
let gameInterval;
let fallingItems = [];

highScoreSpan.textContent = highScore;

// Start Game
startButton.addEventListener('click', () => {
    welcomeScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    startGame();
});

retryButton.addEventListener('click', () => {
    endScreen.style.display = 'none';
    score = 10;
    scoreSpan.textContent = score;
    gameContainer.style.display = 'block';
    startGame();
});

// Game Functions
function startGame() {
    fallingItems = [];
    createFallingItem();
    gameInterval = setInterval(() => {
    moveFallingItems();
    }, 20);
}

function endGame() {
    clearInterval(gameInterval);
    fallingItems.forEach(item => item.remove());
    fallingItems = [];
    gameContainer.style.display = 'none';
    endScreen.style.display = 'flex';

    if (score > 0) {
    endMessage.textContent = "Great Job! Keep Recycling!";
    } else {
    endMessage.textContent = "Game Over! Let's Try Again!";
    }

    finalScore.textContent = score;
    finalHighScore.textContent = highScore;

    if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
    highScoreSpan.textContent = highScore;
    }
}

function createFallingItem() {
    const item = document.createElement('div');
    const isGoodItem = Math.random() < 0.7; // 70% chance of being a good item
    item.classList.add('falling-item', isGoodItem ? 'good-item' : 'bad-item');

    // Assign icon based on type
    if (isGoodItem) {
    const icons = ['<img src="assets/carton.png" width="40px" height="40px">', '<img src="assets/bottle.png" width="40px" height="40px">'];
    item.innerHTML = icons[Math.floor(Math.random() * icons.length)];
    } else {
    const icons = ['<img src="assets/omr.png" width="40px" height="40px">'];
    item.innerHTML = icons[Math.floor(Math.random() * icons.length)];
    }

    item.style.left = Math.random() * (gameContainer.offsetWidth - 40) + 'px';
    item.style.top = '0px';
    gameContainer.appendChild(item);
    fallingItems.push(item);

    setTimeout(() => {
    if (score > 0) createFallingItem();
    }, Math.random() * 1000 + 500);
}

function moveFallingItems() {
    fallingItems.forEach((item, index) => {
    const itemTop = parseInt(item.style.top);
    const camionLeft = camion.offsetLeft;
    const camionRight = camionLeft + camion.offsetWidth;

    // Move item down
    item.style.top = itemTop + 5 + 'px';

    // Check collision
    if (itemTop + 40 >= gameContainer.offsetHeight - camion.offsetHeight &&
        item.offsetLeft + 40 > camionLeft &&
        item.offsetLeft < camionRight) {
        if (item.classList.contains('good-item')) {
        score++; // Good item: Increase score
        } else if (item.classList.contains('bad-item')) {
        score -= 5; // Bad item: Decrease score by 5
        }
        scoreSpan.textContent = score;
        item.remove();
        fallingItems.splice(index, 1);

        if (score <= 0) {
        endGame();
        }
    } else if (itemTop > gameContainer.offsetHeight) {
        // Item missed
        item.remove();
        fallingItems.splice(index, 1);
    }
    });
}

// camion Movement for Desktop and Mobile
function handleCamionMovement(clientX) {
    const gameBounds = gameContainer.getBoundingClientRect();
    const camionWidth = camion.offsetWidth;

    let newLeft = clientX - gameBounds.left - camionWidth / 2;
    if (newLeft < 0) newLeft = 0;
    if (newLeft > gameBounds.width - camionWidth) newLeft = gameBounds.width - camionWidth;

    camion.style.left = newLeft + 'px';
}

// Desktop: Mouse Movement
document.addEventListener('mousemove', (e) => {
    handleCamionMovement(e.clientX);
});

// Mobile: Touch Movement
document.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
    handleCamionMovement(e.touches[0].clientX);
    }
});