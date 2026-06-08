const DATA = [42, 78, 55, 91, 63, 38, 85, 72, 49, 95, 60, 74];
const LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MAX_VAL = 100;

const canvas  = document.getElementById('chart');
const ctx     = canvas.getContext('2d');
const tooltip = document.getElementById('tooltip');
const minInput = document.getElementById('range-min');
const maxInput = document.getElementById('range-max');
const trackFill = document.getElementById('track-fill');

let animProgress = 0;
let animStart = null;

// ── Resize canvas to match CSS size ──
function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); draw(); });

// ── Draw bars ──
function draw() {
  const W = canvas.width;
  const H = canvas.height;
  const min = +minInput.value;
  const max = +maxInput.value;

  ctx.clearRect(0, 0, W, H);

  const barCount = DATA.length;
  const gap = 8;
  const totalGap = gap * (barCount - 1);
  const barW = (W - totalGap) / barCount;

  DATA.forEach((val, i) => {
    const x = i * (barW + gap);
    const barH = (val / MAX_VAL) * (H - 30) * animProgress;
    const y = H - barH - 20;
    const inRange = val >= min && val <= max;

    // Bar
    ctx.fillStyle = inRange ? '#7f77dd' : '#242430';
    const radius = 4;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + barW - radius, y);
    ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
    ctx.lineTo(x + barW, y + barH);
    ctx.lineTo(x, y + barH);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.fill();

    // Value label on active bars
    if (inRange && animProgress === 1) {
      ctx.fillStyle = '#9998b0';
      ctx.font = '11px Segoe UI';
      ctx.textAlign = 'center';
      ctx.fillText(val, x + barW / 2, y - 5);
    }

    // Month label
    ctx.fillStyle = '#4a4a5a';
    ctx.font = '11px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText(LABELS[i], x + barW / 2, H - 4);
  });

  updateStats(min, max);
}

function updateStats(min, max) {
  const inRange = DATA.filter(v => v >= min && v <= max);
  document.getElementById('stat-min').textContent   = min;
  document.getElementById('stat-max').textContent   = max;
  document.getElementById('stat-count').textContent = inRange.length;
  document.getElementById('stat-total').textContent = inRange.reduce((a, b) => a + b, 0);
  document.getElementById('val-min').textContent    = min;
  document.getElementById('val-max').textContent    = max;
}

// ── Track fill between thumbs ──
function updateTrack() {
  const min = +minInput.value;
  const max = +maxInput.value;
  const pct = v => ((v - 0) / 100) * 100;
  trackFill.style.left  = pct(min) + '%';
  trackFill.style.width = (pct(max) - pct(min)) + '%';
}

// ── Slider events ──
minInput.addEventListener('input', () => {
  if (+minInput.value > +maxInput.value) minInput.value = maxInput.value;
  updateTrack();
  draw();
});

maxInput.addEventListener('input', () => {
  if (+maxInput.value < +minInput.value) maxInput.value = minInput.value;
  updateTrack();
  draw();
});

// ── Tooltip on hover ──
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const W = canvas.width;
  const gap = 8;
  const barW = (W - gap * (DATA.length - 1)) / DATA.length;

  let found = false;
  DATA.forEach((val, i) => {
    const x = i * (barW + gap);
    if (mx >= x && mx <= x + barW) {
      tooltip.style.display = 'block';
      tooltip.style.left = (e.clientX - rect.left + 12) + 'px';
      tooltip.style.top  = (e.clientY - rect.top - 28) + 'px';
      tooltip.textContent = `${LABELS[i]}: ${val}`;
      found = true;
    }
  });
  if (!found) tooltip.style.display = 'none';
});

canvas.addEventListener('mouseleave', () => {
  tooltip.style.display = 'none';
});

// ── Load animation ──
function animate(ts) {
  if (!animStart) animStart = ts;
  animProgress = Math.min((ts - animStart) / 700, 1);
  const ease = 1 - Math.pow(1 - animProgress, 3);
  animProgress = ease;
  draw();
  if ((ts - animStart) / 700 < 1) requestAnimationFrame(animate);
  else { animProgress = 1; draw(); }
}

updateTrack();
requestAnimationFrame(animate);
