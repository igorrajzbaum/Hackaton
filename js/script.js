// Elements
const welcomeScreen = document.getElementById('welcome-screen');
const rulesScreen = document.getElementById('rules-screen');
const gameContainer = document.getElementById('game-container');
const endScreen = document.getElementById('end-screen');
const rulesButton = document.getElementById('rules-button');
const startButtons = document.querySelectorAll('.start-game-button'); 
const retryButton = document.getElementById('retry-button');
const camion = document.getElementById('camion');
const livesSpan = document.getElementById('lives');
const scoreSpan = document.getElementById('score');
const highScoreSpan = document.getElementById('high-score');
const endMessage = document.getElementById('end-message');
const finalScore = document.getElementById('final-score');
const finalHighScore = document.getElementById('final-high-score');

// Variables
let lives = 10;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameInterval;
let fallingItems = [];

highScoreSpan.textContent = highScore;

// Rules Screen
rulesButton.addEventListener('click', () => {
    welcomeScreen.style.display = 'none';
    rulesScreen.style.display = 'block';
});

// Start Game
startButtons.forEach(button => {
    button.addEventListener('click', startGame); 
  });
  

retryButton.addEventListener('click', () => {
    endScreen.style.display = 'none';
    lives = 10;
    score = 0;
    livesSpan.textContent = lives;
    gameContainer.style.display = 'block';
    startGame();
});

// Game Functions
function startGame() {
    welcomeScreen.style.display = 'none';
    rulesScreen.style.display = 'none';
    gameContainer.style.display = 'block';
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

    if (lives > 0) {
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
    const icons_good = [
        '<img src="assets/carton.png" width="40px" height="40px">',
        '<img src="assets/bottle.png" width="40px" height="40px">',
        '<img src="assets/can.png" width="30px">',
        '<img src="assets/tetrapak.png" height="60px">'
    ];
    item.innerHTML = icons_good[Math.floor(Math.random() * icons_good.length)];
    } else {
    const icons_bad = [
        '<img src="assets/omr.png" width="50px" height="50px">',
        '<img src="assets/proto.png" width="60px" height="60px">',
        '<img src="assets/glass_bottle.png" width="40px" height="40px">'
    ];
    item.innerHTML = icons_bad[Math.floor(Math.random() * icons_bad.length)];
    }

    item.style.left = Math.random() * (gameContainer.offsetWidth - 40) + 'px';
    item.style.top = '0px';
    gameContainer.appendChild(item);
    fallingItems.push(item);

    setTimeout(() => {
    if (lives > 0) createFallingItem();
    }, (Math.random() * 1000 + 500)/(1+0.1*(Math.floor(score/10)+1)));
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
        lives -= 5; // Bad item: Decrease lives by 5
        }
        scoreSpan.textContent = score;  
        item.remove();
        fallingItems.splice(index, 1);
    } 
    else if (itemTop > gameContainer.offsetHeight) {
        // Item missed
        if (item.classList.contains('good-item')) {
        lives--; // Good item: Decrease lives
        }
        item.remove();
        fallingItems.splice(index, 1);
    }
    livesSpan.textContent = lives;
    if (lives <= 0) {
        endGame();
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