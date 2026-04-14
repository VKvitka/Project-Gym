const registerForm = document.getElementById("registerForm");
const registerPasswordInput = document.getElementById("registerPassword");
const repeatPasswordInput = document.getElementById("repeatPassword");

// Ta funkcja podpina przycisk oka do wybranego pola hasla.
function setupPasswordToggle(buttonId, inputElement) {
    const button = document.getElementById(buttonId);

    button.addEventListener("click", () => {
        const isHidden = inputElement.type === "password";
        inputElement.type = isHidden ? "text" : "password";
        button.classList.toggle("is-visible", isHidden);
        button.setAttribute(
            "aria-label",
            isHidden ? "Hide password" : "Show password"
        );
    });
}

// Obsluga pokazywania hasla dla obu pol.
setupPasswordToggle("toggleRegisterPassword", registerPasswordInput);
setupPasswordToggle("toggleRepeatPassword", repeatPasswordInput);

// Wysyla formularz rejestracji do backendu.
registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = registerPasswordInput.value;
    const repeatPassword = repeatPasswordInput.value;

    // Sprawdza, czy wszystkie pola zostaly wypelnione.
    if (!firstName || !lastName || !email || !password || !repeatPassword) {
        alert("Wypelnij wszystkie pola");
        return;
    }

    // Oba hasla musza byc identyczne.
    if (password !== repeatPassword) {
        alert("Hasla nie sa takie same");
        return;
    }

    try {
        // Zapytanie POST do endpointu rejestracji.
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password
            })
        });

        const text = await response.text();

        // Po udanej rejestracji wraca na strone logowania.
        if (response.ok) {
            window.location.href = "login.html";
        } else {
            alert(text);
        }
    } catch (error) {
        console.error(error);

        // Komunikat bledu przy problemie z polaczeniem do serwera.
        alert("Nie udalo sie wyslac zadania do serwera");
    }
});
