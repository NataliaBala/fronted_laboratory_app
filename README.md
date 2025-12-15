# Frontend Laboratory App

Aplikacja do zarządzania zadaniami w kalendarzu, stworzona z wykorzystaniem Next.js, Firebase Authentication i Firestore.

##  Opis projektu

Frontend Laboratory App to aplikacja webowa umożliwiająca:
- Rejestrację i logowanie użytkowników (Firebase Authentication)
- Zarządzanie profilem użytkownika
- Przeglądanie kalendarza z zadaniami
- Dodawanie, edytowanie i usuwanie zadań
- Organizację pracy z priorytetami zadań

## Technologie

- **Next.js 16** - Framework React
- **Firebase** - Backend (Authentication, Firestore)
- **Playwright** - Testy E2E
- **DaisyUI** - Komponenty UI
- **Tailwind CSS** - Stylizacja

## Firebase Setup

### Firestore Security Rules

 link do wersji live:  https://frontend-laboratory-zgkai83nr-natalias-projects-f51b9fec.vercel.app

3. Kliknij "Publish"

##  Instalacja i uruchomienie

1. Sklonuj repozytorium:
```bash
git clone https://github.com/NataliaBala/fronted_laboratory_app.git
cd fronted_laboratory_app
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Skonfiguruj zmienne środowiskowe Firebase w pliku `.env.local`:
```env
NEXT_PUBLIC_API_KEY=your_api_key
NEXT_PUBLIC_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_PROJECT_ID=your_project_id
NEXT_PUBLIC_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_APP_ID=your_app_id
NEXT_PUBLIC_MEASUREMENT_ID=your_measurement_id
```

4. Uruchom serwer deweloperski:
```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem [http://localhost:3000](http://localhost:3000)

##  Testowanie

Uruchom testy E2E z Playwright:
```bash
npx playwright test
```


Wszystkie prawa zastrzeżone © 2025
