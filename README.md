# Coworking Booking Backend

Det här projektet är ett backend-API för bokningssystem i en coworking-miljö.  
Byggt med **Node.js**, **Express**, **MongoDB**, **Redis** och **Socket.IO**.

## Funktioner

- Registrering och inloggning av användare (JWT-tokenbaserad autentisering)
- Användarroller:
  - **User:** kan boka rum, se och hantera sina egna bokningar
  - **Admin:** kan skapa, uppdatera och ta bort rum, se alla användare och bokningar
- Skapa, lista, uppdatera och ta bort rum (endast Admin)
- Boka rum, hantera bokningar (User/Admin)
- Realtidsnotifieringar vid skapande, ändringar och borttagning av bokningar (via WebSocket)
- Caching av rumsdata med Redis för bättre prestanda

---

## Teknisk stack

- **Node.js + Express.js** – Server och API
- **MongoDB + Mongoose** – Databas och datamodellering
- **JWT + bcrypt** – Säker autentisering
- **Socket.IO** – Realtidskommunikation
- **Redis** – Caching av ofta använda data (rum)
- **Railway** – Deployment (hostad backend och databas)

---

## API-specifikation

### Autentisering

- `POST /api/auth/register` – Registrera en vanlig användare
- `POST /api/auth/register-admin` – Registrera admin (används för första admin)
- `POST /api/auth/login` – Logga in och få JWT-token

### Rumshantering (Admin)

- `POST /api/rooms` – Skapa nytt rum
- `GET /api/rooms` – Hämta alla rum (med Redis caching)
- `PUT /api/rooms/:id` – Uppdatera rum
- `DELETE /api/rooms/:id` – Ta bort rum

### Bokningar

- `POST /api/bookings` – Skapa ny bokning
- `GET /api/bookings` – Hämta mina bokningar (User)
- `GET /api/bookings/all` – Hämta alla bokningar (Admin)
- `PUT /api/bookings/:id` – Uppdatera bokning
- `DELETE /api/bookings/:id` – Ta bort bokning

### Användarhantering (Admin)

- `GET /api/users` – Lista alla användare
- `DELETE /api/users/:id` – Ta bort användare

---

## Kom igång lokalt

1. Klona projektet:

   ```bash
   git clone https://github.com/dittkonto/coworking-booking.git
   cd coworking-booking
   ```

2. Installera beroenden:

   ```bash
   npm install
   ```

3. Skapa en `.env`-fil:

   ```
   MONGO_URI=din-mongodb-url
   JWT_SECRET=din-superhemliga-jwt-nyckel
   REDIS_URL=din-redis-url
   PORT=5000
   ```

4. Starta utvecklingsservern:
   ```bash
   npm run dev
   ```

---

## Deployment

Projektet är deployat på **Railway**.  
Både backend och databaserna (MongoDB och Redis) ligger live där.

Produktions-URL:  
 `https://coworking-booking-production.up.railway.app/`

---

## Designval

- Separata controllers för logik
- Middleware för autentisering och autorisering
- Redis för cache på GET /api/rooms
- Socket.IO för att visa förändringar i bokningar i realtid
- Enkel och tydlig struktur för att kunna bygga vidare på i framtiden

---
