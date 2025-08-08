let user, zombie;

function initializeGame() {
  user = {
    life: 100,
    level: 1,
    xp: 0,
    potions: 3,
  };

  zombie = {
    life: 150,
    shield: 0
  };

  enableAllButtons();
  document.getElementById('log-box').innerHTML = '';
  updateStats();
  logMessage("Game started. Prepare for battle!");
}

function updateStats() {
  document.getElementById('user-level').textContent = user.level;
  document.getElementById('user-xp').textContent = user.xp;
  document.getElementById('user-potions').textContent = user.potions;
  updateHealthBars();
}

function updateHealthBars() {
  const userFill = document.getElementById('user-health-fill');
  userFill.style.width = `${user.life}%`;
  userFill.style.backgroundColor = user.life > 50 ? 'green' : user.life > 25 ? 'orange' : 'red';

  const zombieFill = document.getElementById('zombie-health-fill');
  const zombiePercent = Math.max(zombie.life / 150 * 100, 0);
  zombieFill.style.width = `${zombiePercent}%`;
  zombieFill.style.backgroundColor = zombiePercent > 50 ? 'green' : zombiePercent > 25 ? 'orange' : 'red';
}

function flashDamage(panelId) {
  const panel = document.getElementById(panelId);
  panel.classList.add('damage');
  setTimeout(() => {
    panel.classList.remove('damage');
  }, 300);
}

function flashLife(panelId) {
  const panel = document.getElementById(panelId);
  panel.classList.add('life');
  setTimeout(() => {
    panel.classList.remove('life');
  }, 300);
}
function logMessage(message) {
  const logBox = document.getElementById('log-box');
  const time = new Date().toLocaleTimeString();
  logBox.innerHTML += `<div>[${time}]<strong> ${message}</strong></div>`;
  logBox.scrollTop = logBox.scrollHeight;
}

// --- Player Actions ---

function attackZombie() {
  const damage = 10;
  zombie.life -= damage;
  if (zombie.life < 0) zombie.life = 0;
  user.xp += 10;
  logMessage("⚔️Player attacked zombie for 10 damage.");
  checkLevelUp();
  flashDamage('zombie-panel');
  updateStats();
  checkEndGame(() => setTimeout(zombieAttack, 800));
}

function specialAttack() {
  const damage = 20;
  zombie.life -= damage;
  if (zombie.life < 0) zombie.life = 0;
  user.xp += 20;
  logMessage("💥Player used Special Attack for 20 damage.");
  checkLevelUp();
  flashDamage('zombie-panel');
  updateStats();
  checkEndGame(() => setTimeout(zombieAttack, 800));
}

function comboAttack() {
  const damage = 30;
  zombie.life -= damage;
  if (zombie.life < 0) zombie.life = 0;
  user.xp += 30;
  logMessage("🗡️Player used Combo Attack for 30 damage.");
  checkLevelUp();
  flashDamage('zombie-panel');
  updateStats();
  checkEndGame(() => setTimeout(zombieAttack, 800));
}

function heal() {
  user.life += 10;
  if (user.life > 100) user.life = 100;
  logMessage("🧪Player healed 10 HP.");
  flashLife('player-panel');
  updateStats();
  setTimeout(zombieAttack, 800);
}

function usePotion() {
  if (user.potions > 0) {
    user.life += 30;
    if (user.life > 100) user.life = 100;
    user.potions -= 1;
    logMessage("🧴Player used a potion and recovered 30 HP.");
    flashLife('player-panel');
    updateStats();
    setTimeout(zombieAttack, 800);
  } else {
    alert("No potions left!");
    logMessage("Player tried to use a potion but has none left!");
  }
}

// --- Zombie Attack ---
function zombieAttack() {
  if (zombie.life <= 0 || user.life <= 0) return;

  const damage = 15;
  user.life -= damage;
  if (user.life < 0) user.life = 0;
  logMessage("🧬Zombie attacked player for 15 damage.");
  flashDamage('player-panel');
  updateStats();
  checkEndGame();
}

// --- Level and Game State ---

function checkLevelUp() {
  if (user.xp >= 100) {
    user.level += 1;
    user.xp = 0;
    alert("Level up! You are now level " + user.level);
    logMessage("🎉 Player leveled up to " + user.level);
  }
}

function checkEndGame(callbackIfAlive = () => {}) {
  if (zombie.life <= 0) {
    alert("🎉 You defeated the zombie!");
    logMessage("💀 The zombie has been defeated! You win!");
    disableAllButtons();
  } else if (user.life <= 0) {
    alert("☠️ You died! Game Over!");
    logMessage("☠️ The player has died. Game Over.");
    disableAllButtons();
  } else {
    callbackIfAlive();
  }
}

function disableAllButtons() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    if (!btn.classList.contains('restart-btn')) {
      btn.disabled = true;
    }
  });
}

function enableAllButtons() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => btn.disabled = false);
}

// --- Restart Game ---
function restartGame() {
  initializeGame();
}

// Start the game
initializeGame();
