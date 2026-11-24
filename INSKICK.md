# Inskick – Kotten och nöterna

- **Titel:** Kotten och nöterna
- **Kort beskrivning:** Vilken sida har flest nötter?
- **URL:** https://kottennoterna.shipholm.dev
- **Ämne:** Matte
- **Årskurs:** FK–2
- **Typ:** Spel
- **Enhet:** Alla enheter
- **Lgr22 (curriculum_ids):** MA.1-3.1.1 (primär), MA.1-3.1.5
- **Kortbild:** `public/kort.png` (1200×900, 4:3, spelmoment utan pålägg) →
  https://kottennoterna.shipholm.dev/kort.png

## long_description
Kotten och nöterna är ett jämförelsespel i matematik för FK–2. Två mattor med
nötter visas sida vid sida och barnet pekar på den matta som har flest nötter.
Nötter, mattor och figur ritas i koden – inga bildfiler, inga anrop till andra
webbplatser.

Appen tränar antalsuppfattning och jämförelse av antal, precis det momentet i
det centrala innehållet för matematik åk 1–3: ”Naturliga tal och deras
egenskaper samt hur talen delas upp och används för att ange antal och
ordning.” (Skolverket, Lgr22.) När barnet svarat visas antalet som siffra under
båda mattorna, så att mängden kopplas till tecknet.

Svårighetsgraden stiger i små steg: först är skillnaden stor (2–4 nötter), sedan
1–2, och på sista nivån skiljer bara en enda nöt. Barnet behöver aldrig räkna
varje nöt – det går att se vilken hög som har fler. En runda är åtta uppgifter
och tar ungefär 3–5 minuter. Fel svar kostar ingenting: mattan skakar mjukt,
Kotten funderar och barnet får en ny chans. Efter två fel pulserar rätt matta
och antalet visas.

Allt som sägs spelas upp på svenska (webbläsarens talsyntes), så barnet behöver
inte kunna läsa. Gratis, ingen inloggning, inga annonser, inga länkar ut.

## Kontroll
- `node verify.mjs` – 9000 genererade uppgifter kontrollerade (antal inom nivåns
  gräns, högarna aldrig lika, "mest" pekar på den större högen), 0 fel.
- Spelat igenom en hel runda med `Input.dispatchTouchEvent` (touch): 8/8 rätt,
  8 stjärnor, resultatrutan "8 av 8 rätt". Ett avsiktligt felsvar flyttade inte
  uppgiften vidare.
- Ryms utan scroll i 1024×768, 768×1024, 390×844 och 1440×900
  (`scrollHeight-innerHeight = 0`, `scrollWidth-innerWidth = 0`).
- Tryckytor: två mattor, 300×336 px på iPad liggande (min 179×200 px på mobil).
