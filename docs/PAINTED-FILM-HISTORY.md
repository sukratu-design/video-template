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

## Open items
- Redraw the hands (beats 1 and 13); recolour the bow; fix beat 4's opening zoom.
- Make the voiceover pipeline a single script (currently JS generation + Python assembly).
- Rotate any API key that was ever pasted into a chat.
