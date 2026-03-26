# Project Gym - System Zarządzania Treningami na Siłowni

**Autorzy:** Hanna Kryhina, Evelina Kuroiedova, Vladyslav Kvitka

## Opis projektu

Aplikacja webowa stworzona dla użytkowników siłowni, umożliwiająca rejestrację, logowanie oraz zarządzanie treningami. System pozwala na przeglądanie dostępnych treningów, zapisywanie się na wybrane zajęcia oraz korzystanie z wbudowanego timera treningowego.

**Cel projektu:** Ułatwienie planowania treningów i zwiększenie komfortu korzystania z siłowni poprzez dostęp do funkcjonalnej platformy online.

---

## Główne funkcjonalności

### Zarządzanie kontem
- Rejestracja nowego użytkownika
- Logowanie i wylogowanie
- Zarządzanie profilem użytkownika
- Przegląd danych osobowych

### Treningi
- Przeglądanie listy dostępnych treningów
- Podgląd szczegółów treningu (nazwa, poziom trudności, czas trwania, opis)
- Zapisywanie się na wybrany trening
- Zarządzanie opłatami za treningi

### Moje treningi
- Lista zapisanych treningów
- Szczegóły zapisanych treningów
- Usuwanie treningu z listy

### Timer treningowy
- Funkcja startu/pauzy
- Resetowanie czasu
- Odmierzanie czasu ćwiczeń i przerw

### Strona główna
- Informacje o siłowni i ofercie
- Sekcja kontaktowa (telefon, e-mail, adres, godziny otwarcia)
- Intuicyjny interfejs użytkownika

---

## Struktura systemu

System składa się z następujących modułów:

1. **Moduł rejestracji** - tworzenie nowego konta użytkownika
2. **Moduł logowania** - uwierzytelnienie użytkownika
3. **Strona główna** - informacje o siłowni i dostępne treningi
4. **Moduł treningów** - przeglądanie i zapisywanie się na treningi
5. **Moduł timera** - funkcjonalność timera treningowego
6. **Profil użytkownika** - zarządzanie danymi użytkownika

---

## Struktura interfejsu

### Menu nawigacyjne
Horizontal menu znajdujące się u góry aplikacji, zawierające następujące zakładki:

| Zakładka | Opis |
|----------|------|
| **Strona główna** | Informacje o siłowni, oferta, dane kontaktowe |
| **Treningi** | Lista wszystkich dostępnych treningów |
| **Moje treningi** | Lista zapisanych treningów użytkownika |
| **Timer** | Prosty timer treningowy |
| **Profil** | Dane użytkownika i informacje o koncie |

---

## Wymagania funkcjonalne

### Rejestracja użytkownika
Użytkownik powinien mieć możliwość utworzenia nowego konta poprzez podanie:
- Imienia i nazwiska
- Adresu e-mail
- Hasła

Po poprawnej rejestracji konto zostaje zapisane w bazie danych.

### Logowanie użytkownika
- Login za pomocą e-maila i hasła
- Dostęp do wszystkich funkcji aplikacji po zalogowaniu

### Przeglądanie treningów
System wyświetla listę dostępnych treningów zawierającą:
- Nazwę treningu
- Poziom trudności
- Czas trwania
- Szczegółowy opis ćwiczeń

### Zapisywanie się na trening
- Kliknięcie przyciskiem "Zapisz się" na wybrany trening
- Dodanie treningu do listy "Moje treningi"

### Timer treningowy
- Możliwość rozpoczęcia, zatrzymania i resetowania czasu
- Przydatny do odmierzania czasu ćwiczeń i przerw

### Profil użytkownika
- Przegląd danych personalne
- Historia zapisanych treningów
- Opcja edycji profilu

---

## Wymagania niefunkcjonalne

- Kompatybilność z nowoczesnymi przeglądarkami internetowymi
- Intuicyjny i responsywny interfejs użytkownika
- Bezpieczeństwo danych użytkownika (hashowanie haseł)
- Szybka i stabilna praca aplikacji
- Dostosowanie do urządzeń mobilnych (RWD)

---

## MVP (Minimum Viable Product)

Pierwsza wersja aplikacji zawiera:

- Rejestracja użytkownika z walidacją danych
- Logowanie i wylogowanie
- Strona główna z informacjami o siłowni
- Lista dostępnych treningów
- Podgląd szczegółów treningu
- Zapisywanie się na trening
- Sekcja "Moje treningi"
- Usuwanie treningu z listy
- Prosty timer treningowy (start/stop/reset)
- Podstawowy profil użytkownika

---

## Struktura plików

```
Project-Gym/
├── README.md                  # Dokumentacja projektu
├── profile.html              # Strona profilu użytkownika
├── profile.css               # Style dla profilu
└── images/
    ├── icon-user.png         # Ikona użytkownika
    └── Tło. Horizontal copy space background  # Tło aplikacji
```

---

## Technologie

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** (do określenia)
- **Baza danych:** (do określenia)

---

## Backlog projektu

### Faza 1 - Podstawowe funkcjonalności (MVP)
- Rejestracja i logowanie
- Strona główna
- Lista treningów
- Zapisywanie się na trening
- Sekcja "Moje treningi"

### Faza 2 - Zaawansowane funkcjonalności
- Timer treningowy
- Zaawansowany profil użytkownika
- Historia treningów

### Faza 3 - Optymalizacja
- Testowanie UI/UX
- Optymalizacja wydajności
- Responsywność aplikacji

---