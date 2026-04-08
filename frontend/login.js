const loginButton = document.getElementById("loginBtn");
const passwordInput = document.getElementById("password");
const togglePasswordButton = document.getElementById("togglePassword");

// Pokazuje albo ukrywa haslo po kliknieciu w ikone oka.
togglePasswordButton.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePasswordButton.classList.toggle("is-visible", isHidden);
    togglePasswordButton.setAttribute(
        "aria-label",
        isHidden ? "Hide password" : "Show password"
    );
});

// Wysyla dane logowania do backendu.
loginButton.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;

    try {
        // Zapytanie POST do endpointu logowania.
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const text = await response.text();

        // Po poprawnym logowaniu otwiera strone glowna.
        if (response.ok) {
            alert("Pomyslne logowanie");
            window.location.href = "home.html";
        } else {
            alert(text);
        }
    } catch (error) {
        console.error(error);

        // Blad pojawi sie np. gdy serwer jest wylaczony.
        alert("Nie udalo sie wyslac zadania do serwera");
    }
});
