const currentUserEmail = localStorage.getItem("currentUserEmail");
const saveProfileButton = document.getElementById("saveProfileBtn");

const profileFields = {
    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    gender: document.getElementById("gender"),
    dateOfBirth: document.getElementById("dateOfBirth"),
    country: document.getElementById("country"),
    city: document.getElementById("city"),
    postalCode: document.getElementById("postalCode"),
    address: document.getElementById("address"),
    phoneNumber: document.getElementById("phoneNumber"),
    email: document.getElementById("email")
};

function fillProfileForm(user) {
    profileFields.firstName.value = user.firstName || "";
    profileFields.lastName.value = user.lastName || "";
    profileFields.gender.value = user.gender || "";
    profileFields.dateOfBirth.value = user.dateOfBirth || "";
    profileFields.country.value = user.country || "";
    profileFields.city.value = user.city || "";
    profileFields.postalCode.value = user.postalCode || "";
    profileFields.address.value = user.address || "";
    profileFields.phoneNumber.value = user.phoneNumber || "";
    profileFields.email.value = user.email || "";
}

async function loadProfile() {
    if (!currentUserEmail) {
        alert("Najpierw zaloguj sie do swojego konta");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`/profile?email=${encodeURIComponent(currentUserEmail)}`);
        const data = await response.json().catch(() => null);

        if (!response.ok || !data) {
            alert("Nie udalo sie wczytac profilu");
            return;
        }

        fillProfileForm(data);
    } catch (error) {
        console.error(error);
        alert("Nie udalo sie pobrac danych profilu");
    }
}

saveProfileButton.addEventListener("click", async () => {
    if (!currentUserEmail) {
        alert("Najpierw zaloguj sie do swojego konta");
        window.location.href = "login.html";
        return;
    }

    const payload = {
        email: currentUserEmail,
        firstName: profileFields.firstName.value.trim(),
        lastName: profileFields.lastName.value.trim(),
        gender: profileFields.gender.value,
        dateOfBirth: profileFields.dateOfBirth.value,
        country: profileFields.country.value.trim(),
        city: profileFields.city.value.trim(),
        postalCode: profileFields.postalCode.value.trim(),
        address: profileFields.address.value.trim(),
        phoneNumber: profileFields.phoneNumber.value.trim()
    };

    try {
        const response = await fetch("/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => null);
        const message = data?.message || "Nie udalo sie zapisac profilu";

        if (!response.ok) {
            alert(message);
            return;
        }

        fillProfileForm(data.user);
        alert("Profil zostal zapisany");
    } catch (error) {
        console.error(error);
        alert("Nie udalo sie zapisac zmian");
    }
});

loadProfile();
