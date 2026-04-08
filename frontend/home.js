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
