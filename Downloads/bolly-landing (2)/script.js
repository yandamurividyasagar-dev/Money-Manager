/* -----------------------------------------------------------
   Bolly landing page — interactive 3D bottle
   Built with a classic "CSS cylinder": a ring of flat slices,
   each rotated a fraction of 360° and pushed out with translateZ.
   No 3D library needed — it's just transforms + a wrapped texture.
------------------------------------------------------------ */

(function buildBottle() {
  const NUM_SEGMENTS = 32;   // more, thinner slices = smoother curve
  const SEG_WIDTH = 22;      // px, width of one flat slice
  const HEIGHT = 230;        // px, cylinder height — shorter/squatter to match the real bottle
  const RADIUS = SEG_WIDTH / (2 * Math.tan(Math.PI / NUM_SEGMENTS));
  const TEXTURE_WIDTH = NUM_SEGMENTS * SEG_WIDTH;

  const cylinder = document.getElementById('bottleCylinder');
  if (!cylinder) return;

  cylinder.style.width = `${2 * RADIUS}px`;
  cylinder.style.height = `${HEIGHT}px`;
  cylinder.style.marginLeft = `${-RADIUS}px`;

  const textureUrl = buildLabelTexture(TEXTURE_WIDTH, HEIGHT);

  for (let i = 0; i < NUM_SEGMENTS; i++) {
    const angle = (360 / NUM_SEGMENTS) * i;
    // sample the texture so the label sits on the front-facing slice (i = 0)
    const sampleIndex = (i + Math.floor(NUM_SEGMENTS / 2)) % NUM_SEGMENTS;
    const bgX = -(sampleIndex * SEG_WIDTH);

    // shading: soft, even studio-light look — never drops near black
    const cos = Math.cos((angle * Math.PI) / 180);
    const brightness = 0.72 + 0.35 * Math.pow(Math.max(cos, 0), 1.2);

    const seg = document.createElement('div');
    seg.className = 'seg';
    seg.style.setProperty('--seg-w', `${SEG_WIDTH}px`);
    seg.style.setProperty('--wrap-bg', `url("${textureUrl}")`);
    seg.style.setProperty('--wrap-size', `${TEXTURE_WIDTH}px`);
    seg.style.backgroundPositionX = `${bgX}px`;
    seg.style.filter = `brightness(${brightness.toFixed(2)})`;
    seg.style.transform = `rotateY(${angle}deg) translateZ(${RADIUS}px)`;
    cylinder.appendChild(seg);
  }

  attachRotation(cylinder);
})();

/* Draws the "bolly" label once onto a wide strip, so as the cylinder
   spins only one arc of slices ever shows the artwork — same as a
   real wraparound bottle label. */
function buildLabelTexture(width, height) {
  const cx = width / 2;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#8b71f2"/>
          <stop offset="45%" stop-color="#6a4fd6"/>
          <stop offset="100%" stop-color="#4a349e"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#body)"/>

      <text x="${cx - 62}" y="${height * 0.52}"
        transform="rotate(-90 ${cx - 62} ${height * 0.52})"
        text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="7" letter-spacing="2.5" fill="#d8cdfa">HAIRCARE</text>

      <g transform="translate(${cx + 6}, ${height * 0.42}) rotate(-5)" text-anchor="middle" font-family="Helvetica, Arial, sans-serif">
        <text y="0" font-size="42" font-weight="800" font-style="italic" fill="#ffffff">bolly</text>
      </g>

      <g transform="translate(${cx + 6}, ${height * 0.7})" text-anchor="middle" font-family="Helvetica, Arial, sans-serif">
        <text y="0" font-size="23" font-weight="700" fill="#ffffff">Clarify</text>
        <text y="21" font-size="11" fill="#e3dbfb" letter-spacing="0.5">Shampoo</text>
      </g>
    </svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

/* Pointer + touch drag rotates the cylinder around the Y axis.
   Works with mouse on desktop and single-finger touch on mobile. */
function attachRotation(cylinder) {
  const stage = document.getElementById('bottleStage');
  let currentAngle = -18; // slight starting turn so it doesn't look flat
  let dragging = false;
  let lastX = 0;
  let velocity = 0;
  let idleSpin;

  cylinder.style.transform = `rotateY(${currentAngle}deg)`;
  startIdleSpin();

  function apply() {
    cylinder.style.transform = `rotateY(${currentAngle}deg)`;
  }

  function startIdleSpin() {
    idleSpin = setInterval(() => {
      if (!dragging) {
        currentAngle += 0.12;
        apply();
      }
    }, 16);
  }

  function onDown(x) {
    dragging = true;
    lastX = x;
    velocity = 0;
    stage.style.cursor = 'grabbing';
  }

  function onMove(x) {
    if (!dragging) return;
    const dx = x - lastX;
    lastX = x;
    velocity = dx * 0.5;
    currentAngle += velocity;
    apply();
  }

  function onUp() {
    dragging = false;
    stage.style.cursor = 'grab';
  }

  // mouse
  stage.addEventListener('mousedown', (e) => onDown(e.clientX));
  window.addEventListener('mousemove', (e) => onMove(e.clientX));
  window.addEventListener('mouseup', onUp);

  // touch
  stage.addEventListener('touchstart', (e) => onDown(e.touches[0].clientX), { passive: true });
  stage.addEventListener('touchmove', (e) => {
    onMove(e.touches[0].clientX);
    e.preventDefault();
  }, { passive: false });
  stage.addEventListener('touchend', onUp);
}

/* Mobile nav toggle */
(function navToggle() {
  const btn = document.getElementById('navToggle');
  const pill = document.getElementById('navPill');
  if (!btn || !pill) return;
  btn.addEventListener('click', () => pill.classList.toggle('open'));
})();
