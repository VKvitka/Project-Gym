const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware do obslugi CORS oraz danych JSON z formularzy.
app.use(cors());
app.use(express.json());

// Folder frontend jest udostepniany jako pliki statyczne.
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// Tymczasowa lista uzytkownikow przechowywana w pamieci serwera.
const users = [
  {
    firstName: "Hanna",
    lastName: "Kryhina",
    email: "kryhinahanna@gmail.com",
    password: "123456789"
  }
];

// Otwiera strone startowa aplikacji.
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "login.html"));
});

// Otwiera widok logowania.
app.get("/login", (req, res) => {
  res.sendFile(path.join(frontendPath, "login.html"));
});

// Otwiera widok rejestracji.
app.get("/register", (req, res) => {
  res.sendFile(path.join(frontendPath, "register.html"));
});

// Sprawdza dane logowania przeslane z formularza.
app.post("/login", (req, res) => {
  console.log("POST /login");
  console.log("Body:", req.body);

  const { email, password } = req.body;

  // Oba pola musza byc uzupelnione.
  if (!email || !password) {
    return res.status(400).send("Wpisz email i haslo");
  }

  // Szuka uzytkownika z pasujacym emailem i haslem.
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  // Jesli dane sa niepoprawne, zwraca blad logowania.
  if (!user) {
    return res.status(401).send("Nieprawidlowy email lub haslo");
  }

  res.status(200).send("OK");
});

// Tworzy nowe konto na podstawie danych z formularza rejestracji.
app.post("/register", (req, res) => {
  console.log("POST /register");
  console.log("Body:", req.body);

  const { firstName, lastName, email, password } = req.body;

  // Wszystkie pola sa wymagane.
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send("Wypelnij wszystkie pola");
  }

  // Jeden email moze nalezec tylko do jednego konta.
  const userExists = users.some((user) => user.email === email);

  if (userExists) {
    return res.status(409).send("Ten email jest juz zarejestrowany");
  }

  // Dodaje nowego uzytkownika do tablicy users.
  users.push({
    firstName,
    lastName,
    email,
    password
  });

  res.status(201).send("Rejestracja zakonczona sukcesem");
});

// Uruchamia backend na porcie 3000.
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
