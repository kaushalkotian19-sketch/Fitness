// ==========================================
// 1. DOM ELEMENTS
// ==========================================
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view-section');

// Economy & Stats
const coinDisplay = document.getElementById('coin-val');
const staminaVal = document.getElementById('stamina-val');
const statWorkouts = document.getElementById('stat-workouts');
const statKcal = document.getElementById('stat-kcal');
const statMinutes = document.getElementById('stat-minutes');
const goalVal = document.getElementById('goal-val');
const streakVal = document.getElementById('streak-val');

// Modal Elements
const modalOverlay = document.getElementById('modal-overlay');
const weightModal = document.getElementById('weight-modal');
const btnOpenWeight = document.getElementById('btn-open-weight');
const btnCloseWeight = document.getElementById('btn-close-weight');
const btnSaveWeight = document.getElementById('btn-save-weight');
const weightInput = document.getElementById('weight-input');
const currentWeightDisplay = document.getElementById('current-weight');

// Player Elements
const workoutPlayer = document.getElementById('workout-player');
const btnQuit = document.getElementById('btn-quit');
const btnNext = document.getElementById('btn-next-exercise');
const exTimer = document.getElementById('exercise-timer');
const exName = document.getElementById('exercise-name');
const exType = document.getElementById('exercise-type');
const exCounter = document.getElementById('exercise-counter');
const exProgress = document.getElementById('workout-progress');
const startButtons = document.querySelectorAll('.start-workout-btn');

// ==========================================
// 2. STATE & WORKOUT DATABASE
// ==========================================
let playerStats = { 
    coins: 240, stamina: 100, 
    workoutsCompleted: 0, kcalBurned: 0, minutesTrained: 0,
    streak: 0, hasWorkedOutToday: false
};
const WORKOUT_COST = 20;

const workoutLibrary = {
    fullbody: [
        { name: "Jumping Jacks", type: "Warmup", duration: 30, kcal: 5 },
        { name: "Pushups", type: "Strength", duration: 45, kcal: 8 },
        { name: "Squats", type: "Lower Body", duration: 45, kcal: 7 }
    ],
    core: [
        { name: "Crunches", type: "Core", duration: 30, kcal: 4 },
        { name: "Plank", type: "Core", duration: 60, kcal: 6 },
        { name: "Bicycle Kicks", type: "Core", duration: 45, kcal: 5 }
    ],
    hiit: [
        { name: "High Knees", type: "Cardio", duration: 30, kcal: 10 },
        { name: "Burpees", type: "Cardio", duration: 45, kcal: 15 },
        { name: "Mountain Climbers", type: "Cardio", duration: 30, kcal: 8 }
    ],
    upper: [
        { name: "Diamond Pushups", type: "Strength", duration: 40, kcal: 7 },
        { name: "Plank Taps", type: "Strength", duration: 40, kcal: 6 },
        { name: "Pike Pushups", type: "Strength", duration: 40, kcal: 8 }
    ]
};

let currentRoutine = [];
let currentExerciseIndex = 0;
let timerInterval;

// ==========================================
// 3. DYNAMIC CALENDAR LOGIC
// ==========================================
function generateCalendar() {
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
    
    // Find the Sunday of this week
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDayOfWeek);
    
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    let calendarHTML = '';

    for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        
        const dateNum = d.getDate();
        const isActive = (i === currentDayOfWeek) ? 'active' : '';
        const isCompleted = (isActive && playerStats.hasWorkedOutToday) ? 'completed' : ''; // For green checkmarks later

        calendarHTML += `
            <div class="day ${isActive} ${isCompleted}" id="day-${i}">
                <span>${days[i]}</span>
                <span>${dateNum}</span>
            </div>
        `;
    }

    document.getElementById('home-calendar').innerHTML = calendarHTML;
    document.getElementById('report-calendar').innerHTML = calendarHTML;
}
generateCalendar();

// ==========================================
// 4. BOTTOM NAVIGATION
// ==========================================
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        views.forEach(view => view.classList.add('hidden'));
        
        item.classList.add('active');
        document.getElementById(item.getAttribute('data-target')).classList.remove('hidden');
    });
});

// ==========================================
// 5. WEIGHT MODAL LOGIC
// ==========================================
function closeWeightModal() {
    weightModal.classList.add('hidden');
    modalOverlay.classList.add('hidden');
}

btnOpenWeight.addEventListener('click', () => {
    weightModal.classList.remove('hidden');
    modalOverlay.classList.remove('hidden');
});

btnCloseWeight.addEventListener('click', closeWeightModal);
modalOverlay.addEventListener('click', closeWeightModal);

btnSaveWeight.addEventListener('click', () => {
    const newWeight = parseFloat(weightInput.value).toFixed(1);
    if (!isNaN(newWeight)) {
        currentWeightDisplay.innerText = `${newWeight} lbs`;
        closeWeightModal();
    }
});

// ==========================================
// 6. WORKOUT PLAYER ENGINE
// ==========================================
startButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (playerStats.stamina < WORKOUT_COST) {
            alert("Not enough stamina! Rest to recharge.");
            return;
        }
        
        const routineKey = e.target.getAttribute('data-routine');
        currentRoutine = workoutLibrary[routineKey];
        currentExerciseIndex = 0;
        
        workoutPlayer.classList.remove('hidden');
        loadExercise(currentExerciseIndex);
    });
});

btnQuit.addEventListener('click', () => {
    clearInterval(timerInterval);
    workoutPlayer.classList.add('hidden');
});

function loadExercise(index) {
    const exercise = currentRoutine[index];
    exName.innerText = exercise.name;
    exType.innerText = exercise.type;
    exCounter.innerText = `${index + 1} / ${currentRoutine.length}`;
    exProgress.style.width = `${((index + 1) / currentRoutine.length) * 100}%`;
    
    startTimer(exercise.duration);

    if (index === currentRoutine.length - 1) {
        btnNext.innerText = "Finish & Claim Reward";
        btnNext.style.backgroundColor = "#2563eb"; 
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
    if (currentExerciseIndex < currentRoutine.length - 1) {
        currentExerciseIndex++;
        loadExercise(currentExerciseIndex);
    } else {
        finishWorkout();
    }
});

function finishWorkout() {
    clearInterval(timerInterval);
    workoutPlayer.classList.add('hidden');
    if (navigator.vibrate) navigator.vibrate([100, 50, 300]);

    // Apply Economy Rules
    playerStats.stamina -= WORKOUT_COST;
    const isBonus = Math.random() < 0.15;
    playerStats.coins += (isBonus ? 12 : 4);
    
    // Apply Stat Tracking
    playerStats.workoutsCompleted++;
    
    // Calculate total Kcal and Mins from the specific routine
    let totalSeconds = 0;
    let totalKcal = 0;
    currentRoutine.forEach(ex => {
        totalSeconds += ex.duration;
        totalKcal += ex.kcal;
    });
    
    playerStats.kcalBurned += totalKcal;
    playerStats.minutesTrained += Math.ceil(totalSeconds / 60);
    
    // Apply Streak Logic
    if (!playerStats.hasWorkedOutToday) {
        playerStats.streak++;
        playerStats.hasWorkedOutToday = true;
        goalVal.innerText = playerStats.workoutsCompleted;
    }

    // Update UI DOM
    coinDisplay.innerText = playerStats.coins;
    staminaVal.innerText = playerStats.stamina;
    statWorkouts.innerText = playerStats.workoutsCompleted;
    statKcal.innerText = playerStats.kcalBurned;
    statMinutes.innerText = playerStats.minutesTrained;
    streakVal.innerText = `🔥 ${playerStats.streak}`;

    // Visual Feedback on Calendar (Turn today's circle Green/Blue to show completion)
    const todayIndex = new Date().getDay();
    document.querySelectorAll(`#day-${todayIndex} span:last-child`).forEach(el => {
        el.style.backgroundColor = "#10b981"; // Success Green
    });
}
