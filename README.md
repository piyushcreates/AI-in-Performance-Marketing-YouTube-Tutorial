# AI in Performance Marketing: YouTube Tutorial

This repo is the companion project for my YouTube tutorial on **using AI in
performance marketing**, taken from the **Tracking and Analytics** chapter of my
**Performance Marketing System** course.

In the video I use **Claude Code** to build a lead-generation landing page, set up
tracking for it, and automate what happens to each lead.

▶️ **Watch the tutorial:** [https://youtu.be/iJHCe60b8Us](https://youtu.be/iJHCe60b8Us)

## What you'll learn
- Using Claude Code to turn a marketing plan into a working landing page
- Setting up the Meta Pixel and standard events (PageView, ViewContent, Lead, CompleteRegistration, Contact)
- Tag management with GTM
- Capturing UTMs and ad-attribution fields in a two-step lead form
- Automating lead routing to Google Sheets with an n8n webhook, split by goal

## Project structure
| File | Purpose |
|---|---|
| `index.html` | Landing page |
| `thank-you.html` | Post-submit page with WhatsApp CTA |
| `styles.css` | Styling |
| `script.js` | Form logic, validation, UTM capture, event firing |
| `tracking.js` | Meta Pixel loader |
| `config.js` | Pixel ID, WhatsApp number, lead endpoint |

## Run locally
From the project folder:

    python3 -m http.server 8765

Then visit http://localhost:8765

## Note
The brand "Fluentwork" and the proof, testimonial and instructor sections are
placeholders for demonstration only.
