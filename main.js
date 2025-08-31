// Elemente
const menuMain = document.getElementById('menu-main');
const menuGame = document.getElementById('menu-game');
const menuShop = document.getElementById('menu-shop');

const btnStartGame = document.getElementById('btnStartGame');
const btnOpenShop = document.getElementById('btnOpenShop');
const btnBackToMenu = document.getElementById('btnBackToMenu');
const btnBackFromShop = document.getElementById('btnBackFromShop');

const btnStart = document.getElementById('btnStart');
const btnReset = document.getElementById('btnReset');
const btnResetGame = document.getElementById('btnResetGame');

const pointsDisplay = document.getElementById('pointsDisplay');
const pointsDisplayShop = document.getElementById('pointsDisplayShop');
const timerDisplay = document.getElementById('timerDisplay');
const messageDisplay = document.getElementById('messageDisplay');

const btnUpgradeSpeed = document.getElementById('btnUpgradeSpeed');
const btnUpgradeReward = document.getElementById('btnUpgradeReward');
const btnUpgradeMilliseconds = document.getElementById('btnUpgradeMilliseconds');

const priceSpeedEl = document.getElementById('priceSpeed');
const priceRewardEl = document.getElementById('priceReward');
const priceMillisecondsEl = document.getElementById('priceMilliseconds');

// Variablen
let points = 0;
let elapsed = 0; 
let timerInterval = null;

let speedLevel = 0;
let rewardLevel = 0;
let millisecondsLevel = 0;

let priceSpeed = 100;
let priceReward = 100;
let priceMilliseconds = 200;

// Lade Daten aus LocalStorage
function loadGame() {
  const savedPoints = localStorage.getItem('ws_points');
  if (savedPoints !== null) points = parseInt(savedPoints, 10);

  const savedSpeed = localStorage.getItem('ws_speedLevel');
  if (savedSpeed !== null) speedLevel = parseInt(savedSpeed, 10);

  const savedReward = localStorage.getItem('ws_rewardLevel');
  if (savedReward !== null) rewardLevel = parseInt(savedReward, 10);

  const savedMs = localStorage.getItem('ws_millisecondsLevel');
  if (savedMs !== null) millisecondsLevel = parseInt(savedMs, 10);

  const savedPriceSpeed = localStorage.getItem('ws_priceSpeed');
  if (savedPriceSpeed !== null) priceSpeed = parseInt(savedPriceSpeed, 10);

  const savedPriceReward = localStorage.getItem('ws_priceReward');
  if (savedPriceReward !== null) priceReward = parseInt(savedPriceReward, 10);

  const savedPriceMs = localStorage.getItem('ws_priceMilliseconds');
  if (savedPriceMs !== null) priceMilliseconds = parseInt(savedPriceMs, 10);
}

// Speichere Daten in LocalStorage
function saveGame() {
  localStorage.setItem('ws_points', points);
  localStorage.setItem('ws_speedLevel', speedLevel);
  localStorage.setItem('ws_rewardLevel', rewardLevel);
  localStorage.setItem('ws_millisecondsLevel', millisecondsLevel);

  localStorage.setItem('ws_priceSpeed', priceSpeed);
  localStorage.setItem('ws_priceReward', priceReward);
  localStorage.setItem('ws_priceMilliseconds', priceMilliseconds);
}

function switchMenu(menuToShow) {
  [menuMain, menuGame, menuShop].forEach(m => m.classList.remove('active'));
  menuToShow.classList.add('active');
}

function formatTime(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let seconds = totalSeconds % 60;
  let totalMinutes = Math.floor(totalSeconds / 60);
  let minutes = totalMinutes % 60;
  let hours = Math.floor(totalMinutes / 60);

  let timeStr = 
    hours.toString().padStart(2, '0') + ':' +
    minutes.toString().padStart(2, '0') + ':' +
    seconds.toString().padStart(2, '0');

  if (millisecondsLevel > 0) {
    let msDisplay = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    timeStr += '.' + msDisplay;
  }
  return timeStr;
}

function updateDisplays() {
  pointsDisplay.textContent = points;
  pointsDisplayShop.textContent = points;
  timerDisplay.textContent = formatTime(elapsed);

  priceSpeedEl.textContent = priceSpeed;
  priceRewardEl.textContent = priceReward;
  priceMillisecondsEl.textContent = priceMilliseconds;
}

function startTimer() {
  if (timerInterval) return;
  let speedMultiplier = Math.pow(2, speedLevel);
  let lastTimestamp = Date.now();

  timerInterval = setInterval(() => {
    let now = Date.now();
    let diff = now - lastTimestamp;
    elapsed += diff * speedMultiplier;
    lastTimestamp = now;
    timerDisplay.textContent = formatTime(elapsed);
  }, 50);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetTimer() {
  stopTimer();
  let gainedPoints = Math.floor((elapsed / 1000) * Math.pow(2, rewardLevel));
  points += gainedPoints;
  elapsed = 0;
  messageDisplay.textContent = `Du hast ${gainedPoints} Punkte erhalten!`;
  updateDisplays();
  saveGame();
}

function resetGame() {
  if (confirm("Willst du das Spiel wirklich zurücksetzen? Alle Fortschritte gehen verloren!")) {
    localStorage.clear();
    points = 0;
    elapsed = 0;
    speedLevel = 0;
    rewardLevel = 0;
    millisecondsLevel = 0;
    priceSpeed = 100;
    priceReward = 100;
    priceMilliseconds = 200;

    saveGame();
    updateDisplays();
    switchMenu(menuMain);
    alert("Spiel wurde zurückgesetzt!");
  }
}

function buyUpgradeSpeed() {
  if (points >= priceSpeed) {
    points -= priceSpeed;
    speedLevel++;
    priceSpeed *= 2;
    messageDisplay.textContent = 'Geschwindigkeit erhöht!';
    updateDisplays();
    saveGame();
  } else {
    messageDisplay.textContent = 'Nicht genug Punkte für Geschwindigkeit!';
  }
}

function buyUpgradeReward() {
  if (points >= priceReward) {
    points -= priceReward;
    rewardLevel++;
    priceReward *= 2;
    messageDisplay.textContent = 'Belohnung erhöht!';
    updateDisplays();
    saveGame();
  } else {
    messageDisplay.textContent = 'Nicht genug Punkte für Belohnung!';
  }
}

function buyUpgradeMilliseconds() {
  if (millisecondsLevel === 0 && points >= priceMilliseconds) {
    points -= priceMilliseconds;
    millisecondsLevel = 1;
    messageDisplay.textContent = 'Millisekunden-Anzeige freigeschaltet!';
    updateDisplays();
    saveGame();
  } else if (millisecondsLevel === 1) {
    messageDisplay.textContent = 'Millisekunden-Anzeige ist bereits aktiviert!';
  } else {
    messageDisplay.textContent = 'Nicht genug Punkte für Millisekunden!';
  }
}

// Event Listener
btnStartGame.addEventListener('click', () => {
  switchMenu(menuGame);
  messageDisplay.textContent = '';
  updateDisplays();
});

btnOpenShop.addEventListener('click', () => {
  switchMenu(menuShop);
  messageDisplay.textContent = '';
  updateDisplays();
});

btnBackToMenu.addEventListener('click', () => {
  switchMenu(menuMain);
  messageDisplay.textContent = '';
});

btnBackFromShop.addEventListener('click', () => {
  switchMenu(menuGame);
  messageDisplay.textContent = '';
  updateDisplays();
});

btnStart.addEventListener('click', () => {
  startTimer();
  messageDisplay.textContent = 'Timer läuft...';
});

btnReset.addEventListener('click', () => {
  resetTimer();
});

btnResetGame.addEventListener('click', resetGame);

btnUpgradeSpeed.addEventListener('click', () => {
  buyUpgradeSpeed();
});

btnUpgradeReward.addEventListener('click', () => {
  buyUpgradeReward();
});

btnUpgradeMilliseconds.addEventListener('click', () => {
  buyUpgradeMilliseconds();
});

// Spielstand laden & Display updaten
loadGame();
updateDisplays();
switchMenu(menuMain);
