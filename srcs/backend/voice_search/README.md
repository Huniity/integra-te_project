# voice_search

Django app that transcribes audio to text using OpenAI's Whisper model.

## What it does

Exposes a single REST endpoint (`POST /transcribe/`) that accepts an audio file upload (`.webm`), runs it through the Whisper `base` model (74M parameters), and returns the transcribed text. The transcription is tuned for Portuguese (`pt`).

The Whisper model is loaded once and cached in memory via `lru_cache`, so it is only initialized on the first request.

## Endpoint

| Method | Path | Description |
|--------|------|-------------|
| POST | `/transcribe/` | Upload an audio file (`audio` field, multipart) and get back `{ "transcript": "..." }` |

## Request

```
Content-Type: multipart/form-data
Field: audio — audio file (webm)
```

## Response

```json
{ "transcript": "transcribed text here" }
```

On error (missing file):

```json
{ "error": "No audio file." }
```
