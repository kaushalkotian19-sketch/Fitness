// DOM Elements
const btnComplete = document.getElementById('btn-complete-workout');
const questCard = document.getElementById('active-quest');
const coinDisplay = document.getElementById('coin-val');
const staminaFill = document.querySelector('.stamina-fill');
const staminaVal = document.getElementById('stamina-val');

// Player State
let playerStats = {
    coins: 240,
    stamina: 100
};

// Game Configuration
const WORKOUT_COST = 20;
const BASE_REWARD = 4;
const BONUS_REWARD = 12;

btnComplete.addEventListener('click', () => {
    
    // 1. Check Stamina
    if (playerStats.stamina < WORKOUT_COST) {
        alert("Not enough stamina! Rest to recharge.");
        return;
    }

    // 2. Trigger "Game Feel" Physical Feedback
    // Vibrate pattern: short hum, pause, heavy hit (works on Android devices)
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 300]);
    }

    // Trigger visual screen shake on the card
    questCard.classList.add('shake-impact');
    setTimeout(() => questCard.classList.remove('shake-impact'), 400);

    // 3. Process Economy & Logic
    playerStats.stamina -= WORKOUT_COST;
    
    // Determine reward: Base reward, with a small chance for a critical bonus
    const isBonus = Math.random() < 0.15; // 15% chance for a great workout bonus
    const coinsEarned = isBonus ? BONUS_REWARD : BASE_REWARD;
    
    playerStats.coins += coinsEarned;

    // 4. Update UI
    coinDisplay.innerText = playerStats.coins;
    staminaVal.innerText = `${playerStats.stamina}/100`;
    staminaFill.style.width = `${playerStats.stamina}%`;

    // Visual feedback for coins
    btnComplete.innerText = `+${coinsEarned} Coins Earned!`;
    btnComplete.style.backgroundColor = "#ccff00"; // Flash volt green
    
    setTimeout(() => {
        btnComplete.innerText = "Complete Workout";
        btnComplete.style.backgroundColor = "#ffffff";
    }, 2000);
});
