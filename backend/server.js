const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs/promises");

const app = express();
const PORT = 3000;

// Middleware do obslugi CORS oraz danych JSON z formularzy.
app.use(cors());
app.use(express.json());

// Folder frontend jest udostepniany jako pliki statyczne.
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// Plik JSON przechowuje zarejestrowanych uzytkownikow.
const usersFilePath = path.join(__dirname, "users.json");

// Odczytuje liste uzytkownikow z pliku users.json.
async function readUsers() {
  try {
    const fileContent = await fs.readFile(usersFilePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

// Zapisuje zaktualizowana liste uzytkownikow do pliku users.json.
async function writeUsers(users) {
  await fs.writeFile(
    usersFilePath,
    JSON.stringify(users, null, 2),
    "utf-8"
  );
}

function createUserRecord(data) {
  return {
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    password: data.password || "",
    gender: data.gender || "",
    dateOfBirth: data.dateOfBirth || "",
    country: data.country || "",
    city: data.city || "",
    postalCode: data.postalCode || "",
    address: data.address || "",
    phoneNumber: data.phoneNumber || ""
  };
}

function sanitizeProfile(user) {
  return {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    gender: user.gender || "",
    dateOfBirth: user.dateOfBirth || "",
    country: user.country || "",
    city: user.city || "",
    postalCode: user.postalCode || "",
    address: user.address || "",
    phoneNumber: user.phoneNumber || ""
  };
}

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
app.post("/login", async (req, res) => {
  console.log("POST /login");
  console.log("Body:", req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Wpisz email i haslo");
  }

  try {
    const users = await readUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).send("Nieprawidlowy email lub haslo");
    }

    res.status(200).json({
      message: "OK",
      user: sanitizeProfile(user)
    });
  } catch (error) {
    console.error("Blad odczytu users.json:", error);
    res.status(500).send("Blad serwera");
  }
});

// Tworzy nowe konto na podstawie danych z formularza rejestracji.
app.post("/register", async (req, res) => {
  console.log("POST /register");
  console.log("Body:", req.body);

  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send("Wypelnij wszystkie pola");
  }

  try {
    const users = await readUsers();
    const userExists = users.some((user) => user.email === email);

    if (userExists) {
      return res.status(409).send("Ten email jest juz zarejestrowany");
    }

    users.push(createUserRecord({ firstName, lastName, email, password }));
    await writeUsers(users);

    res.status(201).send("Rejestracja zakonczona sukcesem");
  } catch (error) {
    console.error("Blad zapisu users.json:", error);
    res.status(500).send("Blad serwera");
  }
});

// Zwraca dane profilu na podstawie emaila zalogowanego uzytkownika.
app.get("/profile", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send("Brak emaila uzytkownika");
  }

  try {
    const users = await readUsers();
    const user = users.find((item) => item.email === email);

    if (!user) {
      return res.status(404).send("Nie znaleziono uzytkownika");
    }

    res.status(200).json(sanitizeProfile(user));
  } catch (error) {
    console.error("Blad odczytu profilu:", error);
    res.status(500).send("Blad serwera");
  }
});

// Aktualizuje dane profilu wybranego uzytkownika.
app.put("/profile", async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    gender,
    dateOfBirth,
    country,
    city,
    postalCode,
    address,
    phoneNumber
  } = req.body;

  if (!email) {
    return res.status(400).send("Brak emaila uzytkownika");
  }

  try {
    const users = await readUsers();
    const userIndex = users.findIndex((user) => user.email === email);

    if (userIndex === -1) {
      return res.status(404).send("Nie znaleziono uzytkownika");
    }

    users[userIndex] = {
      ...createUserRecord(users[userIndex]),
      firstName: firstName || "",
      lastName: lastName || "",
      gender: gender || "",
      dateOfBirth: dateOfBirth || "",
      country: country || "",
      city: city || "",
      postalCode: postalCode || "",
      address: address || "",
      phoneNumber: phoneNumber || ""
    };

    await writeUsers(users);

    res.status(200).json({
      message: "Profil zapisany",
      user: sanitizeProfile(users[userIndex])
    });
  } catch (error) {
    console.error("Blad zapisu profilu:", error);
    res.status(500).send("Blad serwera");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
