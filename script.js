// ==========================================
// 1. DOM ELEMENTS (Keep existing)
// ==========================================
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view-section');
const coinDisplay = document.getElementById('coin-val');
const staminaVal = document.getElementById('stamina-val');
const statWorkouts = document.getElementById('stat-workouts');
const statKcal = document.getElementById('stat-kcal');
const statMinutes = document.getElementById('stat-minutes');
const goalVal = document.getElementById('goal-val');
const streakVal = document.getElementById('streak-val');
const currentWeightDisplay = document.getElementById('current-weight');
const weightInput = document.getElementById('weight-input');
const workoutPlayer = document.getElementById('workout-player');
const btnQuit = document.getElementById('btn-quit');
const btnNext = document.getElementById('btn-next-exercise');
const exTimer = document.getElementById('exercise-timer');
const exName = document.getElementById('exercise-name');
const exType = document.getElementById('exercise-type');
const exCounter = document.getElementById('exercise-counter');
const exProgress = document.getElementById('workout-progress');
const startButtons = document.querySelectorAll('.start-workout-btn');
const toggleHaptics = document.getElementById('toggle-haptics');
const btnResetData = document.getElementById('btn-reset-data');

// ==========================================
// 2. STATE & MASSIVE WORKOUT LIBRARY
// ==========================================
let playerStats = { 
    coins: 240, stamina: 100, 
    workoutsCompleted: 0, kcalBurned: 0, minutesTrained: 0,
    streak: 0, hasWorkedOutToday: false,
    currentWeight: 105.4, hapticsEnabled: true
};
const WORKOUT_COST = 20;

const workoutLibrary = {
    // Standard Challenges
    fullbody: [
        { name: "Jumping Jacks", type: "Warmup", duration: 30, kcal: 5 },
        { name: "Pushups", type: "Strength", duration: 45, kcal: 8 },
        { name: "Squats", type: "Lower Body", duration: 45, kcal: 7 },
        { name: "Plank", type: "Core", duration: 60, kcal: 6 }
    ],
    // Yoga & Flexibility
    yogaMorning: [
        { name: "Sun Salutations", type: "Yoga", duration: 60, kcal: 4 },
        { name: "Cat-Cow Stretch", type: "Yoga", duration: 45, kcal: 2 },
        { name: "Downward Dog", type: "Yoga", duration: 60, kcal: 5 },
        { name: "Child's Pose", type: "Recovery", duration: 45, kcal: 1 }
    ],
    yogaFlexibility: [
        { name: "Seated Forward Fold", type: "Stretch", duration: 45, kcal: 2 },
        { name: "Pigeon Pose", type: "Stretch", duration: 60, kcal: 3 },
        { name: "Cobra Pose", type: "Stretch", duration: 45, kcal: 2 }
    ],
    // Targeted Warm-Ups
    warmup: [
        { name: "Arm Circles", type: "Warmup", duration: 30, kcal: 2 },
        { name: "Torso Twists", type: "Warmup", duration: 30, kcal: 2 },
        { name: "High Knees", type: "Cardio", duration: 30, kcal: 6 },
        { name: "Jumping Jacks", type: "Cardio", duration: 30, kcal: 5 }
    ],
    // Body Focus - Abs
    absBeginner: [
        { name: "Basic Crunches", type: "Core", duration: 30, kcal: 4 },
        { name: "Heel Touches", type: "Core", duration: 30, kcal: 4 },
        { name: "Plank", type: "Core", duration: 30, kcal: 3 }
    ],
    absIntermediate: [
        { name: "V-Ups", type: "Core", duration: 45, kcal: 8 },
        { name: "Russian Twists", type: "Core", duration: 45, kcal: 7 },
        { name: "Hollow Body Hold", type: "Core", duration: 45, kcal: 6 },
        { name: "Bicycle Crunches", type: "Core", duration: 60, kcal: 10 }
    ],
    // Discover Grid Categories
    core: [
        { name: "Crunches", type: "Core", duration: 30, kcal: 4 },
        { name: "Plank", type: "Core", duration: 60, kcal: 6 }
    ],
    hiit: [
        { name: "High Knees", type: "Cardio", duration: 30, kcal: 10 },
        { name: "Burpees", type: "Cardio", duration: 45, kcal: 15 }
    ],
    upper: [
        { name: "Diamond Pushups", type: "Strength", duration: 40, kcal: 7 },
        { name: "Pike Pushups", type: "Strength", duration: 40, kcal: 8 }
    ]
};

let currentRoutine = [];
let currentExerciseIndex = 0;
let timerInterval;

// ==========================================
// 3. CORE LOGIC (Keep existing save, load, calendar, nav, modal logic)
// ==========================================
function saveData() { localStorage.setItem('fitnessRpgStats', JSON.stringify(playerStats)); }
function loadData() {
    const savedData = localStorage.getItem('fitnessRpgStats');
    if (savedData) playerStats = JSON.parse(savedData);
    
    coinDisplay.innerText = playerStats.coins;
    staminaVal.innerText = playerStats.stamina;
    statWorkouts.innerText = playerStats.workoutsCompleted;
    statKcal.innerText = playerStats.kcalBurned;
    statMinutes.innerText = playerStats.minutesTrained;
    streakVal.innerText = `🔥 ${playerStats.streak}`;
    goalVal.innerText = playerStats.workoutsCompleted;
    currentWeightDisplay.innerText = `${playerStats.currentWeight} lbs`;
    weightInput.value = playerStats.currentWeight;
    toggleHaptics.checked = playerStats.hapticsEnabled;

    if (playerStats.hasWorkedOutToday) {
        const todayIndex = new Date().getDay();
        const activeDayElement = document.querySelector(`#day-${todayIndex} span:last-child`);
        if (activeDayElement) activeDayElement.style.backgroundColor = "#10b981";
    }
}

function generateCalendar() {
    const today = new Date();
    const currentDayOfWeek = today.getDay(); 
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDayOfWeek);
    
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    let calendarHTML = '';
    for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        const isActive = (i === currentDayOfWeek) ? 'active' : '';
        calendarHTML += `<div class="day ${isActive}" id="day-${i}"><span>${days[i]}</span><span>${d.getDate()}</span></div>`;
    }
    document.getElementById('home-calendar').innerHTML = calendarHTML;
    document.getElementById('report-calendar').innerHTML = calendarHTML;
    loadData();
}
generateCalendar();

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        views.forEach(view => view.classList.add('hidden'));
        item.classList.add('active');
        document.getElementById(item.getAttribute('data-target')).classList.remove('hidden');
    });
});

// Settings Logic
toggleHaptics.addEventListener('change', (e) => {
    playerStats.hapticsEnabled = e.target.checked;
    saveData();
    if (playerStats.hapticsEnabled && navigator.vibrate) navigator.vibrate(50);
});
btnResetData.addEventListener('click', () => {
    if (confirm("Wipe save data?")) { localStorage.removeItem('fitnessRpgStats'); window.location.reload(); }
});

// Workout Engine
startButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (playerStats.stamina < WORKOUT_COST) { alert("Not enough stamina! Rest to recharge."); return; }
        // Find the closest parent with the data-routine attribute (since clicks might hit inner elements)
        const targetBtn = e.target.closest('.start-workout-btn');
        const routineKey = targetBtn.getAttribute('data-routine');
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
        btnNext.style.backgroundColor = "#2563eb"; btnNext.style.color = "#ffffff";
    } else {
        btnNext.innerText = "Next Exercise";
        btnNext.style.backgroundColor = "#ffffff"; btnNext.style.color = "#000000";
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
            if (playerStats.hapticsEnabled && navigator.vibrate) navigator.vibrate(200);
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
        currentExerciseIndex++; loadExercise(currentExerciseIndex);
    } else { finishWorkout(); }
});

function finishWorkout() {
    clearInterval(timerInterval);
    workoutPlayer.classList.add('hidden');
    if (playerStats.hapticsEnabled && navigator.vibrate) navigator.vibrate([100, 50, 300]);

    playerStats.stamina -= WORKOUT_COST;
    playerStats.coins += (Math.random() < 0.15 ? 12 : 4);
    playerStats.workoutsCompleted++;
    
    let totalSeconds = 0, totalKcal = 0;
    currentRoutine.forEach(ex => { totalSeconds += ex.duration; totalKcal += ex.kcal; });
    playerStats.kcalBurned += totalKcal;
    playerStats.minutesTrained += Math.ceil(totalSeconds / 60);
    
    if (!playerStats.hasWorkedOutToday) {
        playerStats.streak++;
        playerStats.hasWorkedOutToday = true;
        goalVal.innerText = playerStats.workoutsCompleted;
    }
    saveData();

    coinDisplay.innerText = playerStats.coins;
    staminaVal.innerText = playerStats.stamina;
    statWorkouts.innerText = playerStats.workoutsCompleted;
    statKcal.innerText = playerStats.kcalBurned;
    statMinutes.innerText = playerStats.minutesTrained;
    streakVal.innerText = `🔥 ${playerStats.streak}`;
    const todayIndex = new Date().getDay();
    document.querySelectorAll(`#day-${todayIndex} span:last-child`).forEach(el => el.style.backgroundColor = "#10b981");
}

// Keep existing Weight Modal logic at the bottom of the script
