# voice_search

This Django app lets a kid speak into the mic and get rerouted to the right page — no typing required. Under the hood it chains two AI models and one database query: Whisper turns the spoken audio into text, sentence-transformers turns that text into a vector, and pgvector finds the closest match in the database to decide where to send the user.

---

## How it works, step by step

### 1. The browser records audio

The kid clicks the mic button in React. The browser asks for microphone permission. The kid speaks — *"quero aprender matemática"*. React uses `MediaRecorder` to capture the audio, which Chrome encodes as a `.webm` file.

### 2. React sends the audio to Django

```
POST /api/v1/voice/transcribe/
Content-Type: multipart/form-data
Body: audio=recording.webm
```

### 3. Django saves to a temp file and runs Whisper

The `transcribe()` view picks up the `.webm` file from `request.FILES`. Whisper can't read a stream — it needs a real file path — so the audio is written to a temp file at `/tmp/tmpXXXXXX.webm`. FFmpeg (called internally by Whisper) decodes the compressed `.webm` into raw PCM audio. Whisper then processes those audio waves and returns the transcript:

```json
{ "text": "Quero aprender matemática." }
```

The temp file is deleted immediately after. The Whisper `base` model (74M parameters) is loaded once into RAM on the first request and cached — every call after that reuses the same instance.

```
POST /transcribe/ → save to /tmp/ → FFmpeg decodes → Whisper → transcript → delete temp file
```

Response sent back to React:

```json
{ "transcript": "Quero aprender matemática." }
```

### 4. React sends the transcript to Django

```
POST /api/v1/voice/reroute/
Content-Type: application/json
Body: { "transcript": "Quero aprender matemática." }
```

### 5. Django embeds the transcript

`sentence-transformers` (also loaded once in RAM) converts the text into 384 numbers that represent its *meaning* in mathematical space:

```
"Quero aprender matemática."  →  [0.12, 0.87, 0.34, 0.01, 0.76, ...]
```

### 6. pgvector finds the closest match

Postgres compares the query vector against every row in the `ObjectVector` table using cosine distance. Each row was pre-embedded when content was added to the database.

```
Disciplina "Matemática"        → distance: 0.08  ✅ very close
Livro "Histórias de animais"   → distance: 1.43  ❌ very far
```

The row with the smallest distance wins.

### 7. Django returns the route

```json
{
  "route": "/aprender/matematica",
  "label": "Matemática",
  "distance": 0.08
}
```

### 8. React reroutes

React Router calls `reroute("/aprender/matematica")`. The kid lands on the Matemática page.

---

## The complete picture

```
Kid speaks
    ↓
MediaRecorder → .webm blob
    ↓
POST /transcribe/ → Django saves to /tmp/
    ↓
FFmpeg decodes .webm → raw audio
    ↓
Whisper → "Quero aprender matemática."
    ↓
temp file deleted
    ↓
POST /reroute/ → sentence-transformers → 384 numbers
    ↓
pgvector compares against ObjectVector table
    ↓
closest match → "/aprender/matematica"
    ↓
React reroutes → kid lands on the right page
```

Two API calls, two AI models, one database query. That's the whole thing.

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/voice/transcribe/` | Upload `.webm` audio, get back the transcript |
| POST | `/api/v1/voice/reroute/` | Send a transcript, get back the matching route |

### `POST /transcribe/`

Request:
```
Content-Type: multipart/form-data
Field: audio — .webm audio file
```

Response:
```json
{ "transcript": "Quero aprender matemática." }
```

Error (missing file):
```json
{ "error": "No audio file." }
```

### `POST /reroute/`

Request:
```json
{ "transcript": "Quero aprender matemática." }
```

Response:
```json
{
  "route": "/aprender/matematica",
  "label": "Matemática",
  "distance": 0.08
}
```

---

## Models

**`ObjectVector`** — one row per navigable object in the app (a `Disciplina`, a `Tema`, etc.). Each row stores a 384-dimension embedding so pgvector can compare it at query time.

| Field | Type | Description |
|-------|------|-------------|
| `object_id` | UUID | ID of the source object |
| `model_type` | CharField | Type of the object (`"Disciplina"`, `"Tema"`, …) |
| `label` | CharField | Human-readable name shown in results |
| `route` | CharField | Frontend URL to reroute to |
| `embedding` | VectorField(384) | Pre-computed sentence embedding |

The combination of `object_id` + `model_type` is unique to prevent duplicates.
