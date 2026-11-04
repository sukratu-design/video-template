---
name: launch-film
description: Make a 30s launch/promo motion film (16:9 + Reels-safe 9:16) from this repo's launch-film template instead of Motion. Use when asked for a launch video, promo film or client motion piece.
---

# Launch film from template

The template is in `launch-film/` in this repo. Follow `docs/WORKFLOW.md` step by step:

1. **Brief:** get the brand (colours, wordmark, URL) and the story beats in the template's shape. Ask only for what's missing.
2. **Set up:** copy `launch-film/` to a new folder (or branch), then run `npm i`.
3. **Edit `content.js` only.** Keep to the length limits in `launch-film/README.md`. Cards missing from `finalSlots` are thrown off as noise.
4. **QA with stills in both layouts.** Check for clipping and wrapping.
5. **Render** both mp4s in the background (about 3–4 min each). Verify them with ffprobe.
6. **Run the 9:16 Reels safe-zone overlay check.**
7. **Deliver** the mp4s to the user (never commit them), and flag any placeholders still in use: the keyed wordmark, the template audio, the Fraunces serif.

Hard rules are in `CLAUDE.md`:
- `__seek` returns nothing.
- Render forward only.
- Use the seeded RNG only.
- Make timing edits in both layout files.
