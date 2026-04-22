const timerModeBtn = document.getElementById("timerModeBtn");
const stopwatchModeBtn = document.getElementById("stopwatchModeBtn");
const timerPanel = document.getElementById("timerPanel");
const stopwatchPanel = document.getElementById("stopwatchPanel");

const minutesInput = document.getElementById("minutesInput");
const secondsInput = document.getElementById("secondsInput");
const timerDisplay = document.getElementById("timerDisplay");
const startTimerBtn = document.getElementById("startTimerBtn");
const pauseTimerBtn = document.getElementById("pauseTimerBtn");
const resetTimerBtn = document.getElementById("resetTimerBtn");

const stopwatchDisplay = document.getElementById("stopwatchDisplay");
const startStopwatchBtn = document.getElementById("startStopwatchBtn");
const pauseStopwatchBtn = document.getElementById("pauseStopwatchBtn");
const resetStopwatchBtn = document.getElementById("resetStopwatchBtn");

let timerInterval = null;
let initialTimerSeconds = getInputTotalSeconds();
let remainingTimerSeconds = initialTimerSeconds;

let stopwatchInterval = null;
let stopwatchElapsedMs = 0;
let stopwatchStartTime = 0;

function switchMode(mode) {
    const timerActive = mode === "timer";

    timerModeBtn.classList.toggle("active", timerActive);
    stopwatchModeBtn.classList.toggle("active", !timerActive);
    timerPanel.classList.toggle("active", timerActive);
    stopwatchPanel.classList.toggle("active", !timerActive);
}

function normalizeTimerInputs() {
    const minutes = Math.max(0, Math.min(99, Number(minutesInput.value) || 0));
    let seconds = Math.max(0, Number(secondsInput.value) || 0);

    const extraMinutes = Math.floor(seconds / 60);
    seconds %= 60;

    const normalizedMinutes = Math.min(99, minutes + extraMinutes);

    minutesInput.value = normalizedMinutes;
    secondsInput.value = seconds;
}

function getInputTotalSeconds() {
    const minutes = Math.max(0, Number(minutesInput.value) || 0);
    const seconds = Math.max(0, Number(secondsInput.value) || 0);
    return (minutes * 60) + seconds;
}

function formatTimer(seconds) {
    const minutesPart = Math.floor(seconds / 60);
    const secondsPart = seconds % 60;

    return `${String(minutesPart).padStart(2, "0")}:${String(secondsPart).padStart(2, "0")}`;
}

function renderTimer() {
    timerDisplay.textContent = formatTimer(remainingTimerSeconds);
}

function syncTimerFromInputs() {
    normalizeTimerInputs();
    initialTimerSeconds = getInputTotalSeconds();
    remainingTimerSeconds = initialTimerSeconds;
    renderTimer();
}

function startTimer() {
    if (timerInterval || remainingTimerSeconds <= 0) {
        return;
    }

    timerInterval = setInterval(() => {
        if (remainingTimerSeconds > 0) {
            remainingTimerSeconds -= 1;
            renderTimer();
        }

        if (remainingTimerSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            renderTimer();
        }
    }, 1000);
}

function pauseTimer() {
    if (!timerInterval) {
        return;
    }

    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    pauseTimer();
    syncTimerFromInputs();
}

function formatStopwatch(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const hundredths = Math.floor((milliseconds % 1000) / 10);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
}

function renderStopwatch() {
    stopwatchDisplay.textContent = formatStopwatch(stopwatchElapsedMs);
}

function startStopwatch() {
    if (stopwatchInterval) {
        return;
    }

    stopwatchStartTime = Date.now() - stopwatchElapsedMs;

    stopwatchInterval = setInterval(() => {
        stopwatchElapsedMs = Date.now() - stopwatchStartTime;
        renderStopwatch();
    }, 10);
}

function pauseStopwatch() {
    if (!stopwatchInterval) {
        return;
    }

    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
}

function resetStopwatch() {
    pauseStopwatch();
    stopwatchElapsedMs = 0;
    renderStopwatch();
}

timerModeBtn.addEventListener("click", () => switchMode("timer"));
stopwatchModeBtn.addEventListener("click", () => switchMode("stopwatch"));

minutesInput.addEventListener("input", syncTimerFromInputs);
secondsInput.addEventListener("input", syncTimerFromInputs);

startTimerBtn.addEventListener("click", startTimer);
pauseTimerBtn.addEventListener("click", pauseTimer);
resetTimerBtn.addEventListener("click", resetTimer);

startStopwatchBtn.addEventListener("click", startStopwatch);
pauseStopwatchBtn.addEventListener("click", pauseStopwatch);
resetStopwatchBtn.addEventListener("click", resetStopwatch);

renderTimer();
renderStopwatch();
