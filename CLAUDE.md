# video-template: agent instructions

Sukratu Labs' code-based motion-graphics templates. Each template is a GSAP timeline in a plain HTML page, rendered frame-by-frame to mp4 with Playwright + ffmpeg. **Why this exists:** Motion.so (motion.so) produced the original MyDesigner.gg launch film, but every iteration burned credits. This repo replaces it with a deterministic, free-to-re-render pipeline. Don't route new video work back to Motion unless the user asks for generative media (AI video, AI images, voiceover, generated music). Those need the Motion app or another generative tool.

Project hub (status, open items, history for humans): Notion → Agent Project Hubs → **Video Generation** (https://app.notion.com/p/40ef3a2c1e9a81329167d2a2c228c2d3). Update its open items and version history after material changes, and add a row to the Agent Work Log.

Read these before working:
- `docs/HISTORY.md`: how the template was built, decisions, and what was tried and rejected
- `docs/WORKFLOW.md`: the step-by-step for making a new film, including the QA checks
- `launch-film/README.md`: run commands, copy length rules, known placeholders
- `launch-film/SPEC.md`: beat sheet, tokens, type

## Templates
| Folder | Formats | Notes |
|---|---|---|
| `launch-film/` | 16:9 1920×1080 and 9:16 1080×1920 (Reels-safe), 30 fps, 30 s | Story: chaos → problem → stat → brand reveal → fix → proof → CTA |
| `painted-film/` | 1:1 1080×1080, 30 fps, 68 s | Company School painted-watercolour explainer with Indian-English voiceover. Worked example: karma / "The Life of a Seed". Read `painted-film/STYLE.md`, `painted-film/README.md`, `docs/PAINTED-FILM-HISTORY.md` and the `painted-film` skill. |

## Hard rules
1. **For a new film, edit `launch-film/content.js` only.** It holds copy, brand tokens, the wordmark path, the audio path, notifications, calendar cards and final slots. Touch `index.html` / `vertical.html` only if the story structure or timing changes. Make timing changes in **both** files, because they're parallel copies of the same timeline.
2. **`window.__seek` must not return a value.** `tl.seek()` returns the GSAP timeline. If it's returned to Playwright, Playwright tries to serialize it and hangs forever. Keep the braces: `t=>{tl.seek(t,false)}`.
3. **Render forward only.** Text changes use `tl.call` callbacks, which fire only when the timeline crosses them going forward. `render.js` already steps frames in order, and stills mode replays from 0. Don't add backward seeks.
4. **Keep randomness seeded.** Card order, tile shatter, thrown-card angles and sphere stipple all use the seeded `rnd()`. Never use `Math.random()`, or renders stop matching each other.
5. **Respect the 9:16 Reels safe zone.** Keep key text out of the bottom ~300 px (y > 1620) and the right ~130 px from y ≈ 1050–1650. The prompt bar, proof tags and end card are placed for this, so re-check them with the overlay command in `docs/WORKFLOW.md` after layout changes.
6. **Respect the copy length limits** in `launch-film/README.md`, or text clips in 9:16.
7. **Don't commit mp4s** (they're in .gitignore). Deliver renders to the user directly. The one exception is the small, compressed reference examples in `painted-film/examples/`.
9. **Never commit API keys** (e.g. Sarvam, ElevenLabs). Keys live in `~/*.env` files outside the repo.
8. **Cloud workspace notes:** Playwright and Chromium are preinstalled, so never run `playwright install` there. A full render takes about 3–4 minutes per layout, so run it in the background. `npm i` is needed once per fresh clone.

## Brand facts (MyDesigner.gg)
- **Colours:** paper `#f3ede8`, orange `#fe883d`, deep orange `#ff6410`, ink `#0c0c0c`.
- **Type:** Space Grotesk (UI and headlines) and Space Mono (labels). Fraunces 600 is a stand-in serif for the end line.
- **Logo:** a concentric-ring mark (drawn as inline SVG in the HTML) plus the "MyDesigner" wordmark. `assets/wordmark.png` was cut out of a Motion render frame. Replace it with the vector logo when available.
- **Messaging used:** "The weekly creative engine for founders", "Monday, brief. Friday, shipped.", "24–72h turnaround", Ship Week.
