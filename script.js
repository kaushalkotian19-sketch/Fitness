// ==========================================
// 1. DOM ELEMENTS
// ==========================================
// Navigation & Views
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view-section');

// Dashboard Elements
const btnStartQuest = document.getElementById('btn-complete-workout');
const coinDisplay = document.getElementById('coin-val');
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
let playerStats = { 
    coins: 240, 
    stamina: 100
};
const WORKOUT_COST = 20;

// ==========================================
// 3. BOTTOM NAVIGATION LOGIC
// ==========================================
navItems.forEach(item => {
    item.addEventListener('click', () => {
        // 1. Remove active state from all icons
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // 2. Hide all views
        views.forEach(view => view.classList.add('hidden'));
        
        // 3. Add active state to clicked icon
        item.classList.add('active');
        
        // 4. Show the target view
        const targetViewId = item.getAttribute('data-target');
        const targetView = document.getElementById(targetViewId);
        if (targetView) {
            targetView.classList.remove('hidden');
        }
    });
});

// ==========================================
// 4. WORKOUT DATA & PLAYER
// ==========================================
const routine = [
    { name: "Jumping Jacks", type: "Warmup", duration: 30 },
    { name: "Pushups", type: "Strength", duration: 45 },
    { name: "Mountain Climbers", type: "Cardio", duration: 30 },
    { name: "Plank", type: "Core", duration: 60 }
];

let currentExerciseIndex = 0;
let timerInterval;

btnStartQuest.addEventListener('click', () => {
    if (playerStats.stamina < WORKOUT_COST) {
        alert("Not enough stamina! Rest to recharge.");
        return;
    }
    currentExerciseIndex = 0;
    workoutPlayer.classList.remove('hidden');
    loadExercise(currentExerciseIndex);
});

btnQuit.addEventListener('click', () => {
    clearInterval(timerInterval);
    workoutPlayer.classList.add('hidden');
});

function loadExercise(index) {
    const exercise = routine[index];
    exName.innerText = exercise.name;
    exType.innerText = exercise.type;
    exCounter.innerText = `${index + 1} / ${routine.length}`;
    exProgress.style.width = `${((index + 1) / routine.length) * 100}%`;
    
    startTimer(exercise.duration);

    if (index === routine.length - 1) {
        btnNext.innerText = "Finish & Claim Reward";
        btnNext.style.backgroundColor = "#2563eb"; // Match blue theme
        btnNext.style.color = "#ffffff";
    } else {
        btnNext.innerText = "Next Exercise";
        btnNext.style.backgroundColor = "#ffffff";
        btnNext.style.color = "#000000";
    }
}

function startTimer(seconds) {
    clearInterval(timerInterval);
    let timeLeft = seconds;
    exTimer.innerText = formatTime(timeLeft);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        exTimer.innerText = formatTime(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (navigator.vibrate) navigator.vibrate(200);
        }
    }, 1000);
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

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

    if (navigator.vibrate) navigator.vibrate([100, 50, 300]);

    playerStats.stamina -= WORKOUT_COST;
    const isBonus = Math.random() < 0.15;
    const coinsEarned = isBonus ? 12 : 4; 
    playerStats.coins += coinsEarned;

    coinDisplay.innerText = playerStats.coins;
    staminaVal.innerText = playerStats.stamina;

    btnStartQuest.innerText = `+${coinsEarned} Coins Earned!`;
    
    setTimeout(() => {
        btnStartQuest.innerText = "START";
    }, 2500);
}
