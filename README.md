# System Zarządzania Treningami na Siłowni

Aplikacja webowa do zarządzania treningami oraz aktywnością użytkowników siłowni.

---

## Opis projektu

Aplikacja umożliwia użytkownikom przeglądanie dostępnych treningów, zapisywanie się na nie oraz zarządzanie swoimi aktywnościami.

System jest przeznaczony dla osób korzystających z siłowni, które chcą w prosty sposób planować swoje treningi i kontrolować czas ćwiczeń.

Aplikacja rozwiązuje problem organizacji treningów oraz ułatwia dostęp do informacji o dostępnych zajęciach w jednym miejscu.

---

## Sprint plan

Sprint 1 | Cel (Kamień milowy): Prototyp aplikacji + logowanie/rejestracja | 26.03.2026
Sprint 2 | Cel (Kamień milowy): Strona główna + moduł treningów | 09.04.2026
Sprint 3 | Cel (Kamień milowy): Integracja frontend + backend | 23.04.2026
Sprint 4 | Cel (Kamień milowy): Testowanie i optymalizacja | 07.05.2026

---

## Autorzy

* Hanna Kryhina – backend
* Evelina Kuroiedova – testowanie / UI
* Vladyslav Kvitka – frontend

---

## Technologie

Frontend:

* HTML
* CSS
* JavaScript

Backend:

* Java
* Spring Boot

---

## Funkcjonalności

* rejestracja użytkownika
* logowanie i wylogowanie
* zarządzanie profilem
* przeglądanie treningów
* zapisywanie się na trening
* usuwanie treningów
* timer treningowy

Checklist:

* logowanie
* rejestracja
* lista treningów
* zapis na trening
* statystyki treningów

---

## Architektura

Aplikacja jest zbudowana w architekturze klient–serwer.

Frontend komunikuje się z backendem za pomocą REST API.
Backend odpowiada za logikę biznesową oraz komunikację z bazą danych.

---

## Instalacja

1. Sklonuj repozytorium
   git clone https://github.com/VKvitka/Project-Gym

2. Przejdź do katalogu projektu
   cd gym-app

---

## Uruchomienie aplikacji

### Backend

cd backend
mvn spring-boot

### Frontend

cd frontend

# otwórz plik index.html lub użyj serwera lokalnego

---

## Instrukcja użytkownika

1. Otwórz przeglądarkę
2. Przejdź na adres:
   http://localhost:8080
3. Utwórz konto
4. Zaloguj się
5. Wybierz trening i zapisz się na niego
6. Korzystaj z timera podczas ćwiczeń

---

## Struktura projektu

frontend/ – interfejs użytkownika
backend/ – logika aplikacji
docs/ – dokumentacja
tests/ – testy

---

## API

POST /api/register
POST /api/login
GET /api/trainings
POST /api/trainings/enroll
DELETE /api/trainings/enroll/{id}

---

## Zrzuty ekranu

\

---

## Status projektu

Projekt w trakcie rozwoju.

---

## Licencja

Projekt edukacyjny.
