const menuLinks = document.querySelectorAll(".menu-link");

// Zmienia aktywny element w gornym menu po kliknieciu.
menuLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");

        // Dla pustych linkow blokuje przejscie na inna strone.
        if (!href || href === "#") {
            event.preventDefault();
        }

        // Usuwa aktywny styl z poprzedniej zakladki i ustawia nowa.
        menuLinks.forEach((item) => item.classList.remove("active"));
        link.classList.add("active");
    });
});

// Mapy zdjęć dla treningów
const trainingImages = {
    "BikeRoom": "images/bikeroom.png",
    "CrossFit": "images/crossfit.png",
    "Gym": "images/gym.png",
    "DanceFit": "images/dance.png",
    "Yoga": "images/yoga.png",
    "Stretching": "images/stretching.png"
};

// Konfiguracja zajęć grupowych
const GROUP_TRAINING_CONFIG = {
    days: [1, 3, 5], // PN, ŚR, PT (0 = niedziela)
    times: ["09:00", "17:00"]
};

// Przechowaj dane bieżącego treningu
let currentBookingTraining = {
    name: null,
    type: null,
    selectedDate: null,
    selectedTime: null
};

// Obsługa klikania na karty treningów
const trainingCards = document.querySelectorAll(".training-card");

trainingCards.forEach((card) => {
    card.addEventListener("click", () => {
        const trainingName = card.getAttribute("data-training");
        const trainingType = card.getAttribute("data-type");
        
        // Wyświetl modal z zdjęciem
        showTrainingModal(trainingName, trainingType);
    });
});

// Funkcja wyświetlania modalu
function showTrainingModal(trainingName, trainingType) {
    const modal = document.getElementById("trainingBookingModal");
    const bookingImage = document.getElementById("bookingImage");
    const bookingTrainingName = document.getElementById("bookingTrainingName");
    const bookingBody = document.getElementById("bookingBody");
    
    // Ustaw dane treningu
    currentBookingTraining.name = trainingName;
    currentBookingTraining.type = trainingType;
    
    // Ustaw zdjęcie treningu jako tło
    const imagePath = trainingImages[trainingName] || "images/default.png";
    bookingImage.style.backgroundImage = `url('${imagePath}')`;
    
    // Ustaw nazwę treningu
    bookingTrainingName.textContent = trainingName;
    
    // Wyczyść poprzednie wiadomości o błędzie
    const errorPanel = document.getElementById("bookingError");
    errorPanel.style.display = "none";
    errorPanel.textContent = "";
    
    // Wygeneruj formularz
    bookingBody.innerHTML = generateBookingForm(trainingType);
    
    // Dodaj event listenery do elementów formularza
    setupFormListeners(trainingType);
    
    // Pokaż modal
    modal.style.display = "flex";
    
    // Zachowaj dane treningu
    localStorage.setItem("selectedTraining", trainingName);
    localStorage.setItem("selectedTrainingType", trainingType);
}

// Generuj formularz do rezerwacji
function generateBookingForm(trainingType) {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    let html = `
        <form class="booking-form">
    `;
    
    // Sekcja dla zajęć grupowych
    if (trainingType === "group") {
        html += `
            <div class="group-training-section">
                <h3>Group Training Schedule</h3>
                <div class="day-columns">
                    <div class="day-column">
                        <div class="day-name">Monday</div>
                        <div class="day-times" data-day="1">
                            <!-- Przyciski będą wygenerowane w setupFormListeners -->
                        </div>
                    </div>
                    <div class="day-column">
                        <div class="day-name">Wednesday</div>
                        <div class="day-times" data-day="3">
                            <!-- Przyciski będą wygenerowane w setupFormListeners -->
                        </div>
                    </div>
                    <div class="day-column">
                        <div class="day-name">Friday</div>
                        <div class="day-times" data-day="5">
                            <!-- Przyciski będą wygenerowane w setupFormListeners -->
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="training-section-divider"></div>
        `;
    }
    
    // Sekcja dla zajęć indywidualnych
    html += `
        <div class="individual-training-section">
            <h3>${trainingType === "group" ? "Or Book Individual Training" : "Select Your Training"}</h3>
            <div class="individual-form-group">
                <div class="form-group">
                    <label for="individualDate">Date</label>
                    <input type="date" id="individualDate" min="${todayString}">
                </div>
                <div class="form-group">
                    <label for="individualTime">Time</label>
                    <select id="individualTime">
                        <option value="">-- Select time --</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    
    html += `
        <button type="submit" class="booking-submit">Book Training</button>
    </form>
    `;
    
    return html;
}

// Setup listenery dla formularza
function setupFormListeners(trainingType) {
    const form = document.querySelector(".booking-form");
    const individualDateInput = document.getElementById("individualDate");
    const individualTimeSelect = document.getElementById("individualTime");
    
    // Ustaw dzisiejszą datę jako domyślną dla zajęć indywidualnych
    const today = new Date();
    if (individualDateInput) {
        individualDateInput.valueAsDate = today;
    }
    
    // Dla zajęć grupowych - wygeneruj przyciski dla 3 dni
    if (trainingType === "group") {
        generateGroupTrainingDays();
        
        // Gdy się zmieni data indywidualnych zajęć, odśwież czasy
        if (individualDateInput) {
            individualDateInput.addEventListener("change", () => {
                updateIndividualTimes();
            });
        }
        
        // Generuj czasy dla dzisiejszej daty indywidualnych
        updateIndividualTimes();
    } else {
        // Dla samych indywidualnych zajęć
        if (individualDateInput) {
            individualDateInput.addEventListener("change", () => {
                updateIndividualTimes();
            });
        }
        updateIndividualTimes();
    }
    
    // Obsługa submit formularza
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        submitBooking(trainingType);
    });
}

// Generuj przyciski dla 3 dni zajęć grupowych
function generateGroupTrainingDays() {
    const today = new Date();
    const dayColumns = document.querySelectorAll(".day-column");
    
    dayColumns.forEach(column => {
        const dayOfWeek = parseInt(column.querySelector(".day-times").dataset.day);
        const dayTimesContainer = column.querySelector(".day-times");
        dayTimesContainer.innerHTML = "";
        
        // Znajdź następną datę dla tego dnia tygodnia
        const nextDate = getNextDateForDay(today, dayOfWeek);
        
        // Dodaj przyciski dla dwóch godzin
        GROUP_TRAINING_CONFIG.times.forEach(time => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "day-time-button";
            button.dataset.time = time;
            button.dataset.date = nextDate.toISOString().split('T')[0];
            
            const endTime = getEndTime(time);
            button.textContent = `${time} - ${endTime}`;
            
            button.addEventListener("click", (e) => {
                e.preventDefault();
                selectGroupTraining(button);
            });
            
            dayTimesContainer.appendChild(button);
        });
    });
}

// Znajdź następną datę dla danego dnia tygodnia
function getNextDateForDay(fromDate, targetDay) {
    const date = new Date(fromDate);
    const daysDifference = (targetDay - date.getDay() + 7) % 7;
    
    if (daysDifference === 0 && date.getHours() > 0) {
        // Jeśli to dzisiaj, ale już po godzinach, przejdź na następny tydzień
        date.setDate(date.getDate() + 7);
    } else {
        date.setDate(date.getDate() + daysDifference);
    }
    
    return date;
}

// Zaznacz wybrane zajęcia grupowe
function selectGroupTraining(button) {
    const allButtons = document.querySelectorAll(".day-time-button");
    allButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    
    currentBookingTraining.selectedDate = button.dataset.date;
    currentBookingTraining.selectedTime = button.dataset.time;
}

// Aktualizuj dostępne czasy dla zajęć indywidualnych
function updateIndividualTimes() {
    const timeSelect = document.getElementById("individualTime");
    if (!timeSelect) return;
    
    timeSelect.innerHTML = '<option value="">-- Select time --</option>';
    
    // Dla zajęć indywidualnych - wszystkie godziny od 06:00 do 21:00
    for (let hour = 6; hour < 22; hour++) {
        const timeString = String(hour).padStart(2, '0') + ":00";
        const option = document.createElement("option");
        option.value = timeString;
        option.textContent = timeString;
        timeSelect.appendChild(option);
    }
}

// Aktualizuj dostępne godziny w zależności od daty
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

// Zatwierdź rezerwację
function submitBooking(trainingType) {
    let selectedDate, selectedTime;
    
    // Sprawdź czy wybrano zajęcia grupowe
    const selectedButton = document.querySelector(".day-time-button.active");
    
    if (selectedButton) {
        // Jeśli wybrano zajęcia grupowe, użyj tych danych
        selectedDate = selectedButton.dataset.date;
        selectedTime = selectedButton.dataset.time;
    } else if (trainingType === "group") {
        // Dla zajęć grupowych - przycisk musi być wybrany
        showBookingError("Please select a group training time");
        return;
    } else {
        // Dla indywidualnych - pobierz z pól formularza
        selectedDate = document.getElementById("individualDate").value;
        selectedTime = document.getElementById("individualTime").value;
    }
    
    // Walidacja
    if (!selectedDate) {
        showBookingError("Please select a date");
        return;
    }
    
    if (!selectedTime) {
        showBookingError("Please select a time");
        return;
    }
    
    // Sprawdź czy data nie jest w przeszłości
    const selectedDateObj = new Date(selectedDate + "T00:00");
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    if (selectedDateObj < now) {
        showBookingError("You cannot book training in the past");
        return;
    }
    
    // Utwórz rezerwację
    const booking = {
        name: currentBookingTraining.name,
        time: selectedTime,
        mode: currentBookingTraining.type
    };
    
    // Pobierz poprzednie rezerwacje lub utwórz nowy obiekt
    let userTrainings = JSON.parse(localStorage.getItem("userTrainings")) || {};
    
    // Init tablica dla danego dnia jeśli nie istnieje
    if (!userTrainings[selectedDate]) {
        userTrainings[selectedDate] = [];
    }
    
    // Sprawdzić czy nie ma już rezerwacji na tę godzinę
    const timeConflict = userTrainings[selectedDate].some(t => t.time === selectedTime);
    if (timeConflict) {
        showBookingError("You already have a training at this time");
        return;
    }
    
    // Dodaj rezerwację
    userTrainings[selectedDate].push(booking);
    localStorage.setItem("userTrainings", JSON.stringify(userTrainings));
    
    // Zamknij modal
    const modal = document.getElementById("trainingBookingModal");
    modal.style.display = "none";
    
    // Wyczyść dane
    currentBookingTraining = {
        name: null,
        type: null,
        selectedDate: null,
        selectedTime: null
    };
}

// Wyświetl błąd
function showBookingError(message) {
    const errorPanel = document.getElementById("bookingError");
    errorPanel.textContent = message;
    errorPanel.style.display = "block";
}

// Zamknięcie modalu
document.getElementById("closeBooking").addEventListener("click", () => {
    const modal = document.getElementById("trainingBookingModal");
    modal.style.display = "none";
});

// Zamknięcie modalu po kliknieciu na overlay
document.querySelector(".booking-overlay").addEventListener("click", () => {
    const modal = document.getElementById("trainingBookingModal");
    modal.style.display = "none";
});
