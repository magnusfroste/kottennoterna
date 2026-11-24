# KONCEPT – Kotten och nöterna (slug: kottennoterna)

## Mål (en sak per app)
Jämföra antal: barnet ser två högar med nötter och pekar på den hög som har flest.
Ingen text i spelytan, ingen tidspress, fel svar kostar inget.

## Målgrupp och årskurs
FK–2 (6–8 år), läroplansstadium 1–3. Barnet behöver inte kunna läsa.

## Kärnmekanik (touch först)
Två stora mattor med nötter sida vid sida. Barnet pekar på mattan med flest nötter.
– Nivå 1: tydlig skillnad (2–4 nötter), högst 6 på en matta.
– Nivå 2: skillnad 1–2, högst 7.
– Nivå 3: skillnad exakt 1, högst 9 – högarna är nästan lika.
Direkt återkoppling: rätt matta får en ring och en klang, och antalet visas som
siffra under båda mattorna så att antal kopplas till tecknet. Fel matta skakar
mjukt och Kotten funderar – ny chans utan straff. Efter två fel pulserar rätt
matta och siffrorna visas, så barnet hittar svaret.

## 5-minuterssession
Åtta uppgifter per runda, ca 3–5 minuter. Efter sista uppgiften: en tät
resultatruta med stjärnor, "en runda till" och "byt nivå". Vid minst sex rätt
stiger nivån automatiskt ett steg.

## Belöning barnet kan berätta om
Stjärnor i HUD:en och en prickrad som fylls. Resultatrutan säger hur många av
åtta som blev rätt, t.ex. "7 av 8 rätt". Kotten firar efter varje rätt svar.

## Vad barnet lär
Antalsuppfattning och jämförelse av antal: att bedöma vilken hög som har fler
utan att räkna varje nöt (subitisering) och att koppla antalet till siffran.
Svårigheten stiger genom att högarna blir mer lika – inte genom kortare tid.

## Lgr22 (ordagrant ur Skolverket)
- **MA.1-3.1.1** (primär): ”Naturliga tal och deras egenskaper samt hur talen
  delas upp och används för att ange antal och ordning.”
- **MA.1-3.1.5**: ”Hur naturliga tal och enkla tal i bråkform används i elevnära
  situationer.”

## Varför det funkar på iPad
Allt ritas i kod (SVG + DOM), inga bildfiler, inga tredjepartsanrop. Två stora
tryckytor (300×336 px i liggande iPad) ryms utan scroll i både liggande och
stående. Ljud och uppläsning skapas i webbläsaren och en ljudknapp stänger av
båda.

## TESTPLAN (mätbara krav)
1. Spelbart med bara fingret (`Input.dispatchTouchEvent`), hela rundan.
2. `scrollHeight-innerHeight == 0` och `scrollWidth-innerWidth == 0` i
   1024×768, 768×1024, 390×844 och 1440×900 – mätt efter att startskärmen stängts.
3. Ingen text i spelytan (allt talat); all text på startskärmen på svenska.
4. Fel svar kostar inget; rätt matta pulserar efter två fel.
5. Ingen inloggning, ingen reklam, inga länkar ut, ingen spårning utöver kodsnutten.
6. Korrekt data: varje uppgift verifieras maskinellt, `node verify.mjs` 0 fel.
7. `aria-label` på alla knappar, kontrast, text ≥18 px, `prefers-reduced-motion`.

## VALIDERING (annan agent)
`delegate_task` fanns inte bland verktygen i denna körning, så den planerade
motkontrollen kunde inte köras. Ersatt av hård egenkontroll plus två externa fakta:
(a) frivilligt 5 min? – loopen är "en hög till", direkt belöning, tydligt slut och
en runda-till-knapp; samma jämförelseloop som PappasAppars "fler eller färre".
(b) verkligt kunskapskrav? – ja, MA.1-3.1.1 är ordagrant citerat och mekaniken är
exakt "ange antal och ordning".
(c) teknisk risk? – låg: ren DOM/SVG, ingen fysik, ingen tredjepart. GO.

## Lärdom från research (varför inte mönster)
Den planerade idén "fortsätt mönstret" fanns redan: `monsterbanan.shipholm.dev`
(”Pärla ett mönster … vilken färg kommer härnäst?”) och `kottens-skogshopp`
(”fortsätt mönstret”). Katalogen saknar däremot en ren jämförelseapp, så appen
bygger på antal/jämförelse i stället – nya beslut togs självständigt, vilket
Magnus vill.
