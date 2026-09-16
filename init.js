const fs = require('fs');
const path = require('path');

// ============================================================
// HTML 模板
// ============================================================
function buildIndexHtml(forceLang, htmlLang, canonicalPath) {
  const forceLine = forceLang
    ? `<script>window.__FORCE_LANG__ = '${forceLang}';<\/script>\n`
    : '';
  const canonical = `https://toolara.dev${canonicalPath}`;

  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Calligraphy Ink Calculator — Estimate Ink Usage and Cost Per Project</title>
<meta name="description" content="Free calligraphy ink calculator. Estimate how much ink your project needs and what it costs — based on text length, font size, paper type, and ink type.">
<meta name="keywords" content="calligraphy ink calculator, ink cost estimator, how much ink for calligraphy, dip pen ink usage, ink cost per project">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta name="theme-color" content="#1a1614">

<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="https://toolara.dev/calligraphy-ink-estimator/">
<link rel="alternate" hreflang="zh-Hans" href="https://toolara.dev/calligraphy-ink-estimator/zh/">
<link rel="alternate" hreflang="zh-Hant" href="https://toolara.dev/calligraphy-ink-estimator/zh-tw/">
<link rel="alternate" hreflang="ja" href="https://toolara.dev/calligraphy-ink-estimator/ja/">
<link rel="alternate" hreflang="ko" href="https://toolara.dev/calligraphy-ink-estimator/ko/">
<link rel="alternate" hreflang="de" href="https://toolara.dev/calligraphy-ink-estimator/de/">
<link rel="alternate" hreflang="ru" href="https://toolara.dev/calligraphy-ink-estimator/ru/">
<link rel="alternate" hreflang="es" href="https://toolara.dev/calligraphy-ink-estimator/es/">
<link rel="alternate" hreflang="x-default" href="https://toolara.dev/calligraphy-ink-estimator/">

<meta property="og:type" content="website">
<meta property="og:title" content="Calligraphy Ink Calculator — Estimate Usage and Cost">
<meta property="og:description" content="Estimate how much ink your calligraphy project needs and what it costs.">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Calligraphy Ink Cost Estimator",
  "url": "${canonical}",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Any",
  "description": "Free calculator that estimates ink usage and cost for calligraphy projects.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
<\/script>

${forceLine}<link rel="stylesheet" href="css/style.css">
</head>
<body>

<header class="hero">
  <div class="lang-switch">
    <select id="langSelect" onchange="setLang(this.value)" aria-label="Language">
      <option value="en">English</option>
      <option value="zh">简体中文</option>
      <option value="zh-TW">繁體中文</option>
      <option value="ja">日本語</option>
      <option value="ko">한국어</option>
      <option value="de">Deutsch</option>
      <option value="ru">Русский</option>
      <option value="es">Español</option>
    </select>
  </div>
  <div class="hero-inner">
    <div class="hero-badge">🖋️ Calligraphy</div>
    <h1 data-i18n="title">Calligraphy Ink Calculator</h1>
    <p data-i18n="subtitle">Estimate how much ink your project needs and what it costs — before you start writing.</p>
  </div>
</header>

<main class="wrap">
  <section class="card">
    <h2 class="visually-hidden" data-i18n="calcHeading">Calculator</h2>

    <div class="row">
      <div>
        <label for="charCount" data-i18n="charLabel">Number of characters</label>
        <input type="number" id="charCount" min="1" step="1" placeholder="500" inputmode="numeric">
      </div>
      <div>
        <label for="fontSize" data-i18n="sizeLabel">Font size (mm)</label>
        <input type="number" id="fontSize" min="1" step="0.5" placeholder="8" value="8" inputmode="decimal">
      </div>
    </div>

    <label for="paper" data-i18n="paperLabel">Paper type</label>
    <select id="paper">
      <option value="smooth" data-i18n="paperSmooth">Smooth (coated, Bristol)</option>
      <option value="standard" selected data-i18n="paperStandard">Standard (bond, cartridge)</option>
      <option value="absorbent" data-i18n="paperAbsorbent">Absorbent (watercolor, rice paper)</option>
    </select>

    <label for="inkType" data-i18n="inkLabel">Ink type</label>
    <select id="inkType">
      <option value="dye" selected data-i18n="inkDye">Dye-based</option>
      <option value="pigment" data-i18n="inkPigment">Pigment-based</option>
      <option value="waterproof" data-i18n="inkWaterproof">Waterproof / India ink</option>
    </select>

    <div class="row">
      <div>
        <label for="bottleSize" data-i18n="bottleLabel">Bottle size (mL)</label>
        <input type="number" id="bottleSize" min="1" step="1" placeholder="30" value="30" inputmode="decimal">
      </div>
      <div>
        <label for="bottlePrice" data-i18n="priceLabel">Bottle price ($)</label>
        <input type="number" id="bottlePrice" min="0" step="0.5" placeholder="12" value="12" inputmode="decimal">
      </div>
    </div>

    <button class="calc" type="button" onclick="calculate()" data-i18n="calcBtn">Calculate ink needed</button>

    <div id="result" role="region" aria-live="polite">
      <div class="result-label" data-i18n="resultLabel">Estimated ink needed</div>
      <div class="ink-volume"><span id="inkVolume">—</span></div>
      <div class="freq-note" id="costNote"></div>

      <div class="breakdown">
        <div class="bd-row"><span data-i18n="bdChars">Characters</span><strong id="bdChars">—</strong></div>
        <div class="bd-row"><span data-i18n="bdSize">Font size</span><strong id="bdSize">—</strong></div>
        <div class="bd-row"><span data-i18n="bdPaper">Paper factor</span><strong id="bdPaper">—</strong></div>
        <div class="bd-row"><span data-i18n="bdInk">Ink factor</span><strong id="bdInk">—</strong></div>
        <div class="bd-row"><span data-i18n="bdCost">Project cost</span><strong id="bdCost">—</strong></div>
        <div class="bd-row"><span data-i18n="bdProjects">Projects per bottle</span><strong id="bdProjects">—</strong></div>
      </div>
      <div class="result-disclaimer" data-i18n="resultDisclaimer">Estimate only. Actual ink usage varies by nib, writing pressure, and individual style. Always test on a scrap first.</div>
    </div>
  </section>

  <section>
    <h2 data-i18n="whatIsTitle">How ink usage is estimated</h2>
    <p data-i18n="whatIsText">Ink consumption in calligraphy depends on four main factors: the number of characters, the font size (which grows quadratically), the absorbency of the paper, and the formulation of the ink. This calculator combines these into a practical estimate so you can plan your project and budget before dipping your pen.</p>
  </section>

  <section>
    <h2 data-i18n="factorsTitle">What affects ink consumption</h2>
    <h3 data-i18n="f1Title">Font size</h3>
    <p data-i18n="f1Text">When you double the font size, the ink usage roughly quadruples. This is because ink covers area, and area scales with the square of linear dimensions.</p>

    <h3 data-i18n="f2Title">Paper type</h3>
    <ul>
      <li data-i18n="f2a"><strong>Smooth paper</strong> (coated, Bristol): ink sits on the surface, uses ~15% less</li>
      <li data-i18n="f2b"><strong>Standard paper</strong> (bond, cartridge): baseline</li>
      <li data-i18n="f2c"><strong>Absorbent paper</strong> (watercolor, rice paper): ink spreads into fibers, uses up to 50% more</li>
    </ul>

    <h3 data-i18n="f3Title">Ink type</h3>
    <ul>
      <li data-i18n="f3a"><strong>Dye-based</strong>: thin, flows easily, baseline consumption</li>
      <li data-i18n="f3b"><strong>Pigment-based</strong>: thicker particles, ~10–15% more ink per stroke</li>
      <li data-i18n="f3c"><strong>Waterproof / India ink</strong>: dense, covers more, uses ~20% more</li>
    </ul>
  </section>

  <section>
    <h2 data-i18n="howToTitle">How to use this calculator</h2>
    <ol>
      <li data-i18n="howTo1">Count the total characters in your project (letters, spaces excluded).</li>
      <li data-i18n="howTo2">Enter your intended font size in millimeters (x-height or cap height).</li>
      <li data-i18n="howTo3">Choose the paper type you'll write on.</li>
      <li data-i18n="howTo4">Select the ink type you're using.</li>
      <li data-i18n="howTo5">Enter your bottle size and price to see cost per project.</li>
    </ol>
  </section>

  <section>
    <h2 data-i18n="faqTitle">Frequently asked questions</h2>
    <h3 data-i18n="faq1q">How much ink does a wedding invitation need?</h3>
    <p data-i18n="faq1a">A typical wedding invitation with a couple's names, date, and venue — about 80–120 characters at 6–8mm font size — uses roughly 0.3–0.6 mL of dye-based ink. In practice, you'll dip your pen 30–60 times.</p>

    <h3 data-i18n="faq2q">How many pages can one 30 mL bottle cover?</h3>
    <p data-i18n="faq2a">A 30 mL bottle of dye-based ink on standard paper can cover roughly 40,000–60,000 characters at 8mm font size. That's equivalent to 80–120 typical wedding envelopes or 30–50 full pages of dense text.</p>

    <h3 data-i18n="faq3q">Does ink go bad?</h3>
    <p data-i18n="faq3a">Yes. Most calligraphy inks last 2–4 years unopened and 6–18 months once opened. Pigment inks tend to separate and need shaking. Store bottles upright, away from direct sunlight, and check for mold or unusual odor before use.</p>

    <h3 data-i18n="faq4q">Why does my ink run out faster than estimated?</h3>
    <p data-i18n="faq4a">Common causes: absorbent paper, heavy pressure, a broad or flexible nib, or a thick ink that leaves more residue on the nib. If you're doing a large project, always buy one extra bottle.</p>

    <div class="disclaimer" data-i18n="disclaimer"><strong>Note:</strong> This is an estimate for planning purposes. Actual ink usage varies widely by nib, pressure, and writing style. Always test on scrap paper first.</div>
  </section>
</main>

<footer class="footer" data-i18n="footer">Runs entirely in your browser. No data is collected or stored.</footer>

<script src="js/i18n.js"><\/script>
<script src="js/calculator.js"><\/script>
</body>
</html>`;
}

// ============================================================
// CSS — 水墨宣纸风
// ============================================================
const STYLE_CSS = `:root {
  --bg: #f7f3ea; --card: #fffdf8; --text: #1a1614; --muted: #7a6e60;
  --accent: #c9a961; --accent-dark: #a8894a; --ink: #2b2521; --gold: #d4af6a;
  --border: #e8dfd0; --radius: 14px;
  --shadow: 0 1px 3px rgba(26,22,20,0.06), 0 8px 24px rgba(26,22,20,0.06);
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", "Noto Serif CJK SC", Georgia, serif; background: var(--bg); color: var(--text); line-height: 1.65; -webkit-font-smoothing: antialiased; }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

/* ---------- Hero ---------- */
.hero {
  position: relative;
  overflow: hidden;
  color: #f7f3ea;
  padding: 64px 20px 96px;
  background:
    radial-gradient(circle at 20% 20%, rgba(201,169,97,0.25) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(212,175,106,0.18) 0%, transparent 55%),
    linear-gradient(135deg, #1a1614 0%, #2b2521 55%, #3d342c 100%);
}
.hero::before {
  content: "";
  position: absolute; inset: 0;
  background-image:
    radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 32px 32px, 48px 48px;
  background-position: 0 0, 16px 16px;
  pointer-events: none;
}
.hero::after {
  content: "";
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.35) 100%);
  pointer-events: none;
}
.hero-inner { max-width: 720px; margin: 0 auto; position: relative; z-index: 2; text-align: center; }
.hero-badge {
  display: inline-block;
  background: rgba(201,169,97,0.18);
  border: 1px solid rgba(201,169,97,0.45);
  color: #d4af6a;
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: 18px;
}
.hero h1 { font-size: 2.1rem; margin: 0 0 12px; font-weight: 800; letter-spacing: -0.02em; }
.hero p { margin: 0 auto; opacity: 0.9; font-size: 1rem; max-width: 560px; }

/* ---------- Lang switcher ---------- */
.lang-switch { position: absolute; top: 16px; right: 16px; z-index: 3; }
.lang-switch select {
  appearance: none; -webkit-appearance: none;
  background-color: rgba(255,255,255,0.10);
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23d4af6a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat; background-position: right 10px center; background-size: 14px;
  border: 1px solid rgba(201,169,97,0.35);
  color: #f7f3ea; padding: 7px 32px 7px 12px; border-radius: 8px;
  font-size: 0.85rem; font-family: inherit; cursor: pointer;
}
.lang-switch select:hover { background-color: rgba(255,255,255,0.20); }
.lang-switch select option { color: #1a1614; background: #fff; }

/* ---------- Layout ---------- */
.wrap { max-width: 720px; margin: -56px auto 0; padding: 0 20px 64px; position: relative; z-index: 2; }
.card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; margin-bottom: 22px; box-shadow: var(--shadow); }

label { display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 6px; }
input, select { width: 100%; padding: 11px 13px; border: 1px solid #d8cdb8; border-radius: 9px; font-size: 1rem; margin-bottom: 18px; background: #fff; color: var(--text); transition: border-color 0.15s, box-shadow 0.15s; font-family: inherit; }
input:focus, select:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(201,169,97,0.20); }
.row { display: flex; gap: 14px; }
.row > div { flex: 1; }
button.calc { width: 100%; padding: 15px; background: var(--ink); color: #f7f3ea; border: none; border-radius: 9px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.15s, transform 0.1s; font-family: inherit; letter-spacing: 0.02em; }
button.calc:hover { background: #000; }
button.calc:active { transform: scale(0.99); }

/* ---------- Result ---------- */
#result { margin-top: 24px; padding: 24px; border-radius: 14px; background: linear-gradient(135deg, #fdf9ee 0%, #f7f3ea 100%); border: 2px solid var(--accent); display: none; animation: fadeIn 0.35s ease; }
#result.show { display: block; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.result-label { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.07em; font-weight: 700; color: #a8894a; margin-bottom: 4px; }
.ink-volume { font-size: 2.8rem; font-weight: 800; color: #1a1614; line-height: 1; letter-spacing: -0.02em; }
.ink-volume::after { content: " mL"; font-size: 1rem; font-weight: 500; color: var(--muted); margin-left: 6px; }
.freq-note { font-size: 0.9rem; color: #a8894a; margin-top: 8px; font-weight: 600; }
.breakdown { margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(201,169,97,0.30); }
.bd-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 0.9rem; color: #3d342c; }
.bd-row strong { color: #1a1614; font-weight: 600; }
.result-disclaimer { margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(201,169,97,0.20); font-size: 0.78rem; color: var(--muted); }

/* ---------- Content ---------- */
h2 { font-size: 1.25rem; margin: 36px 0 12px; letter-spacing: -0.01em; }
h3 { font-size: 1rem; margin: 22px 0 6px; }
p { margin: 0 0 14px; }
ul, ol { margin: 0 0 16px; padding-left: 22px; }
li { margin-bottom: 8px; line-height: 1.65; }
table { width: 100%; border-collapse: collapse; font-size: 0.9rem; margin: 14px 0; }
th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #e8dfd0; }
th { background: #fdf9ee; font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em; color: #a8894a; }
tr:last-child td { border-bottom: none; }
.disclaimer { font-size: 0.85rem; color: var(--muted); border-left: 3px solid var(--accent); padding: 4px 0 4px 14px; margin-top: 18px; }
.footer { text-align: center; font-size: 0.8rem; color: var(--muted); padding: 24px 20px 48px; }

@media (max-width: 560px) {
  .hero { padding: 48px 16px 80px; }
  .hero h1 { font-size: 1.5rem; }
  .lang-switch { position: static; display: flex; justify-content: center; margin-bottom: 16px; }
  .wrap { padding: 0 14px 48px; }
  .card { padding: 20px; }
  .row { flex-direction: column; gap: 0; }
  .ink-volume { font-size: 2.2rem; }
}`;

// ============================================================
// i18n.js — 动态前缀检测
// ============================================================
const I18N_JS = `const SUPPORTED_LANGS = ['en','zh','zh-TW','ja','ko','de','ru','es'];
const DEFAULT_LANG = 'en';
const MARKER = '/calligraphy-ink-estimator';

const LANG_TO_PATH = { 'en':'/', 'zh':'/zh/', 'zh-TW':'/zh-tw/', 'ja':'/ja/', 'ko':'/ko/', 'de':'/de/', 'ru':'/ru/', 'es':'/es/' };
const SEG_TO_LANG = { 'zh':'zh', 'zh-tw':'zh-TW', 'ja':'ja', 'ko':'ko', 'de':'de', 'ru':'ru', 'es':'es' };

let currentLang = DEFAULT_LANG;
let translations = {};
const cache = {};

function getBase() {
  const p = window.location.pathname;
  const idx = p.indexOf(MARKER);
  if (idx !== -1) return p.slice(0, idx + MARKER.length);
  return '';
}

function detectPageLang() {
  if (window.__FORCE_LANG__ && SUPPORTED_LANGS.includes(window.__FORCE_LANG__)) return window.__FORCE_LANG__;
  const p = window.location.pathname;
  const base = getBase();
  const rest = base ? p.slice(base.length) : p;
  const segs = rest.split('/').filter(Boolean);
  if (segs.length > 0) {
    const first = segs[0].toLowerCase();
    if (SEG_TO_LANG[first]) return SEG_TO_LANG[first];
  }
  return DEFAULT_LANG;
}

async function loadLocale(lang) {
  if (cache[lang]) return cache[lang];
  const base = getBase();
  const res = await fetch(base + '/locales/' + lang + '.json');
  if (!res.ok) throw new Error('Failed to load locale: ' + lang);
  const data = await res.json();
  cache[lang] = data;
  return data;
}

function applyTranslations(t) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] === undefined) return;
    if (key === 'disclaimer') el.innerHTML = t[key];
    else el.textContent = t[key];
  });
}

async function initPage() {
  const lang = detectPageLang();
  try { translations = await loadLocale(lang); }
  catch (err) { console.error(err); return; }
  currentLang = lang;
  document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : lang === 'zh-TW' ? 'zh-Hant' : lang;
  applyTranslations(translations);
  const select = document.getElementById('langSelect');
  if (select) select.value = lang;
  window.__i18n = { t: translations, lang: currentLang };
}

function setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;
  const base = getBase();
  window.location.href = base + (LANG_TO_PATH[lang] || '/');
}

document.addEventListener('DOMContentLoaded', initPage);`;

// ============================================================
// calculator.js
// ============================================================
const CALCULATOR_JS = `function t() { return (window.__i18n && window.__i18n.t) || {}; }

// 基础墨水消耗：8mm 字号、每个字符、标准纸张、染料墨水 = 0.0075 mL
const BASE_ML_PER_CHAR_AT_8MM = 0.0075;

const PAPER_FACTOR = {
  smooth: 0.85,
  standard: 1.00,
  absorbent: 1.50
};

const INK_FACTOR = {
  dye: 1.00,
  pigment: 1.15,
  waterproof: 1.20
};

function calculate() {
  const tr = t();
  const chars = parseFloat(document.getElementById('charCount').value);
  const size = parseFloat(document.getElementById('fontSize').value);
  const paper = document.getElementById('paper').value;
  const ink = document.getElementById('inkType').value;
  const bottleSize = parseFloat(document.getElementById('bottleSize').value);
  const bottlePrice = parseFloat(document.getElementById('bottlePrice').value);

  if (!chars || chars <= 0) { alert(tr.alertChars || 'Please enter the number of characters.'); return; }
  if (!size || size <= 0) { alert(tr.alertSize || 'Please enter a valid font size.'); return; }
  if (!bottleSize || bottleSize <= 0) { alert(tr.alertBottle || 'Please enter the bottle size.'); return; }

  const sizeFactor = Math.pow(size / 8, 2);
  const paperF = PAPER_FACTOR[paper] || 1.0;
  const inkF = INK_FACTOR[ink] || 1.0;

  const totalMl = chars * BASE_ML_PER_CHAR_AT_8MM * sizeFactor * paperF * inkF;
  const totalMlRounded = Math.round(totalMl * 1000) / 1000;

  const pricePerMl = bottlePrice / bottleSize;
  const projectCost = totalMl * pricePerMl;
  const projectsPerBottle = Math.floor(bottleSize / totalMl);

  const fmtMl = v => v.toFixed(3) + ' mL';
  const fmtUsd = v => '$' + v.toFixed(2);

  document.getElementById('inkVolume').textContent = totalMlRounded.toFixed(3);

  const noteTemplate = tr.costNote || 'Approximate cost: {cost} · About {n} project(s) per bottle';
  document.getElementById('costNote').textContent = noteTemplate
    .replace('{cost}', fmtUsd(projectCost))
    .replace('{n}', projectsPerBottle);

  document.getElementById('bdChars').textContent = chars.toLocaleString();
  document.getElementById('bdSize').textContent = size + ' mm';
  document.getElementById('bdPaper').textContent = '×' + paperF.toFixed(2);
  document.getElementById('bdInk').textContent = '×' + inkF.toFixed(2);
  document.getElementById('bdCost').textContent = fmtUsd(projectCost);
  document.getElementById('bdProjects').textContent = projectsPerBottle;

  document.getElementById('result').classList.add('show');
}

window.calculate = calculate;`;

// ============================================================
// Locales
// ============================================================
const LOCALES = {
  'en': {
    title: "Calligraphy Ink Calculator",
    subtitle: "Estimate how much ink your project needs and what it costs — before you start writing.",
    calcHeading: "Calculator",
    charLabel: "Number of characters", sizeLabel: "Font size (mm)",
    paperLabel: "Paper type",
    paperSmooth: "Smooth (coated, Bristol)", paperStandard: "Standard (bond, cartridge)", paperAbsorbent: "Absorbent (watercolor, rice paper)",
    inkLabel: "Ink type",
    inkDye: "Dye-based", inkPigment: "Pigment-based", inkWaterproof: "Waterproof / India ink",
    bottleLabel: "Bottle size (mL)", priceLabel: "Bottle price ($)",
    calcBtn: "Calculate ink needed",
    resultLabel: "Estimated ink needed",
    costNote: "Approximate cost: {cost} · About {n} project(s) per bottle",
    bdChars: "Characters", bdSize: "Font size", bdPaper: "Paper factor", bdInk: "Ink factor",
    bdCost: "Project cost", bdProjects: "Projects per bottle",
    resultDisclaimer: "Estimate only. Actual ink usage varies by nib, writing pressure, and individual style. Always test on a scrap first.",
    whatIsTitle: "How ink usage is estimated",
    whatIsText: "Ink consumption in calligraphy depends on four main factors: the number of characters, the font size (which grows quadratically), the absorbency of the paper, and the formulation of the ink. This calculator combines these into a practical estimate so you can plan your project and budget before dipping your pen.",
    factorsTitle: "What affects ink consumption",
    f1Title: "Font size",
    f1Text: "When you double the font size, the ink usage roughly quadruples. This is because ink covers area, and area scales with the square of linear dimensions.",
    f2Title: "Paper type",
    f2a: "Smooth paper (coated, Bristol): ink sits on the surface, uses ~15% less",
    f2b: "Standard paper (bond, cartridge): baseline",
    f2c: "Absorbent paper (watercolor, rice paper): ink spreads into fibers, uses up to 50% more",
    f3Title: "Ink type",
    f3a: "Dye-based: thin, flows easily, baseline consumption",
    f3b: "Pigment-based: thicker particles, ~10–15% more ink per stroke",
    f3c: "Waterproof / India ink: dense, covers more, uses ~20% more",
    howToTitle: "How to use this calculator",
    howTo1: "Count the total characters in your project (letters, spaces excluded).",
    howTo2: "Enter your intended font size in millimeters (x-height or cap height).",
    howTo3: "Choose the paper type you'll write on.",
    howTo4: "Select the ink type you're using.",
    howTo5: "Enter your bottle size and price to see cost per project.",
    faqTitle: "Frequently asked questions",
    faq1q: "How much ink does a wedding invitation need?",
    faq1a: "A typical wedding invitation with a couple's names, date, and venue — about 80–120 characters at 6–8mm font size — uses roughly 0.3–0.6 mL of dye-based ink. In practice, you'll dip your pen 30–60 times.",
    faq2q: "How many pages can one 30 mL bottle cover?",
    faq2a: "A 30 mL bottle of dye-based ink on standard paper can cover roughly 40,000–60,000 characters at 8mm font size. That's equivalent to 80–120 typical wedding envelopes or 30–50 full pages of dense text.",
    faq3q: "Does ink go bad?",
    faq3a: "Yes. Most calligraphy inks last 2–4 years unopened and 6–18 months once opened. Pigment inks tend to separate and need shaking. Store bottles upright, away from direct sunlight, and check for mold or unusual odor before use.",
    faq4q: "Why does my ink run out faster than estimated?",
    faq4a: "Common causes: absorbent paper, heavy pressure, a broad or flexible nib, or a thick ink that leaves more residue on the nib. If you're doing a large project, always buy one extra bottle.",
    disclaimer: "<strong>Note:</strong> This is an estimate for planning purposes. Actual ink usage varies widely by nib, pressure, and writing style. Always test on scrap paper first.",
    footer: "Runs entirely in your browser. No data is collected or stored.",
    alertChars: "Please enter the number of characters.",
    alertSize: "Please enter a valid font size.",
    alertBottle: "Please enter the bottle size."
  },
  'zh': {
    title: "书法墨水成本估算器",
    subtitle: "在开始书写之前，估算项目所需的墨水量和成本。",
    calcHeading: "计算器",
    charLabel: "字符数量", sizeLabel: "字号（毫米）",
    paperLabel: "纸张类型",
    paperSmooth: "光滑纸（铜版纸、布里斯托纸）", paperStandard: "普通纸（证券纸、卡纸）", paperAbsorbent: "吸墨纸（水彩纸、宣纸）",
    inkLabel: "墨水类型",
    inkDye: "染料墨水", inkPigment: "颜料墨水", inkWaterproof: "防水 / 印度墨",
    bottleLabel: "每瓶容量（毫升）", priceLabel: "每瓶价格（美元）",
    calcBtn: "计算所需墨水",
    resultLabel: "估算所需墨水",
    costNote: "预估成本：{cost} · 每瓶约可完成 {n} 个项目",
    bdChars: "字符数", bdSize: "字号", bdPaper: "纸张系数", bdInk: "墨水系数",
    bdCost: "项目成本", bdProjects: "每瓶可完成项目数",
    resultDisclaimer: "仅为估算值。实际用量会因笔尖、书写压力和个人风格而不同。建议先在废纸上测试。",
    whatIsTitle: "墨水用量是如何估算的",
    whatIsText: "书法墨水消耗量取决于四个主要因素：字符数量、字号（按平方增长）、纸张吸墨性以及墨水配方。本计算器综合这些因素，帮助您在动笔前做好预算和计划。",
    factorsTitle: "影响墨水消耗的因素",
    f1Title: "字号",
    f1Text: "当字号加倍时，墨水用量大约增加四倍。这是因为墨水覆盖的是面积，而面积与线性尺寸的平方成正比。",
    f2Title: "纸张类型",
    f2a: "光滑纸（铜版纸、布里斯托纸）：墨水停留在表面，用量约减少 15%",
    f2b: "普通纸（证券纸、卡纸）：基准",
    f2c: "吸墨纸（水彩纸、宣纸）：墨水渗入纤维，用量最多增加 50%",
    f3Title: "墨水类型",
    f3a: "染料墨水：稀薄、流畅，基准消耗",
    f3b: "颜料墨水：颗粒较厚，每笔多用约 10–15%",
    f3c: "防水 / 印度墨：浓稠、覆盖力强，多用约 20%",
    howToTitle: "如何使用本计算器",
    howTo1: "统计项目中的总字符数（不含空格）。",
    howTo2: "输入预计的字号（毫米，x 高度或大写高度）。",
    howTo3: "选择书写使用的纸张类型。",
    howTo4: "选择使用的墨水类型。",
    howTo5: "输入每瓶容量和价格，查看单次项目成本。",
    faqTitle: "常见问题",
    faq1q: "一份婚礼请柬需要多少墨水？",
    faq1a: "一份典型的婚礼请柬（含新人姓名、日期、地点，约 80–120 个字符，字号 6–8 毫米）大约消耗 0.3–0.6 毫升染料墨水。实际操作中大约需要蘸笔 30–60 次。",
    faq2q: "一瓶 30 毫升墨水可以写多少？",
    faq2a: "一瓶 30 毫升染料墨水在普通纸上，8 毫米字号下约可书写 40,000–60,000 个字符。相当于 80–120 份典型婚礼信封，或 30–50 页密集文字。",
    faq3q: "墨水会变质吗？",
    faq3a: "会。多数书法墨水未开封可保存 2–4 年，开封后 6–18 个月。颜料墨水容易分层，使用前需摇匀。请竖直存放，避免阳光直射，使用前检查是否有霉斑或异味。",
    faq4q: "为什么我的墨水比预估消耗更快？",
    faq4a: "常见原因：使用吸墨纸、书写压力较大、笔尖较宽或弹性大，或墨水较稠、在笔尖残留较多。进行大型项目时，建议多备一瓶。",
    disclaimer: "<strong>注意：</strong>本结果仅供计划参考。实际用量会因笔尖、压力和书写风格而差异较大。建议先在废纸上测试。",
    footer: "完全在您的浏览器中运行。不收集、不存储任何数据。",
    alertChars: "请输入字符数量。",
    alertSize: "请输入有效的字号。",
    alertBottle: "请输入每瓶容量。"
  },
  'zh-TW': {
    title: "書法墨水成本估算器",
    subtitle: "在開始書寫之前，估算項目所需的墨水量和成本。",
    calcHeading: "計算器",
    charLabel: "字元數量", sizeLabel: "字級（公釐）",
    paperLabel: "紙張類型",
    paperSmooth: "光滑紙（銅版紙、布里斯托紙）", paperStandard: "普通紙（證券紙、卡紙）", paperAbsorbent: "吸墨紙（水彩紙、宣紙）",
    inkLabel: "墨水類型",
    inkDye: "染料墨水", inkPigment: "顏料墨水", inkWaterproof: "防水 / 印度墨",
    bottleLabel: "每瓶容量（毫升）", priceLabel: "每瓶價格（美元）",
    calcBtn: "計算所需墨水",
    resultLabel: "估算所需墨水",
    costNote: "預估成本：{cost} · 每瓶約可完成 {n} 個項目",
    bdChars: "字元數", bdSize: "字級", bdPaper: "紙張係數", bdInk: "墨水係數",
    bdCost: "項目成本", bdProjects: "每瓶可完成項目數",
    resultDisclaimer: "僅為估算值。實際用量會因筆尖、書寫壓力和個人風格而不同。建議先在廢紙上測試。",
    whatIsTitle: "墨水用量是如何估算的",
    whatIsText: "書法墨水消耗量取決於四個主要因素：字元數量、字級（按平方增長）、紙張吸墨性以及墨水配方。本計算器綜合這些因素，幫助您在動筆前做好預算和計劃。",
    factorsTitle: "影響墨水消耗的因素",
    f1Title: "字級",
    f1Text: "當字級加倍時，墨水用量大約增加四倍。這是因為墨水覆蓋的是面積，而面積與線性尺寸的平方成正比。",
    f2Title: "紙張類型",
    f2a: "光滑紙（銅版紙、布里斯托紙）：墨水停留在表面，用量約減少 15%",
    f2b: "普通紙（證券紙、卡紙）：基準",
    f2c: "吸墨紙（水彩紙、宣紙）：墨水滲入纖維，用量最多增加 50%",
    f3Title: "墨水類型",
    f3a: "染料墨水：稀薄、流暢，基準消耗",
    f3b: "顏料墨水：顆粒較厚，每筆多用約 10–15%",
    f3c: "防水 / 印度墨：濃稠、覆蓋力強，多用約 20%",
    howToTitle: "如何使用本計算器",
    howTo1: "統計項目中的總字元數（不含空格）。",
    howTo2: "輸入預計的字級（公釐，x 高度或大寫高度）。",
    howTo3: "選擇書寫使用的紙張類型。",
    howTo4: "選擇使用的墨水類型。",
    howTo5: "輸入每瓶容量和價格，查看單次項目成本。",
    faqTitle: "常見問題",
    faq1q: "一份婚禮請柬需要多少墨水？",
    faq1a: "一份典型的婚禮請柬（含新人姓名、日期、地點，約 80–120 個字元，字級 6–8 公釐）大約消耗 0.3–0.6 毫升染料墨水。實際操作中大約需要蘸筆 30–60 次。",
    faq2q: "一瓶 30 毫升墨水可以寫多少？",
    faq2a: "一瓶 30 毫升染料墨水在普通紙上，8 公釐字級下約可書寫 40,000–60,000 個字元。相當於 80–120 份典型婚禮信封，或 30–50 頁密集文字。",
    faq3q: "墨水會變質嗎？",
    faq3a: "會。多數書法墨水未開封可保存 2–4 年，開封後 6–18 個月。顏料墨水容易分層，使用前需搖勻。請豎直存放，避免陽光直射，使用前檢查是否有黴斑或異味。",
    faq4q: "為什麼我的墨水比預估消耗更快？",
    faq4a: "常見原因：使用吸墨紙、書寫壓力較大、筆尖較寬或彈性大，或墨水較稠、在筆尖殘留較多。進行大型項目時，建議多備一瓶。",
    disclaimer: "<strong>注意：</strong>本結果僅供計劃參考。實際用量會因筆尖、壓力和書寫風格而差異較大。建議先在廢紙上測試。",
    footer: "完全在您的瀏覽器中運行。不收集、不儲存任何資料。",
    alertChars: "請輸入字元數量。",
    alertSize: "請輸入有效的字級。",
    alertBottle: "請輸入每瓶容量。"
  },
  'ja': {
    title: "カリグラフィーインク計算ツール",
    subtitle: "書き始める前に、プロジェクトに必要なインク量とコストを推定します。",
    calcHeading: "計算ツール",
    charLabel: "文字数", sizeLabel: "フォントサイズ（mm）",
    paperLabel: "紙の種類",
    paperSmooth: "光滑紙（コート紙、ブリストル紙）", paperStandard: "普通紙（ボンド紙、カートリッジ紙）", paperAbsorbent: "吸収紙（水彩紙、和紙）",
    inkLabel: "インクの種類",
    inkDye: "染料インク", inkPigment: "顔料インク", inkWaterproof: "耐水 / インディアンインク",
    bottleLabel: "ボトル容量（mL）", priceLabel: "ボトル価格（$）",
    calcBtn: "必要なインクを計算",
    resultLabel: "推定必要インク量",
    costNote: "推定コスト：{cost} · 1本で約 {n} プロジェクト分",
    bdChars: "文字数", bdSize: "フォントサイズ", bdPaper: "紙係数", bdInk: "インク係数",
    bdCost: "プロジェクトコスト", bdProjects: "1本あたりのプロジェクト数",
    resultDisclaimer: "あくまで推定値です。実際のインク使用量はペン先、筆圧、個人のスタイルにより異なります。必ず試し書きをしてください。",
    whatIsTitle: "インク使用量の推定方法",
    whatIsText: "カリグラフィーのインク消費量は4つの主要因で決まります：文字数、フォントサイズ（二乗で増加）、紙の吸収性、インクの配合。この計算ツールはこれらを組み合わせて、ペンを浸す前にプロジェクトの計画と予算を立てられるようにします。",
    factorsTitle: "インク消費量に影響する要因",
    f1Title: "フォントサイズ",
    f1Text: "フォントサイズを2倍にすると、インク使用量は約4倍になります。インクは面積を覆い、面積は線形寸法の二乗に比例するためです。",
    f2Title: "紙の種類",
    f2a: "光滑紙（コート紙、ブリストル紙）：インクが表面に留まり、約15%少ない",
    f2b: "普通紙（ボンド紙、カートリッジ紙）：基準",
    f2c: "吸収紙（水彩紙、和紙）：インクが繊維に染み込み、最大50%多く使用",
    f3Title: "インクの種類",
    f3a: "染料インク：薄く、流れが良い、基準消費量",
    f3b: "顔料インク：粒子が厚く、1ストロークあたり約10〜15%多く使用",
    f3c: "耐水 / インディアンインク：濃厚でカバー力が高く、約20%多く使用",
    howToTitle: "使い方",
    howTo1: "プロジェクトの総文字数を数えます（スペースを除く）。",
    howTo2: "予定しているフォントサイズをミリメートルで入力します（xハイトまたはキャップハイト）。",
    howTo3: "書き込む紙の種類を選択します。",
    howTo4: "使用するインクの種類を選択します。",
    howTo5: "ボトル容量と価格を入力して、プロジェクトあたりのコストを確認します。",
    faqTitle: "よくある質問",
    faq1q: "結婚式の招待状にはどのくらいインクが必要ですか？",
    faq1a: "典型的な結婚式の招待状（新郎新婦の名前、日付、会場、約80〜120文字、6〜8mmフォントサイズ）は、染料インクでおよそ0.3〜0.6 mL使用します。実際にはペンを30〜60回浸すことになります。",
    faq2q: "30 mLのボトルで何ページ書けますか？",
    faq2a: "30 mLの染料インクを普通紙に、8mmフォントサイズで書くと、およそ40,000〜60,000文字分になります。これは典型的な結婚式の封筒80〜120枚、または密なテキスト30〜50ページに相当します。",
    faq3q: "インクは劣化しますか？",
    faq3a: "はい。ほとんどのカリグラフィーインクは未開封で2〜4年、開封後6〜18ヶ月持ちます。顔料インクは分離しやすいので振ってから使用してください。ボトルは直立させ、直射日光を避けて保管し、使用前にカビや異臭がないか確認してください。",
    faq4q: "推定より早くインクがなくなるのはなぜ？",
    faq4a: "よくある原因：吸収紙の使用、強い筆圧、太いまたは柔軟なペン先、または濃いインクでペン先に残留物が多い。大規模なプロジェクトでは、必ず予備のボトルを購入してください。",
    disclaimer: "<strong>注意：</strong>これは計画目的の推定値です。実際のインク使用量はペン先、筆圧、書き方によって大きく異なります。必ず試し書きをしてください。",
    footer: "すべてブラウザ内で実行されます。データの収集・保存は行いません。",
    alertChars: "文字数を入力してください。",
    alertSize: "有効なフォントサイズを入力してください。",
    alertBottle: "ボトル容量を入力してください。"
  },
  'ko': {
    title: "캘리그라피 잉크 계산기",
    subtitle: "글을 쓰기 전에 프로젝트에 필요한 잉크 양과 비용을 추정합니다.",
    calcHeading: "계산기",
    charLabel: "글자 수", sizeLabel: "글꼴 크기 (mm)",
    paperLabel: "종이 종류",
    paperSmooth: "매끄러운 종이 (코팅, 브리스톨)", paperStandard: "일반 종이 (본드, 카트리지)", paperAbsorbent: "흡수성 종이 (수채화, 화선지)",
    inkLabel: "잉크 종류",
    inkDye: "염료 잉크", inkPigment: "안료 잉크", inkWaterproof: "방수 / 인디아 잉크",
    bottleLabel: "병 용량 (mL)", priceLabel: "병 가격 ($)",
    calcBtn: "필요한 잉크 계산",
    resultLabel: "예상 필요 잉크",
    costNote: "예상 비용: {cost} · 병당 약 {n}개 프로젝트",
    bdChars: "글자 수", bdSize: "글꼴 크기", bdPaper: "종이 계수", bdInk: "잉크 계수",
    bdCost: "프로젝트 비용", bdProjects: "병당 프로젝트 수",
    resultDisclaimer: "추정치입니다. 실제 잉크 사용량은 펜촉, 필압, 개인 스타일에 따라 다릅니다. 항상 스크랩에 먼저 테스트하세요.",
    whatIsTitle: "잉크 사용량 추정 방법",
    whatIsText: "캘리그라피의 잉크 소비량은 네 가지 주요 요인에 따라 결정됩니다: 글자 수, 글꼴 크기(제곱으로 증가), 종이의 흡수성, 잉크의 조성. 이 계산기는 이를 결합하여 펜을 담그기 전에 프로젝트를 계획하고 예산을 세울 수 있도록 합니다.",
    factorsTitle: "잉크 소비에 영향을 미치는 요인",
    f1Title: "글꼴 크기",
    f1Text: "글꼴 크기를 두 배로 늘리면 잉크 사용량은 약 네 배가 됩니다. 잉크는 면적을 덮고 면적은 선형 치수의 제곱에 비례하기 때문입니다.",
    f2Title: "종이 종류",
    f2a: "매끄러운 종이 (코팅, 브리스톨): 잉크가 표면에 머물러 약 15% 적게 사용",
    f2b: "일반 종이 (본드, 카트리지): 기준",
    f2c: "흡수성 종이 (수채화, 화선지): 잉크가 섬유로 스며들어 최대 50% 더 사용",
    f3Title: "잉크 종류",
    f3a: "염료 잉크: 묽고 흐름이 좋음, 기준 소비량",
    f3b: "안료 잉크: 입자가 두껍고 스트로크당 약 10~15% 더 사용",
    f3c: "방수 / 인디아 잉크: 농도가 높고 커버력이 좋아 약 20% 더 사용",
    howToTitle: "사용 방법",
    howTo1: "프로젝트의 총 글자 수를 세세요 (공백 제외).",
    howTo2: "예상 글꼴 크기를 밀리미터로 입력하세요 (x 높이 또는 대문자 높이).",
    howTo3: "글을 쓸 종이 종류를 선택하세요.",
    howTo4: "사용할 잉크 종류를 선택하세요.",
    howTo5: "병 용량과 가격을 입력하여 프로젝트당 비용을 확인하세요.",
    faqTitle: "자주 묻는 질문",
    faq1q: "결혼식 초대장에는 잉크가 얼마나 필요하나요?",
    faq1a: "일반적인 결혼식 초대장(신랑신부 이름, 날짜, 장소, 약 80~120자, 6~8mm 글꼴)은 염료 잉크로 약 0.3~0.6 mL 사용합니다. 실제로는 펜을 30~60번 담그게 됩니다.",
    faq2q: "30 mL 병 하나로 몇 페이지를 쓸 수 있나요?",
    faq2a: "30 mL 염료 잉크를 일반 종이에 8mm 글꼴로 쓰면 약 40,000~60,000자 분량입니다. 이는 일반적인 결혼식 봉투 80~120장 또는 빽빽한 텍스트 30~50페이지에 해당합니다.",
    faq3q: "잉크가 상하나요?",
    faq3a: "네. 대부분의 캘리그라피 잉크는 개봉 전 2~4년, 개봉 후 6~18개월 지속됩니다. 안료 잉크는 분리되기 쉬우므로 사용 전 흔들어야 합니다. 병을 똑바로 세워 직사광선을 피해 보관하고, 사용 전 곰팡이나 이상한 냄새가 없는지 확인하세요.",
    faq4q: "예상보다 잉크가 빨리 떨어지는 이유는?",
    faq4a: "흔한 원인: 흡수성 종이 사용, 강한 필압, 넓거나 유연한 펜촉, 또는 펜촉에 잔여물이 많이 남는 두꺼운 잉크. 대규모 프로젝트의 경우 항상 여분의 병을 구매하세요.",
    disclaimer: "<strong>참고:</strong> 이것은 계획 목적의 추정치입니다. 실제 잉크 사용량은 펜촉, 필압, 필체에 따라 크게 다릅니다. 항상 스크랩에 먼저 테스트하세요.",
    footer: "전적으로 브라우저에서 실행됩니다. 데이터를 수집하거나 저장하지 않습니다.",
    alertChars: "글자 수를 입력하세요.",
    alertSize: "유효한 글꼴 크기를 입력하세요.",
    alertBottle: "병 용량을 입력하세요."
  },
  'de': {
    title: "Kalligraphie-Tintenrechner",
    subtitle: "Schätzen Sie vor dem Schreiben, wie viel Tinte Ihr Projekt benötigt und was es kostet.",
    calcHeading: "Rechner",
    charLabel: "Anzahl der Zeichen", sizeLabel: "Schriftgröße (mm)",
    paperLabel: "Papierart",
    paperSmooth: "Glatt (gestrichen, Bristol)", paperStandard: "Standard (Bond, Karton)", paperAbsorbent: "Saugfähig (Aquarell, Reispapier)",
    inkLabel: "Tintenart",
    inkDye: "Tintenbasis", inkPigment: "Pigmentbasis", inkWaterproof: "Wasserfest / Tusche",
    bottleLabel: "Flaschengröße (mL)", priceLabel: "Flaschenpreis ($)",
    calcBtn: "Benötigte Tinte berechnen",
    resultLabel: "Geschätzte benötigte Tinte",
    costNote: "Ungefähre Kosten: {cost} · Etwa {n} Projekt(e) pro Flasche",
    bdChars: "Zeichen", bdSize: "Schriftgröße", bdPaper: "Papierfaktor", bdInk: "Tintenfaktor",
    bdCost: "Projektkosten", bdProjects: "Projekte pro Flasche",
    resultDisclaimer: "Nur eine Schätzung. Der tatsächliche Tintenverbrauch variiert je nach Feder, Schreibdruck und individuellem Stil. Testen Sie immer zuerst auf einem Schmierblatt.",
    whatIsTitle: "Wie der Tintenverbrauch geschätzt wird",
    whatIsText: "Der Tintenverbrauch in der Kalligraphie hängt von vier Hauptfaktoren ab: der Anzahl der Zeichen, der Schriftgröße (die quadratisch wächst), der Saugfähigkeit des Papiers und der Formulierung der Tinte. Dieser Rechner kombiniert diese zu einer praktischen Schätzung, damit Sie Ihr Projekt planen und budgetieren können, bevor Sie die Feder eintauchen.",
    factorsTitle: "Was den Tintenverbrauch beeinflusst",
    f1Title: "Schriftgröße",
    f1Text: "Wenn Sie die Schriftgröße verdoppeln, vervierfacht sich der Tintenverbrauch etwa. Tinte bedeckt eine Fläche, und die Fläche skaliert mit dem Quadrat der linearen Abmessungen.",
    f2Title: "Papierart",
    f2a: "Glattes Papier (gestrichen, Bristol): Tinte bleibt auf der Oberfläche, ca. 15% weniger",
    f2b: "Standardpapier (Bond, Karton): Basiswert",
    f2c: "Saugfähiges Papier (Aquarell, Reispapier): Tinte dringt in die Fasern ein, bis zu 50% mehr",
    f3Title: "Tintenart",
    f3a: "Tintenbasis: dünn, fließt leicht, Basisverbrauch",
    f3b: "Pigmentbasis: dickere Partikel, ca. 10–15% mehr pro Strich",
    f3c: "Wasserfest / Tusche: dicht, deckt mehr, ca. 20% mehr",
    howToTitle: "Verwendung",
    howTo1: "Zählen Sie die Gesamtzahl der Zeichen in Ihrem Projekt (ohne Leerzeichen).",
    howTo2: "Geben Sie die geplante Schriftgröße in Millimetern ein (x-Höhe oder Versalhöhe).",
    howTo3: "Wählen Sie die Papierart, auf die Sie schreiben.",
    howTo4: "Wählen Sie die verwendete Tintenart.",
    howTo5: "Geben Sie Flaschengröße und Preis ein, um die Kosten pro Projekt zu sehen.",
    faqTitle: "Häufig gestellte Fragen",
    faq1q: "Wie viel Tinte braucht eine Hochzeitseinladung?",
    faq1a: "Eine typische Hochzeitseinladung mit Namen, Datum und Ort — etwa 80–120 Zeichen bei 6–8 mm Schriftgröße — verbraucht ungefähr 0,3–0,6 mL Tinte auf Tintenbasis. In der Praxis tauchen Sie die Feder 30–60 Mal ein.",
    faq2q: "Wie viele Seiten deckt eine 30-mL-Flasche ab?",
    faq2a: "Eine 30-mL-Flasche Tinte auf Tintenbasis auf Standardpapier deckt etwa 40.000–60.000 Zeichen bei 8 mm Schriftgröße ab. Das entspricht 80–120 typischen Hochzeitsumschlägen oder 30–50 vollen Seiten dichtem Text.",
    faq3q: "Wird Tinte schlecht?",
    faq3a: "Ja. Die meisten Kalligraphie-Tinten halten 2–4 Jahre ungeöffnet und 6–18 Monate nach dem Öffnen. Pigmenttinten neigen zur Trennung und müssen geschüttelt werden. Lagern Sie Flaschen aufrecht, fern von direktem Sonnenlicht, und prüfen Sie vor Gebrauch auf Schimmel oder ungewöhnlichen Geruch.",
    faq4q: "Warum ist meine Tinte schneller aufgebraucht als geschätzt?",
    faq4a: "Häufige Ursachen: saugfähiges Papier, starker Druck, eine breite oder flexible Feder oder eine dicke Tinte, die mehr Rückstände auf der Feder hinterlässt. Kaufen Sie für große Projekte immer eine Ersatzflasche.",
    disclaimer: "<strong>Hinweis:</strong> Dies ist eine Schätzung zu Planungszwecken. Der tatsächliche Tintenverbrauch variiert stark je nach Feder, Druck und Schreibstil. Testen Sie immer zuerst auf Schmierpapier.",
    footer: "Läuft vollständig in Ihrem Browser. Es werden keine Daten gesammelt oder gespeichert.",
    alertChars: "Bitte geben Sie die Anzahl der Zeichen ein.",
    alertSize: "Bitte geben Sie eine gültige Schriftgröße ein.",
    alertBottle: "Bitte geben Sie die Flaschengröße ein."
  },
  'ru': {
    title: "Калькулятор туши для каллиграфии",
    subtitle: "Оцените, сколько туши нужно для проекта и во сколько это обойдётся — до начала работы.",
    calcHeading: "Калькулятор",
    charLabel: "Количество символов", sizeLabel: "Размер шрифта (мм)",
    paperLabel: "Тип бумаги",
    paperSmooth: "Гладкая (мелованная, Bristol)", paperStandard: "Стандартная (Bond, картридж)", paperAbsorbent: "Впитывающая (акварельная, рисовая)",
    inkLabel: "Тип туши",
    inkDye: "На красителе", inkPigment: "На пигменте", inkWaterproof: "Водостойкая / тушь",
    bottleLabel: "Объём флакона (мл)", priceLabel: "Цена флакона ($)",
    calcBtn: "Рассчитать необходимое количество",
    resultLabel: "Расчётное количество туши",
    costNote: "Примерная стоимость: {cost} · Около {n} проектов на флакон",
    bdChars: "Символов", bdSize: "Размер шрифта", bdPaper: "Коэффициент бумаги", bdInk: "Коэффициент туши",
    bdCost: "Стоимость проекта", bdProjects: "Проектов на флакон",
    resultDisclaimer: "Только оценка. Фактический расход зависит от пера, нажима и индивидуального стиля. Всегда сначала пробуйте на черновике.",
    whatIsTitle: "Как оценивается расход туши",
    whatIsText: "Расход туши в каллиграфии зависит от четырёх основных факторов: количества символов, размера шрифта (который растёт квадратично), впитываемости бумаги и состава туши. Этот калькулятор объединяет их в практическую оценку, чтобы вы могли спланировать проект и бюджет до того, как обмакнёте перо.",
    factorsTitle: "Что влияет на расход туши",
    f1Title: "Размер шрифта",
    f1Text: "При удвоении размера шрифта расход туши примерно учетверяется. Тушь покрывает площадь, а площадь масштабируется как квадрат линейных размеров.",
    f2Title: "Тип бумаги",
    f2a: "Гладкая бумага (мелованная, Bristol): тушь остаётся на поверхности, расход примерно на 15% меньше",
    f2b: "Стандартная бумага (Bond, картридж): базовый уровень",
    f2c: "Впитывающая бумага (акварельная, рисовая): тушь проникает в волокна, расход до 50% больше",
    f3Title: "Тип туши",
    f3a: "На красителе: жидкая, хорошо течёт, базовый расход",
    f3b: "На пигменте: более плотные частицы, на 10–15% больше на штрих",
    f3c: "Водостойкая / тушь: густая, лучше покрывает, расход примерно на 20% больше",
    howToTitle: "Как пользоваться",
    howTo1: "Подсчитайте общее количество символов в проекте (без пробелов).",
    howTo2: "Введите предполагаемый размер шрифта в миллиметрах (высота строчных или прописных).",
    howTo3: "Выберите тип бумаги, на которой будете писать.",
    howTo4: "Выберите используемый тип туши.",
    howTo5: "Введите объём и цену флакона, чтобы увидеть стоимость проекта.",
    faqTitle: "Часто задаваемые вопросы",
    faq1q: "Сколько туши нужно для свадебного приглашения?",
    faq1a: "Типичное свадебное приглашение с именами, датой и местом — около 80–120 символов при размере шрифта 6–8 мм — расходует примерно 0,3–0,6 мл туши на красителе. На практике вам придётся обмакнуть перо 30–60 раз.",
    faq2q: "Сколько страниц покроет флакон 30 мл?",
    faq2a: "Флакон 30 мл туши на красителе на стандартной бумаге покрывает примерно 40 000–60 000 символов при размере шрифта 8 мм. Это эквивалентно 80–120 типичным свадебным конвертам или 30–50 полным страницам плотного текста.",
    faq3q: "Тушь портится?",
    faq3a: "Да. Большинство каллиграфических тушей хранятся 2–4 года в закрытом виде и 6–18 месяцев после открытия. Пигментные туши склонны к расслоению и требуют взбалтывания. Храните флаконы вертикально, вдали от прямых солнечных лучей, проверяйте на плесень или необычный запах.",
    faq4q: "Почему тушь заканчивается быстрее, чем предполагалось?",
    faq4a: "Частые причины: впитывающая бумага, сильный нажим, широкое или гибкое перо, или густая тушь, оставляющая больше осадка на пере. Для крупных проектов всегда покупайте запасной флакон.",
    disclaimer: "<strong>Примечание:</strong> Это оценка для планирования. Фактический расход сильно варьируется в зависимости от пера, нажима и стиля письма. Всегда сначала пробуйте на черновике.",
    footer: "Полностью работает в вашем браузере. Данные не собираются и не хранятся.",
    alertChars: "Пожалуйста, введите количество символов.",
    alertSize: "Пожалуйста, введите корректный размер шрифта.",
    alertBottle: "Пожалуйста, введите объём флакона."
  },
  'es': {
    title: "Calculadora de Tinta para Caligrafía",
    subtitle: "Estime cuánta tinta necesita su proyecto y cuánto costará, antes de empezar a escribir.",
    calcHeading: "Calculadora",
    charLabel: "Número de caracteres", sizeLabel: "Tamaño de fuente (mm)",
    paperLabel: "Tipo de papel",
    paperSmooth: "Liso (estucado, Bristol)", paperStandard: "Estándar (bond, cartulina)", paperAbsorbent: "Absorbente (acuarela, papel de arroz)",
    inkLabel: "Tipo de tinta",
    inkDye: "A base de tinte", inkPigment: "A base de pigmento", inkWaterproof: "Resistente al agua / tinta china",
    bottleLabel: "Tamaño del frasco (mL)", priceLabel: "Precio del frasco ($)",
    calcBtn: "Calcular tinta necesaria",
    resultLabel: "Tinta estimada necesaria",
    costNote: "Coste aproximado: {cost} · Aproximadamente {n} proyecto(s) por frasco",
    bdChars: "Caracteres", bdSize: "Tamaño de fuente", bdPaper: "Factor de papel", bdInk: "Factor de tinta",
    bdCost: "Coste del proyecto", bdProjects: "Proyectos por frasco",
    resultDisclaimer: "Solo una estimación. El uso real varía según la plumilla, la presión y el estilo individual. Pruebe siempre en un borrador primero.",
    whatIsTitle: "Cómo se estima el uso de tinta",
    whatIsText: "El consumo de tinta en caligrafía depende de cuatro factores principales: el número de caracteres, el tamaño de fuente (que crece cuadráticamente), la absorbencia del papel y la formulación de la tinta. Esta calculadora los combina en una estimación práctica para que pueda planificar su proyecto y presupuesto antes de mojar la pluma.",
    factorsTitle: "Qué afecta al consumo de tinta",
    f1Title: "Tamaño de fuente",
    f1Text: "Al duplicar el tamaño de fuente, el uso de tinta se cuadruplica aproximadamente. La tinta cubre área, y el área escala con el cuadrado de las dimensiones lineales.",
    f2Title: "Tipo de papel",
    f2a: "Papel liso (estucado, Bristol): la tinta permanece en la superficie, usa ~15% menos",
    f2b: "Papel estándar (bond, cartulina): línea base",
    f2c: "Papel absorbente (acuarela, papel de arroz): la tinta se extiende por las fibras, usa hasta 50% más",
    f3Title: "Tipo de tinta",
    f3a: "A base de tinte: fluida, fluye fácil, consumo base",
    f3b: "A base de pigmento: partículas más gruesas, ~10–15% más por trazo",
    f3c: "Resistente al agua / tinta china: densa, cubre más, usa ~20% más",
    howToTitle: "Cómo usar esta calculadora",
    howTo1: "Cuente el total de caracteres de su proyecto (sin espacios).",
    howTo2: "Introduzca el tamaño de fuente previsto en milímetros (altura x o altura de mayúscula).",
    howTo3: "Elija el tipo de papel en el que escribirá.",
    howTo4: "Seleccione el tipo de tinta que utiliza.",
    howTo5: "Introduzca el tamaño y precio del frasco para ver el coste por proyecto.",
    faqTitle: "Preguntas frecuentes",
    faq1q: "¿Cuánta tinta necesita una invitación de boda?",
    faq1a: "Una invitación de boda típica con nombres, fecha y lugar — unos 80–120 caracteres a 6–8 mm de tamaño — usa aproximadamente 0,3–0,6 mL de tinta a base de tinte. En la práctica, mojará la pluma 30–60 veces.",
    faq2q: "¿Cuántas páginas cubre un frasco de 30 mL?",
    faq2a: "Un frasco de 30 mL de tinta a base de tinte sobre papel estándar cubre aproximadamente 40.000–60.000 caracteres a 8 mm de tamaño. Equivale a 80–120 sobres de boda típicos o 30–50 páginas completas de texto denso.",
    faq3q: "¿Se estropea la tinta?",
    faq3a: "Sí. La mayoría de las tintas de caligrafía duran 2–4 años sin abrir y 6–18 meses una vez abiertas. Las tintas de pigmento tienden a separarse y necesitan agitarse. Guarde los frascos en posición vertical, lejos de la luz solar directa, y verifique si hay moho u olor inusual antes de usar.",
    faq4q: "¿Por qué mi tinta se acaba más rápido de lo estimado?",
    faq4a: "Causas comunes: papel absorbente, presión fuerte, una plumilla ancha o flexible, o una tinta espesa que deja más residuo en la plumilla. Para proyectos grandes, siempre compre un frasco extra.",
    disclaimer: "<strong>Nota:</strong> Esta es una estimación para fines de planificación. El uso real varía ampliamente según la plumilla, la presión y el estilo de escritura. Pruebe siempre en papel de borrador primero.",
    footer: "Se ejecuta completamente en su navegador. No se recopilan ni almacenan datos.",
    alertChars: "Por favor introduzca el número de caracteres.",
    alertSize: "Por favor introduzca un tamaño de fuente válido.",
    alertBottle: "Por favor introduzca el tamaño del frasco."
  }
};

// ============================================================
// 生成文件
// ============================================================
const files = {};

files['index.html'] = buildIndexHtml(null, 'en', '/calligraphy-ink-estimator/');
files['zh/index.html'] = buildIndexHtml('zh', 'zh-Hans', '/calligraphy-ink-estimator/zh/');
files['zh-tw/index.html'] = buildIndexHtml('zh-TW', 'zh-Hant', '/calligraphy-ink-estimator/zh-tw/');
files['ja/index.html'] = buildIndexHtml('ja', 'ja', '/calligraphy-ink-estimator/ja/');
files['ko/index.html'] = buildIndexHtml('ko', 'ko', '/calligraphy-ink-estimator/ko/');
files['de/index.html'] = buildIndexHtml('de', 'de', '/calligraphy-ink-estimator/de/');
files['ru/index.html'] = buildIndexHtml('ru', 'ru', '/calligraphy-ink-estimator/ru/');
files['es/index.html'] = buildIndexHtml('es', 'es', '/calligraphy-ink-estimator/es/');

files['css/style.css'] = STYLE_CSS;
files['js/i18n.js'] = I18N_JS;
files['js/calculator.js'] = CALCULATOR_JS;

for (const [lang, data] of Object.entries(LOCALES)) {
  files[`locales/${lang}.json`] = JSON.stringify(data, null, 2);
}

files['.gitignore'] = `node_modules/
.wrangler/
.dev.vars
.DS_Store
*.log
.vscode/
.idea/
dist/
build/
`;

// ============================================================
// 写入
// ============================================================
const root = '.';
let count = 0;
for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(root, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Created: ' + filePath);
  count++;
}
console.log(`\nDone. ${count} files generated.`);
console.log('\nNext steps:');
console.log('  1. git init && git add . && git commit -m "Initial: calligraphy ink estimator"');
console.log('  2. Push to a new GitHub repo "calligraphy-ink-estimator"');
console.log('  3. Deploy as a new Cloudflare Worker');
console.log('  4. In tool-proxy/src/index.js PROXY_MAP, add:');
console.log('     \'/calligraphy-ink-estimator\': \'https://calligraphy-ink-estimator.lvyafei2026.workers.dev\'');
console.log('  5. In tool-proxy/wrangler.toml run_worker_first, add:');
console.log('     "/calligraphy-ink-estimator/*"');
console.log('  6. In Cloudflare tool-proxy Domains & Routes, add:');
console.log('     toolara.dev/calligraphy-ink-estimator/*');
console.log('     www.toolara.dev/calligraphy-ink-estimator/*');
console.log('  7. Update tool-proxy/public/sitemap.xml and index.html');