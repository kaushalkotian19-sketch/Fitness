// ==========================================
// 1. DOM ELEMENTS
// ==========================================
// Dashboard Elements
const btnStartQuest = document.getElementById('btn-complete-workout');
const questCard = document.getElementById('active-quest');
const coinDisplay = document.getElementById('coin-val');
const staminaFill = document.querySelector('.stamina-fill');
const staminaVal = document.getElementById('stamina-val');

// Player Elements
const workoutPlayer = document.getElementById('workout-player');
const btnQuit = document.getElementById('btn-quit');
const btnNext = document.getElementById('btn-next-exercise');
const exTimer = document.getElementById('exercise-timer');
const exName = document.getElementById('exercise-name');
const exType = document.getElementById('exercise-type');
const exCounter = document.getElementById('exercise-counter');
const exProgress = document.getElementById('workout-progress');

// ==========================================
// 2. GAME STATE & ECONOMY
// ==========================================
let playerStats = { coins: 240, stamina: 100 };
const WORKOUT_COST = 20;

// ==========================================
// 3. WORKOUT DATA
// ==========================================
const routine = [
    { name: "Jumping Jacks", type: "Warmup", duration: 30 },
    { name: "Pushups", type: "Strength", duration: 45 },
    { name: "Mountain Climbers", type: "Cardio", duration: 30 },
    { name: "Plank", type: "Core", duration: 60 }
];

let currentExerciseIndex = 0;
let timerInterval;

// ==========================================
// 4. WORKOUT PLAYER LOGIC
// ==========================================

// Launch the Player
btnStartQuest.addEventListener('click', () => {
    if (playerStats.stamina < WORKOUT_COST) {
        alert("Not enough stamina! Rest to recharge.");
        return;
    }
    
    currentExerciseIndex = 0;
    workoutPlayer.classList.remove('hidden');
    loadExercise(currentExerciseIndex);
});

// Quit Workout (No rewards given)
btnQuit.addEventListener('click', () => {
    clearInterval(timerInterval);
    workoutPlayer.classList.add('hidden');
});

// Load Specific Exercise
function loadExercise(index) {
    const exercise = routine[index];
    
    exName.innerText = exercise.name;
    exType.innerText = exercise.type;
    exCounter.innerText = `${index + 1} / ${routine.length}`;
    exProgress.style.width = `${((index + 1) / routine.length) * 100}%`;
    
    startTimer(exercise.duration);

    if (index === routine.length - 1) {
        btnNext.innerText = "Finish & Claim Reward";
        btnNext.style.backgroundColor = "#ccff00"; // Highlight final button
        btnNext.style.color = "#000";
    } else {
        btnNext.innerText = "Next Exercise";
        btnNext.style.backgroundColor = "#ffffff";
    }
}

// Simple Timer Logic
function startTimer(seconds) {
    clearInterval(timerInterval);
    let timeLeft = seconds;
    
    exTimer.innerText = formatTime(timeLeft);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        exTimer.innerText = formatTime(timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (navigator.vibrate) navigator.vibrate(200); // Small haptic on timer end
        }
    }, 1000);
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// Next / Finish Button Logic
btnNext.addEventListener('click', () => {
    if (currentExerciseIndex < routine.length - 1) {
        currentExerciseIndex++;
        loadExercise(currentExerciseIndex);
    } else {
        finishWorkout();
    }
});

// ==========================================
// 5. RPG REWARD SYSTEM
// ==========================================
function finishWorkout() {
    clearInterval(timerInterval);
    workoutPlayer.classList.add('hidden');

    // Heavy haptic feedback on completion
    if (navigator.vibrate) navigator.vibrate([100, 50, 300]);

    questCard.classList.add('shake-impact');
    setTimeout(() => questCard.classList.remove('shake-impact'), 400);

    // Apply strict economy rules
    playerStats.stamina -= WORKOUT_COST;
    const isBonus = Math.random() < 0.15;
    const coinsEarned = isBonus ? 12 : 4; 
    playerStats.coins += coinsEarned;

    // Update Dashboard UI
    coinDisplay.innerText = playerStats.coins;
    staminaVal.innerText = `${playerStats.stamina}/100`;
    staminaFill.style.width = `${playerStats.stamina}%`;

    btnStartQuest.innerText = `+${coinsEarned} Coins Earned!`;
    btnStartQuest.style.backgroundColor = "#ccff00";
    btnStartQuest.style.color = "#000";
    
    setTimeout(() => {
        btnStartQuest.innerText = "Complete Workout";
        btnStartQuest.style.backgroundColor = "#ffffff";
    }, 2500);
}
