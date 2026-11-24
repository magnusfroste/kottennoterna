# Kotten och nöterna

Statisk webbapp (FK–2, matematik): jämför antal. Två högar med nötter visas,
barnet pekar på den som har flest. Skillnaden mellan högarna minskar i steg.
Tränar MA.1-3.1.1 (ange antal och ordning) och MA.1-3.1.5.

Inga beroenden, inga konton, ingen spårning utöver skolappar-kodsnutten.

- `public/` – hela appen (serveras av nginx i containern)
- `verify.mjs` – maskinell kontroll av uppgiftsgeneratorn
- `kit.py` – ritar ikoner, favicon och og-bild
