// JavaScript dla strony My Training - Kalendarz miesiąca i widok tygodniowy

let currentDate = new Date(2026, 3, 12); // 12 kwietnia 2026
let currentView = "month"; // "month" lub "week"
let currentTrainingMode = "group"; // "group" lub "individual"
let userTrainings = JSON.parse(localStorage.getItem("userTrainings")) || {}; // Przechowuj treningi jako {data: {godzina, nazwa}}

// Konfiguracja zajęć grupowych
const GROUP_TRAINING_CONFIG = {
    days: [1, 3, 5], // Poniedziałek (1), Środa (3), Piątek (5)
    times: ["09:00", "17:00"] // 09:00-10:30, 17:00-18:30 (godziny startowe)
};

// Mapy zdjęć treningów (mapuj nazwę do ścieżki obrazu)
const trainingImages = {
    "BikeRoom": "images/bikeroom.png",
    "CrossFit": "images/crossfit.png",
    "Gym": "images/gym.png",
    "DanceFit": "images/dance.png",
    "Yoga": "images/yoga.png",
    "Stretching": "images/stretching.png"
};

// Funkcja do obliczenia czasu zakończenia treningu
function getEndTime(startTime) {
    const [hours, minutes] = startTime.split(":").map(Number);
    const endHours = hours + 1;
    const endMinutes = minutes + 30;
    
    if (endMinutes >= 60) {
        return String(endHours + 1).padStart(2, '0') + ":30";
    } else {
        return String(endHours).padStart(2, '0') + ":30";
    }
}

// Funkcja do generowania kalendarza miesiąca
function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Zdobądź pierwszy dzień miesiąca
    const firstDay = new Date(year, month, 1).getDay();
    // Zdobądź liczbę dni w miesiącu
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Zdobądź liczbę dni z poprzedniego miesiąca do wyświetlenia
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const calendarGrid = document.getElementById("calendarGrid");
    calendarGrid.innerHTML = ""; // Wyczyść poprzedni kalendarz
    calendarGrid.classList.remove("week-view");
    
    // Dni z poprzedniego miesiąca
    const prevMonthStart = firstDay === 0 ? 6 : firstDay - 1; // Poniedziałek = 0
    for (let i = prevMonthStart - 1; i >= 0; i--) {
        const dayDiv = document.createElement("div");
        dayDiv.className = "calendar-day other-month";
        dayDiv.innerHTML = `<div class="day-number">${daysInPrevMonth - i}</div>`;
        calendarGrid.appendChild(dayDiv);
    }
    
    // Dni bieżącego miesiąca
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement("div");
        dayDiv.className = "calendar-day";
        
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const trainingsOnDay = userTrainings[dateStr] || [];
        
        let html = `<div class="day-number">${i}</div>`;
        
        // Pokaż treningi na dzień
        if (trainingsOnDay.length > 0) {
            html += `<div style="font-size: 12px; color: var(--green); margin-top: 4px;">`;
            trainingsOnDay.forEach((t, idx) => {
                const modeLabel = t.mode === "group" ? "GROUP" : "IND";
                const modeColor = t.mode === "group" ? "#ffb84d" : "#8beaff";
                html += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
                    <div style="flex: 1;">
                        <div style="font-size: 12px; color: ${modeColor}; font-weight: bold;">${modeLabel}</div>
                        <span>${t.name} ${t.time}</span>
                    </div>
                    <button class="remove-training-btn" data-date="${dateStr}" data-index="${idx}" style="background: none; border: none; color: #ff6b6b; cursor: pointer; font-weight: bold; padding: 0 4px;">×</button>
                </div>`;
            });
            html += `</div>`;
        }
        
        // Sprawdzenie czy to dzisiaj
        if (year === today.getFullYear() && 
            month === today.getMonth() && 
            i === today.getDate()) {
            dayDiv.classList.add("today");
        }
        
        dayDiv.innerHTML = html;
        calendarGrid.appendChild(dayDiv);
        
        // Dodaj event listenery do przycisków usuwania
        const removeButtons = dayDiv.querySelectorAll(".remove-training-btn");
        removeButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const date = btn.getAttribute("data-date");
                const index = parseInt(btn.getAttribute("data-index"));
                removeTraining(date, index);
            });
        });
    }
    
    // Dni z następnego miesiąca
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells; // 6 tygodni × 7 dni
    for (let i = 1; i <= remainingCells; i++) {
        const dayDiv = document.createElement("div");
        dayDiv.className = "calendar-day other-month";
        dayDiv.innerHTML = `<div class="day-number">${i}</div>`;
        calendarGrid.appendChild(dayDiv);
    }
    
    // Zaktualizuj tytuł miesiąca
    updateMonthTitle();
}

// Funkcja do generowania widoku tygodniowego
function generateWeekView() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = currentDate.getDate();
    
    // Znajdź poniedziałek bieżącego tygodnia
    const currentDay = new Date(year, month, date);
    const dayOfWeek = currentDay.getDay();
    const diff = currentDay.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    const mondayDate = new Date(year, month, diff);
    
    const calendarGrid = document.getElementById("calendarGrid");
    calendarGrid.innerHTML = "";
    calendarGrid.classList.add("week-view");
    
    // Generuj dni od poniedziałku do niedzieli
    const today = new Date();
    const weekDayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    for (let i = 0; i < 7; i++) {
        const dayDate = new Date(mondayDate);
        dayDate.setDate(dayDate.getDate() + i);
        
        const dayDiv = document.createElement("div");
        dayDiv.className = "calendar-day";
        
        // Sprawdzenie czy to dzisiaj
        if (dayDate.getFullYear() === today.getFullYear() && 
            dayDate.getMonth() === today.getMonth() && 
            dayDate.getDate() === today.getDate()) {
            dayDiv.classList.add("today");
        }
        
        const dayNumber = dayDate.getDate();
        const monthName = getMonthName(dayDate.getMonth());
        const Year = dayDate.getFullYear();
        const dateStr = `${Year}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
        const trainingsOnDay = userTrainings[dateStr] || [];
        
        let html = `
            <div class="day-number">${weekDayNames[i]}</div>
            <div style="font-size: 14px; color: #999; margin-bottom: 10px;">${dayNumber} ${monthName}</div>
        `;
        
        if (trainingsOnDay.length > 0) {
            html += `<div style="font-size: 13px; color: var(--green);">`;
            trainingsOnDay.forEach((t, idx) => {
                const modeLabel = t.mode === "group" ? "GROUP" : "IND";
                const modeColor = t.mode === "group" ? "#ffb84d" : "#8beaff";
                html += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <div>
                        <div style="font-size: 11px; color: ${modeColor}; font-weight: bold;">${modeLabel}</div>
                        <div>${t.name}</div>
                        <div style="color: #999; font-size: 12px;">${t.time}</div>
                    </div>
                    <button class="remove-training-btn" data-date="${dateStr}" data-index="${idx}" style="background: none; border: none; color: #ff6b6b; cursor: pointer; font-weight: bold; padding: 0 4px; font-size: 18px;">×</button>
                </div>`;
            });
            html += `</div>`;
        }
        
        dayDiv.innerHTML = html;
        calendarGrid.appendChild(dayDiv);
        
        // Dodaj event listenery do przycisków usuwania
        const removeButtons = dayDiv.querySelectorAll(".remove-training-btn");
        removeButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const date = btn.getAttribute("data-date");
                const index = parseInt(btn.getAttribute("data-index"));
                removeTraining(date, index);
            });
        });
    }
    
    updateWeekTitle();
}

// Funkcja do aktualizacji tytułu miesiąca
function updateMonthTitle() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const currentMonthElement = document.getElementById("currentMonth");
    currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
}

// Funkcja do aktualizacji tytułu tygodnia
function updateWeekTitle() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = currentDate.getDate();
    
    const currentDay = new Date(year, month, date);
    const dayOfWeek = currentDay.getDay();
    const diff = currentDay.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    const mondayDate = new Date(year, month, diff);
    const sundayDate = new Date(mondayDate);
    sundayDate.setDate(sundayDate.getDate() + 6);
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    
    const currentMonthElement = document.getElementById("currentMonth");
    currentMonthElement.textContent = `${mondayDate.getDate()} - ${sundayDate.getDate()} ${monthNames[sundayDate.getMonth()]} ${sundayDate.getFullYear()}`;
}

// Funkcja do zwrócenia nazwy miesiąca
function getMonthName(monthIndex) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    return monthNames[monthIndex];
}

// Obsługa przycisków widoku
document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelectorAll(".view-btn").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        
        currentView = e.target.dataset.view;
        const trainingCalendar = document.querySelector(".training-calendar");
        
        if (currentView === "month") {
            trainingCalendar.classList.remove("week-mode");
            // Ustaw na bieżący miesiąc
            currentDate = new Date();
            generateCalendar();
        } else {
            trainingCalendar.classList.add("week-mode");
            // Ustaw na bieżący tydzień
            currentDate = new Date();
            generateWeekView();
        }
    });
});

// Obsługa przycisków nawigacji
document.querySelector(".prev-btn").addEventListener("click", () => {
    if (currentView === "month") {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar();
    } else {
        currentDate.setDate(currentDate.getDate() - 7);
        generateWeekView();
    }
});

document.querySelector(".next-btn").addEventListener("click", () => {
    if (currentView === "month") {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar();
    } else {
        currentDate.setDate(currentDate.getDate() + 7);
        generateWeekView();
    }
});
// Funkcja do usuwania treningu
function removeTraining(date, index) {
    if (userTrainings[date]) {
        userTrainings[date].splice(index, 1);
        
        // Jeśli brak treningów na dany dzień, usuń wpis
        if (userTrainings[date].length === 0) {
            delete userTrainings[date];
        }
        
        localStorage.setItem("userTrainings", JSON.stringify(userTrainings));
        
        // Odśwież kalendarz
        if (currentView === "month") {
            generateCalendar();
        } else {
            generateWeekView();
        }
    }
}
// Generuj kalendarz przy załadowaniu
generateCalendar();


