/* Kotten och nöterna – vilken sida har flest? Statisk app, inga beroenden.
   Tränar MA.1-3.1.1 (ange antal och ordning) och MA.1-3.1.5 (naturliga tal i
   elevnära situationer). Allt ritas i kod: nötter och Kotten i SVG, ljud i WebAudio. */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   * 1. Nötter och Kotten (SVG, egen figur)                              *
   * ------------------------------------------------------------------ */
  function enKotte(x, y) { /* en nöt i rutan 20x24 */
    return '<g transform="translate(' + x + ',' + y + ')">' +
      '<ellipse cx="10" cy="15" rx="7" ry="7.4" fill="#d8a266"/>' +
      '<path d="M2 9 q8 -4 16 0 v-2 q-8 -3 -16 0 z" fill="#8a5f36"/>' +
      '<rect x="9" y="2.5" width="2.4" height="4" rx="1.2" fill="#6f4a28"/>' +
      '</g>';
  }
  function nötSvg(n) {
    var cols = Math.min(n, 3), rows = Math.ceil(n / 3);
    var W = cols * 20, H = rows * 24, k = 0, g = "";
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      if (k++ >= n) break;
      g += enKotte(c * 20, r * 24);
    }
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">' + g + '</svg>';
  }

  function kottenSvg(uttryck, klass) {
    var F = "#b07d4b", M = "#8a5f36", O = "#2b2118", mun, ogen = "", extra = "";
    if (uttryck === "hejar") { mun = '<path d="M22 36 q8 8 16 0" fill="none" stroke="' + O + '" stroke-width="2.4" stroke-linecap="round"/>'; }
    else if (uttryck === "firar") {
      mun = '<path d="M21 34 q9 12 18 0" fill="#fff"/><path d="M21 34 q9 12 18 0" fill="none" stroke="' + O + '" stroke-width="2.4" stroke-linecap="round"/>';
      extra = '<path d="M10 12 l3 6M50 12 l-3 6M30 6 v5" stroke="#e8a33d" stroke-width="2.2" stroke-linecap="round" fill="none"/>';
    }
    else if (uttryck === "tanker") { mun = '<path d="M24 37 h11" stroke="' + O + '" stroke-width="2.4" stroke-linecap="round" fill="none"/>'; ogen = '<circle cx="46" cy="24" r="4" fill="none" stroke="' + M + '" stroke-width="1.6" opacity=".5"/>'; }
    else if (uttryck === "funderar") { mun = '<path d="M22 38 q8 -6 16 0" fill="none" stroke="' + O + '" stroke-width="2.4" stroke-linecap="round"/>'; }
    else { mun = '<path d="M22 34 q8 8 16 0" fill="none" stroke="' + O + '" stroke-width="2.4" stroke-linecap="round"/>'; }
    var oga = '<circle cx="23" cy="24" r="5.2" fill="#fff"/><circle cx="37" cy="24" r="5.2" fill="#fff"/>' +
      '<circle cx="24" cy="24.6" r="2.5" fill="' + O + '"/><circle cx="36" cy="24.6" r="2.5" fill="' + O + '"/>';
    return '<svg class="' + (klass || "kotten-svg") + '" viewBox="0 0 60 60" aria-hidden="true">' + extra +
      '<path d="M30 6 q9 4 12 12 q9 12 4 24 q-4 12 -16 14 q-12 -2 -16 -14 q-5 -12 4 -24 q3 -8 12 -12z" fill="' + F + '"/>' +
      '<path d="M19 20 q11 -5 22 0M16 30 q14 -5 28 0M16 40 q14 -4 28 0" stroke="' + M + '" stroke-width="1.7" fill="none" opacity=".85" stroke-linecap="round"/>' +
      oga + ogen + mun + '</svg>';
  }

  /* ------------------------------------------------------------------ *
   * 2. Uppgiftsgenerator (ren funktion – verifieras av verify.mjs)      *
   *    Returnerar {v, h, mest, skillnad, niva} där v/h är antal nötter.  *
   *    Nivå 1: stor skillnad (2–4). Nivå 2: 1–2. Nivå 3: exakt 1.        *
   * ------------------------------------------------------------------ */
  function heltal(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }

  function bygg(niva) {
    var a, d, max;
    if (niva <= 1) { max = 6; d = heltal(2, 4); a = heltal(1, max - d); }
    else if (niva === 2) { max = 7; d = heltal(1, 2); a = heltal(1, max - d); }
    else { max = 9; d = 1; a = heltal(1, max - d); }
    var b = a + d;
    if (Math.random() < 0.5) { var t = a; a = b; b = t; }
    return { v: a, h: b, mest: a > b ? "v" : "h", skillnad: d, niva: niva, max: max };
  }

  /* ------------------------------------------------------------------ *
   * 3. Ljud (WebAudio + talsyntes, skapas vid första gesten)            *
   * ------------------------------------------------------------------ */
  var ac = null, ljudPa = true;
  function ljud(frekvens, längd, typ) {
    if (!ljudPa) return;
    try {
      if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = typ || "sine"; o.frequency.value = frekvens;
      g.gain.value = 0.001; o.connect(g); g.connect(ac.destination);
      var t = ac.currentTime;
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + längd);
      o.start(t); o.stop(t + längd + 0.02);
    } catch (e) { }
  }
  function säg(text) {
    if (!ljudPa) return;
    try {
      if (!("speechSynthesis" in window) || !text) return;
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "sv-SE"; u.rate = 0.98; u.volume = 0.9;
      window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
    } catch (e) { }
  }
  function spår(namn, värde) { try { if (window.skolappar && window.skolappar.event) window.skolappar.event(namn, värde); } catch (e) { } }

  /* ------------------------------------------------------------------ *
   * 4. Tillstånd och flöde                                              *
   * ------------------------------------------------------------------ */
  var RUNDA = 8;
  var S = { skärm: "start", niva: 1, runda: 1, item: 0, svarRätt: 0, stjärnor: 0, felförsök: 0, p: null, klar: false };
  var elMattor = document.getElementById("mattor");

  function ritaPrickar() {
    var h = "";
    for (var i = 0; i < RUNDA; i++) h += '<i class="' + (i < S.item ? "klar" : "") + '"></i>';
    document.getElementById("prickar").innerHTML = h;
  }
  function ritaStjärnor() {
    document.getElementById("stjarnor").textContent = "★".repeat(Math.min(S.stjärnor, 12)) + (S.stjärnor > 12 ? "+" : "");
  }
  function kottenByt(uttryck) {
    var gammal = document.getElementById("kotten");
    if (!gammal) return;
    var ny = document.createElement("span");
    ny.innerHTML = kottenSvg(uttryck);
    gammal.replaceWith(ny.firstChild);
  }

  function matHtml(sida, n) {
    return '<button class="mat" data-sida="' + sida + '" aria-label="' + (sida === "v" ? "vänster" : "höger") + ' hög">' +
      '<span class="notter">' + nötSvg(n) + '</span>' +
      '<span class="tal">' + n + '</span></button>';
  }
  function ritaMattor() {
    elMattor.innerHTML = matHtml("v", S.p.v) + matHtml("h", S.p.h);
  }
  function visaTal() {
    elMattor.querySelectorAll(".mat").forEach(function (m) {
      m.querySelector(".tal").classList.add("syns");
    });
  }

  function nyPussel() {
    S.p = bygg(S.niva);
    S.klar = false; S.felförsök = 0;
    ritaMattor(); ritaPrickar();
  }

  function valj(sida) {
    if (S.skärm !== "spel" || S.klar) return;
    var m = elMattor.querySelector('.mat[data-sida="' + sida + '"]');
    if (sida === S.p.mest) {
      S.klar = true; S.item++; S.svarRätt++; S.stjärnor++;
      if (m) m.classList.add("rätt");
      visaTal(); ritaStjärnor(); ritaPrickar();
      ljud(660, 0.12, "sine");
      setTimeout(function () { ljud(880, 0.16, "sine"); }, 120);
      säg("Rätt! " + S.p.v + " och " + S.p.h + ".");
      kottenByt("firar");
      spår("round_done", Math.round(100 * S.svarRätt / RUNDA));
      setTimeout(function () {
        if (S.item >= RUNDA) rundaKlar();
        else { nyPussel(); kottenByt("glad"); }
      }, 850);
    } else {
      S.felförsök++;
      ljud(240, 0.14, "triangle");
      if (m) { m.classList.add("fel"); setTimeout(function () { m.classList.remove("fel"); }, 420); }
      kottenByt("funderar");
      spår("hint");
      if (S.felförsök >= 2) {
        var r = elMattor.querySelector('.mat[data-sida="' + S.p.mest + '"]');
        if (r) r.classList.add("visa");
        visaTal();
        säg("Nästan! Titta på den som lyser.");
      } else {
        säg("Nästan! Prova igen.");
      }
    }
  }

  function rundaKlar() {
    S.skärm = "överlägg";
    var procent = Math.round(100 * S.svarRätt / RUNDA);
    spår("round_done", procent);
    säg("Rundan är klar. " + S.svarRätt + " av " + RUNDA + " rätt.");
    var stegUpp = S.svarRätt >= 6 && S.niva < 3;
    visaOverlay(S.svarRätt >= 6 ? "firar" : "hejar", "Rundan är klar!",
      S.svarRätt + " av " + RUNDA + " rätt. " + S.stjärnor + " stjärnor totalt." +
      (stegUpp ? " Nu blir högarna mer lika!" : ""),
      "En runda till →", function () {
        if (stegUpp) { S.niva++; spår("level", S.niva); }
        S.runda++; startaRunda(S.niva);
      }, true);
  }

  function visaOverlay(uttryck, titel, text, knapptext, vidare, medNiva) {
    var ov = document.getElementById("overlay");
    document.getElementById("ov-bild").innerHTML = kottenSvg(uttryck, "ov-kotten");
    document.getElementById("ov-titel").textContent = titel;
    document.getElementById("ov-text").textContent = text;
    var b = document.getElementById("ov-nasta");
    b.textContent = knapptext;
    b.onclick = function () { ov.hidden = true; vidare(); };
    var n = document.getElementById("ov-niva");
    n.hidden = !medNiva;
    n.onclick = function () { ov.hidden = true; S.niva = S.niva >= 3 ? 1 : S.niva + 1; S.runda++; startaRunda(S.niva); };
    ov.hidden = false;
  }

  function startaRunda(niva) {
    S.niva = niva; S.skärm = "spel"; S.item = 0; S.svarRätt = 0; S.felförsök = 0;
    document.getElementById("startskarm").hidden = true;
    document.getElementById("spel").hidden = false;
    document.getElementById("overlay").hidden = true;
    ritaStjärnor(); nyPussel(); kottenByt("glad");
    spår("round_start"); spår("level", niva);
    säg(niva === 1 ? "Peka på högen som har flest nötter."
      : niva === 2 ? "Vilken hög har flest nötter? Titta noga."
      : "Nu är högarna nästan lika. Vilken har flest?");
  }

  function tipsa() {
    if (S.skärm !== "spel" || S.klar) return;
    var r = elMattor.querySelector('.mat[data-sida="' + S.p.mest + '"]');
    if (r) r.classList.add("visa");
    visaTal();
    säg("Den som lyser har flest.");
    spår("hint"); kottenByt("tanker");
  }

  /* ------------------------------------------------------------------ *
   * 5. Händelser och start                                             *
   * ------------------------------------------------------------------ */
  function ritaLjudIkon() {
    document.getElementById("ljudikon").innerHTML = ljudPa
      ? '<path d="M4 9h3l4-3v12l-4-3H4z"/><path d="M15 8a5 5 0 0 1 0 8"/>'
      : '<path d="M4 9h3l4-3v12l-4-3H4z"/><path d="M15 9l5 6M20 9l-5 6"/>';
  }

  function bind() {
    elMattor.addEventListener("click", function (e) {
      var m = e.target.closest(".mat");
      if (m) valj(m.dataset.sida);
    });
    document.getElementById("spela").addEventListener("click", function () { ljud(600, 0.1); startaRunda(1); });
    document.getElementById("hjalp").addEventListener("click", tipsa);
    document.getElementById("ljud").addEventListener("click", function () {
      ljudPa = !ljudPa;
      if (!ljudPa && "speechSynthesis" in window) { try { window.speechSynthesis.cancel(); } catch (e) { } }
      ritaLjudIkon(); spår("sound_off");
    });
    document.addEventListener("keydown", function (e) {
      if (S.skärm !== "spel") return;
      if (e.key === "ArrowLeft" || e.key === "1") valj("v");
      if (e.key === "ArrowRight" || e.key === "2") valj("h");
    });
  }

  function init() {
    bind(); ritaLjudIkon(); ritaStjärnor(); ritaPrickar();
    var hud = document.querySelector(".kotten-hud");
    if (hud) hud.outerHTML = kottenSvg("glad", "kotten-hud");
    var k = document.getElementById("kotten");
    if (k) k.outerHTML = kottenSvg("glad", "kotten-svg");
    window.__game = {
      S: S, bygg: bygg, valj: valj, startaRunda: startaRunda, nyPussel: nyPussel,
      ritaMattor: ritaMattor, tipsa: tipsa, nötSvg: nötSvg
    };
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
