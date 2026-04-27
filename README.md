# Čitamo Njemački! 🌟

A web app that helps Croatian kids learn to read German. Take a photo of a German homework page, and the app extracts the text, reads it aloud with adjustable speed, lets the child practice pronunciation, and translates it into Croatian.

## Features

- **📷 OCR from photos** — point a phone camera at a homework page; the app extracts German text. Image is preprocessed (grayscale + adaptive threshold) for better recognition under typical lighting.
- **🔊 Word-by-word reading** — German voice reads the text aloud, highlighting each word as it goes. Speed adjustable from turtle (0.4×) to rabbit (1.1×). Male and female voices.
- **🎤 Pronunciation practice** — child reads the sentence aloud; the app shows which words were spoken correctly and replays missed words slowly.
- **🇭🇷 Croatian translation** — every sentence is translated to Croatian for comprehension support (DE→HR via MyMemory, with DE→EN→HR fallback).
- **📂 Homework history** — saved homeworks accessible via chip bar at the bottom of the home screen and full history page.
- **📱 Installable** — works as a Progressive Web App; "Add to Home Screen" gives an app icon and offline support.

## Built with

- Vanilla HTML/CSS/JavaScript (no build step)
- [Tesseract.js](https://github.com/naptha/tesseract.js) for OCR
- Web Speech API (TTS + speech recognition)
- [MyMemory Translation API](https://mymemory.translated.net) for German → Croatian
- Service Worker for offline caching

## Local development

No build needed. Serve with any static server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Note: speech recognition and microphone permission require HTTPS in production. `localhost` is treated as secure for development.

## Deployment

Hosted on Cloudflare Pages from this repo. Pushes to `main` auto-deploy.

## License

Personal/educational use.
