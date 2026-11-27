# NomadTrips
**NomadTrips** is a modern travel booking platform focused on discovering and exploring the hidden gems of Kazakhstan. It allows users to easily browse, compare, and book unique tours - from breathtaking mountain adventures in Almaty to cultural experiences across the steppe.
---
## Project Idea
**Kazakhstan** is an underrated travel destination with incredible landscapes and culture, but there is no unified, user-friendly platform to explore and book tours.

**NomadTrips** solves this by creating a single ecosystem where travelers can discover authentic experiences and book them instantly.
---
## Tech Stack 
| Layer      | Technology   |
|------------|--------------|
| Frontend   | Angular      |
| Backend    | Django       |
---
## Group Members
* Yermekuly Alibek
* Yerzhanuly Daulet

## Run locally

1. Create a Python virtual environment and install `travel_backend/requirements.txt`.
2. Copy `travel_backend/.env.example` to `travel_backend/.env` and set `GEMINI_API_KEY` to a Gemini API key from Google AI Studio. The key is read only by Django. Without it, the chat shows an unavailable message.
3. From `travel_backend`, run `python manage.py migrate`, `python manage.py createsuperuser`, and `python manage.py seed_demo_tours` for a fresh database. Then run `python manage.py runserver 127.0.0.1:8000`.
4. In another terminal at the repository root, run `npm ci` and `npm start`. Open `http://localhost:4200`.

The assistant button is available on every page. It sends recent chat turns to `POST /api/assistant/chat`; Django adds the current published tour catalog and calls the model. The conversation stays in the browser tab and is not saved to the project database.
