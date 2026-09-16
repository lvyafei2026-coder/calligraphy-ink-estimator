function t() { return (window.__i18n && window.__i18n.t) || {}; }

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

window.calculate = calculate;