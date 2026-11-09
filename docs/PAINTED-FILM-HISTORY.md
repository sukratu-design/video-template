# painted-film: how it was made, and what we learned

"The Life of a Seed" (karma explainer), built Nov 2026 on a 2 vCPU / 3.7 GB VPS by a chain of agents. Brief: `painted-film/brief/`.

## Version chain
1. **Kimi (via OpenCode):** first full build from the brief: one `index.html`, GSAP, canvas, synthesized audio. 68 s.
2. **Opus 5.5 review/improve pass:** fixed the beat 3 bug (GSAP can't animate dotted names like `"bands.0"`, so six green bands never appeared), added missing picture elements from the brief (bird, seed in earth, sun arc, washing line, glowing point opener), fixed geometry (bow string, flame/seed, labels covering nodes), made `render.mjs` read the length from the page, duck music under the voice and take an output path. Preview now plays in sync with `vo.mp3`.
3. **Voiceover swaps:** Edge TTS en-IN/hi-IN samples → chose Madhur (hi-IN) with Devanagari terms. Later Sarvam Bulbul v4-flash `shubh_en_narration`. See `painted-film/voiceover/README.md`.
4. **Company School restyle (Opus 5.5):** the whole composition repainted onto procedural aged paper with a watercolour compositor and handwritten captions. Same beats, timing, audio.
5. **Pacing pass (Opus 5.5):** voice lines regenerated at slower rates with 0.38 s sentence pauses; a few lines reworded to fit.
6. **v3 (final):** Sarvam Shubh takes selected per line; "it is called sañcita karma" added at the user's request.

## Decisions worth keeping
- **Everything in code, deterministic.** Seeded PRNG per scene; `renderFrame(t)` must give identical pixels for the same `t`.
- **Voiceover drives the cues, not the reverse.** Generate/measure the voice first, then set `captionCues` from measured line timings.
- **Devanagari for Sanskrit terms in the TTS text** (captions keep IAST). Respelling ("sanskaar") also works with English voices.
- **Compositor, not per-shape filters.** Draw to a transparent art layer, then composite once onto the paper; cheaper and more consistent than per-element watercolour.

## Pitfalls
- **Voiceover pacing:** a slow voice squeezed with `atempo` 1.3-1.4× sounds rushed. Keep tempo ≤ ~1.1 and edit wording or windows instead.
- **Sarvam is non-deterministic** between runs (line durations vary ±30%): generate 3 takes and pick.
- **Render time:** ~7 min for the flat style, ~11-15 min for the painted style (paper + wash effects) on 2 vCPU. Run in the background.
- **ffmpeg mux hung once** (100% CPU for 2 h, truncated output with `moov atom not found`). The frames (`video.mp4`) were fine; killing the mux and re-running only the final ffmpeg command took 6 s. If a render's last step stalls, do that rather than re-rendering.
- **Waiting loops:** `until ! pgrep -f render.mjs` matches its own command line and never exits; poll the output file instead.
- **Upload limit:** the full render is ~32 MB; chat upload limit was 30 MB. Deliver a `libx264 -crf 25 -c:a copy` copy (~13.5 MB).
- **Known visual weak spots:** see `painted-film/STYLE.md`.

## Second film: Diwali, "A Row of Lamps" (Nov 2026)
`diwali-film/`, 69.5 s, 10 beats, built from `painted-film/` in one session. Beat table: `diwali-film/brief/SCRIPT.md`. What it taught us:
- **Voice first, then beats.** Takes were measured, then beat boundaries `B[]`, caption cues, cut/bell times in `audio.js` were set from them (a few beats moved by up to ~1 s from the approved table). All lines fit at tempo 1.0.
- **Sarvam key:** `sarvam.mjs` now reads `SARVAM_API_KEY` from the environment first, then `~/.sarvam.env`. Cloud sessions usually have the env var.
- **Compositor tweak (diwali-film only):** `composite()` no longer applies the pigment-bleed blur or the per-pixel edge displacement to the artwork, because it smeared drawings and caption text. The paper and the grain mottling of wash density are unchanged. `painted-film/` still has the original compositor.
- **Caption ghost line removed:** the faint pencil copy under each caption was dropped (reviewer found it confusing).
- **Layout:** the painting is scaled .87 about (540,470); keep art y roughly 215-1000 and centre scenes between title/labels and the caption. A subtitle drawn above a wash must clear the wash top.
- **Night scenes on paper:** the compositor is subtractive, so a dark wash would swallow lit flames. Cut glow holes in the wash with `destination-out` radial gradients (`cutGlow`), then draw silhouettes and lit windows on top.
- **Canvas pitfalls:** `drawFlame` sets an absolute `globalAlpha`, and several helpers reset `ctx.globalAlpha=alpha`. Both ignore a parent fade, so faded diyas kept bright flames. Capture the incoming alpha (`const pa=ctx.globalAlpha`) and restore to it; pass `alpha:` to `groundWash` when fading a group. `ctx.lineWidth=0` is ignored by canvas, so never use `width:0` strokes.
- **Hero element shared across beats** (`DX,DY,DS`) so the film loops; if you move it, move it everywhere.
- **QA tool:** `diwali-film/stills.mjs <dir> <times...>` renders PNG stills forward-only (captions on), far quicker than a render. Full render took ~5 min on this environment.

## Third film: Dussehra to Diwali, "the long way home" (Nov 2026)
`dussehra-diwali-film/`, 77.5 s, 10 beats, built from `diwali-film/` in one session from a user-supplied Grok draft. Beat table and accuracy notes: `dussehra-diwali-film/brief/SCRIPT.md`. What it taught us:
- **Check AI-drafted scripts against the source.** The draft implied the epic explains the ~20-day festival gap; it does not. The film separates the calendar (later tradition) from the epic (an order of duties), and says "tradition says" for the lamps.
- **Estimate length from words, then expect it to grow.** The approved table assumed ~70 s; Sarvam takes for 155 words measured ~69 s of speech alone, so with 0.6 s breaths the film became 77.5 s. Keeping tempo 1.0 was preferred over squeezing.
- **Symbols, not figures:** bow and arrow, a ten-spired crown, a pyre, crown + chhatra + kalash (abhisheka), a lotus through fire, a winged chariot, a mace with a saffron streak, sandals on a throne, footprints. Watch for accidental faces: two oval sandals under an open arch read as eyes, so the throne back became a solid cusped panel and the sandals were splayed.
- **Alpha-respecting toolkit:** `hatch`, `groundWash`, `drawShrub`, `drawFlame`, `label2`, `footprint`, `ribbon`, `stars`, `nightWash` now multiply by the incoming `globalAlpha` in this film (fixes the pitfall noted above at the source). `diya()` no longer passes `ctx.globalAlpha` to `drawFlame`.

- **Detail pass, then generated paintings:** the user found the symbol-only scenes too basic. A detailed scenery library (cached vignettes: skies, scrolled clouds, palaces, arcades, palms, seas, carpets) rebuilt beats 1 and 4 in code, then the user chose generated paintings with people instead. Compared on two beats (Higgsfield connector): Nano Banana Pro (closest to the reference's restraint), FLUX 3 (lavish, devotional-print look, slow), **GPT Image 2.6 high/2K** (best people; chosen). Ten frames cost 27.5 credits plus one 2.75 map re-roll. Lessons in `dussehra-diwali-film/brief/IMAGE-PROMPTS.md`: a generated frame with people as a second reference trips the content filter; "a woman among flames" does too (reframed); ~4 concurrent jobs max; name real geography explicitly for maps.
- **Image pipeline:** `index.html` draws each JPEG with a per-beat camera (`CAM[]` zoom/focus, clamped to the frame), dissolves at beat boundaries, a paper-coloured caption band, title and closing card. The code-drawn version is kept as `index-drawn.html`.

## Open items
- Redraw the hands (beats 1 and 13); recolour the bow; fix beat 4's opening zoom.
- Make the voiceover pipeline a single script (currently JS generation + Python assembly).
- Rotate any API key that was ever pasted into a chat.
- Port the clean-edge compositor (and caption change) back to `painted-film/` if wanted.
- Re-centre Diwali beats 2-10 vertically like beat 1 (a follow-up session was started).
- Listen to the Diwali voiceover for pacing and Hindi-term pronunciation.
- Dussehra-to-Diwali film: user review of the painted (image) render; pacing and Indic-term pronunciation by ear; port the alpha-respecting helpers and scenery library back to `diwali-film/` and `painted-film/` if wanted.
