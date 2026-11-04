# MyDesigner.gg launch film: rebuild spec

Source: Motion export `41f8285a` (chat a2cc9ae6…). The source is 1920×1080, 30 fps, 30.0 s, with h264 video and AAC 48 kHz stereo audio.

## Tokens
| Token | Value | Use |
|---|---|---|
| paper | `#f3ede8` | Base background, with an 80 px grid in `#e6ddd4` |
| board | `#fbf9f6` | Calendar board surface (radius 28) |
| orange | `#fe883d` | Brand flood, SHIPPED tag, plan blocks |
| orange-deep | `#ff6410` | "Ship" block |
| ink | `#0c0c0c` | Logo, caption boxes, type on orange |
| red | `#e0452f` | Conflict counter, calendar alert |
| cards | green / peach / blue / purple / yellow / pink / grey pastel, each with a 3 px colour bar and a mono time label | Calendar items |

## Type
- **UI and headlines:** Space Grotesk 500/600/700.
- **Labels, times, taglines:** Space Mono 400, letter-spacing 0.15–0.3em, uppercase.
- **End-card line:** Fraunces 600, with "shipped." in italic. This is a close match only; swap in the exact serif if the brand has one.
- **Logo:** concentric-ring mark (SVG) plus the wordmark (PNG keyed from the source). Replace the PNG with the vector from your brand files.

## Beat sheet (seconds)
| t | Beat |
|---|---|
| 0.0–1.4 | Paper grid. "This is" → "launch week." builds word by word (center, Space Grotesk 500, 64 px) |
| 1.4–2.8 | Text wipes. The "Launch week" board scales in from the top, then tilts into perspective (rotX 14°, rotZ −6°) |
| 3.0–6.2 | 26 cards drop onto the board. The requests/conflicts counter climbs. Notifications slide in: Investor 4.0, Agency 4.5, Freelancer 5.0, #launch 5.5, Calendar alert 6.0 |
| 6.5–7.0 | Board jitter |
| 7.0–7.5 | "Busy / weeks. / Nothing / ships." stamp in black boxes, about 0.12 s apart |
| 7.6–8.4 | Board shatters into 80 px tiles, with a few orange flashes. Empty grid 8.4–9.0 (music drops out) |
| 9.0–11.4 | Orange SHIPPED tag pops. An L-shaped leader line draws. "0 launches" → "this quarter." types (0 in orange) |
| 11.4–12.6 | The group collapses to the tag, the tag becomes a dot, and the dot floods the screen orange |
| 12.8–14.0 | Ring mark lands with overshoot. Three stippled spheres drift in |
| 14.0–16.6 | Ring slides left and the wordmark wipes open. "THE WEEKLY CREATIVE ENGINE FOR FOUNDERS" types on |
| 16.6–18.2 | Wordmark/tagline clear. The ring scales up as a circular iris revealing the "Ship Week" board (tilted → flat) |
| 18.3–19.8 | Prompt bar types "Ship our launch page by Friday." |
| 20.0–21.6 | "ORBITING 26 REQUESTS…". Eight noise cards are thrown off. Eighteen cards re-slot into the afternoons |
| 21.6–23.0 | "PLANNING THE WEEK…". Brief → Design → Build → QA → Ship blocks lock in 9–12 each day. SHIPPED 0 → 100 % |
| 23.0–24.6 | "DONE · SHIPPED BY FRIDAY". Bar exits. Tags "+1 LAUNCH SHIPPED" (orange) and "24–72H TURNAROUND" (black) pin up |
| 24.7–25.4 | The Design block expands to a full-screen orange takeover |
| 25.6–27.0 | "Monday, brief. Friday, *shipped.*" drops in word by word. Corner brackets frame it. Spheres return |
| 27.2–28.9 | Logo lockup rises. "MYDESIGNER.GG · START NEXT MONDAY" types on |
| 28.9–30.0 | Hold |

## Audio
The source mix (music + SFX) is extracted as `audio.m4a`, frame-synced to this timeline, and muxed by default. To change the music, replace the track. Keep the hard drop at 8.4–9.0 s and the final hit at about 27.3 s.
