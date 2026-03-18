const stageData = [
  {
    level: 1,
    name: 'SIGNAL DOCKS',
    shortName: 'SECTOR 1',
    x: 80,
    y: 260,
    difficulty: 'Threat: Low',
    objective: 'Objective: Restore relays',
    description: 'Recover the first truth fragments inside a flooded relay district where broken headlines still pulse through abandoned data canals.',
    svg: `
      <svg viewBox="0 0 320 200" class="mini-map" role="img" aria-label="Signal Docks map preview">
        <defs>
          <linearGradient id="dockGlow" x1="0" x2="1">
            <stop offset="0%" stop-color="#D47545" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#F9CD89" stop-opacity="0.45"/>
          </linearGradient>
        </defs>
        <rect x="20" y="25" width="280" height="150" rx="18" class="map-frame"/>
        <path d="M45 135 C90 120, 95 80, 140 75 S220 125, 270 60" class="map-route"/>
        <path d="M95 35 L95 165 M170 45 L170 155 M245 35 L245 165" class="map-gridline"/>
        <circle cx="55" cy="132" r="10" class="map-node-hot"/>
        <circle cx="138" cy="76" r="8" class="map-node-mid"/>
        <circle cx="212" cy="106" r="8" class="map-node-mid"/>
        <circle cx="270" cy="60" r="11" class="map-node-hot"/>
        <path d="M36 145 L70 145 M258 72 L282 72" class="map-dock"/>
        <text x="32" y="42" class="map-caption">CANAL RELAYS</text>
      </svg>
    `
  },
  {
    level: 2,
    name: 'ECHO GRID',
    shortName: 'SECTOR 2',
    x: 210,
    y: 100,
    difficulty: 'Threat: Medium',
    objective: 'Objective: Trace false signals',
    description: 'Move through a mirrored transmission lattice where every feed echoes twice and only one route leads to verified source data.',
    svg: `
      <svg viewBox="0 0 320 200" class="mini-map" role="img" aria-label="Echo Grid map preview">
        <rect x="20" y="25" width="280" height="150" rx="18" class="map-frame"/>
        <path d="M60 55 L150 55 L150 145 L255 145" class="map-route"/>
        <path d="M60 145 L120 145 L120 90 L255 90" class="map-route faint"/>
        <path d="M60 55 L60 145 M105 55 L105 145 M150 55 L150 145 M195 55 L195 145 M240 55 L240 145" class="map-gridline"/>
        <path d="M60 55 L255 55 M60 100 L255 100 M60 145 L255 145" class="map-gridline"/>
        <circle cx="60" cy="55" r="9" class="map-node-hot"/>
        <circle cx="150" cy="55" r="8" class="map-node-mid"/>
        <circle cx="150" cy="145" r="8" class="map-node-mid"/>
        <circle cx="255" cy="145" r="11" class="map-node-hot"/>
        <text x="34" y="42" class="map-caption">LATTICE CHECKPOINTS</text>
      </svg>
    `
  },
  {
    level: 3,
    name: 'FRACTURE VAULT',
    shortName: 'SECTOR 3',
    x: 350,
    y: 220,
    difficulty: 'Threat: Elevated',
    objective: 'Objective: Patch memory shards',
    description: 'Enter a collapsed archive chamber split into shards of conflicting memory, then rebuild the timeline before the vault seals.',
    svg: `
      <svg viewBox="0 0 320 200" class="mini-map" role="img" aria-label="Fracture Vault map preview">
        <rect x="20" y="25" width="280" height="150" rx="18" class="map-frame"/>
        <path d="M60 140 L118 118 L164 145 L208 88 L262 58" class="map-route"/>
        <path d="M92 50 L135 105 M145 60 L178 120 M188 48 L208 88 M225 102 L262 142" class="map-gridline"/>
        <polygon points="85,48 117,74 93,104 62,76" class="map-shard"/>
        <polygon points="173,55 208,64 194,98 160,88" class="map-shard"/>
        <polygon points="225,118 262,108 277,142 238,152" class="map-shard"/>
        <circle cx="60" cy="140" r="9" class="map-node-hot"/>
        <circle cx="164" cy="145" r="8" class="map-node-mid"/>
        <circle cx="208" cy="88" r="8" class="map-node-mid"/>
        <circle cx="262" cy="58" r="11" class="map-node-hot"/>
        <text x="34" y="42" class="map-caption">MEMORY SHARDS</text>
      </svg>
    `
  },
  {
    level: 4,
    name: 'MIRAGE BASIN',
    shortName: 'SECTOR 4',
    x: 530,
    y: 220,
    difficulty: 'Threat: High',
    objective: 'Objective: Detect synthetic loops',
    description: 'Cross a desert of synthetic narratives where decoy pathways loop forever unless you isolate the genuine information current.',
    svg: `
      <svg viewBox="0 0 320 200" class="mini-map" role="img" aria-label="Mirage Basin map preview">
        <rect x="20" y="25" width="280" height="150" rx="18" class="map-frame"/>
        <path d="M46 132 C82 98, 122 162, 158 124 S236 84, 274 126" class="map-route"/>
        <path d="M52 92 C84 72, 126 114, 160 92 S238 62, 275 88" class="map-gridline"/>
        <ellipse cx="96" cy="126" rx="28" ry="14" class="map-basin"/>
        <ellipse cx="190" cy="112" rx="32" ry="16" class="map-basin"/>
        <ellipse cx="252" cy="132" rx="22" ry="11" class="map-basin"/>
        <circle cx="46" cy="132" r="9" class="map-node-hot"/>
        <circle cx="158" cy="124" r="8" class="map-node-mid"/>
        <circle cx="274" cy="126" r="11" class="map-node-hot"/>
        <text x="34" y="42" class="map-caption">MIRAGE ROUTES</text>
      </svg>
    `
  },
  {
    level: 5,
    name: 'TRUTH CORE',
    shortName: 'CORE',
    x: 650,
    y: 160,
    difficulty: 'Threat: Critical',
    objective: 'Objective: Purge MISINFO',
    description: 'Reach the central engine, confront the virus at its source, and restore a clean signal to the final archive of truth.',
    svg: `
      <svg viewBox="0 0 320 200" class="mini-map" role="img" aria-label="Truth Core map preview">
        <rect x="20" y="25" width="280" height="150" rx="18" class="map-frame"/>
        <circle cx="160" cy="100" r="48" class="map-core-ring"/>
        <circle cx="160" cy="100" r="24" class="map-core-center"/>
        <path d="M160 34 L160 52 M160 148 L160 166 M94 100 L112 100 M208 100 L226 100" class="map-route"/>
        <path d="M118 58 L132 72 M188 128 L202 142 M118 142 L132 128 M188 72 L202 58" class="map-gridline"/>
        <circle cx="160" cy="34" r="8" class="map-node-mid"/>
        <circle cx="226" cy="100" r="8" class="map-node-mid"/>
        <circle cx="160" cy="166" r="8" class="map-node-mid"/>
        <circle cx="94" cy="100" r="8" class="map-node-mid"/>
        <circle cx="160" cy="100" r="12" class="map-node-hot"/>
        <text x="34" y="42" class="map-caption">FINAL PURGE CHAMBER</text>
      </svg>
    `
  }
];

document.addEventListener('DOMContentLoaded', function () {
  const unlocked = parseInt(localStorage.getItem('unlocked')) || 1;
  const nodeWrap = document.getElementById('node-wrap');

  renderNodes(unlocked, nodeWrap);
  bindNodeInteractions(unlocked);

  const previewLevel = Math.min(Math.max(unlocked, 1), stageData.length);
  setPreview(previewLevel);
  updateActivePath(unlocked);
});

function renderNodes(unlocked, nodeWrap) {
  nodeWrap.innerHTML = stageData.map(stage => `
    <div class="map-node" style="left: ${stage.x}px; top: ${stage.y}px;">
      <div class="node ${stage.level <= unlocked ? 'unlocked' : 'locked'} ${stage.level === unlocked ? 'current' : ''}" data-level="${stage.level}">
        <span class="node-num">${stage.level}</span>
        ${stage.level === 5 ? '<span class="node-crown">⍟</span>' : ''}
      </div>
      <span class="node-label">${stage.shortName}</span>
    </div>
  `).join('');
}

function bindNodeInteractions(unlocked) {
  const nodes = document.querySelectorAll('.node');

  nodes.forEach(node => {
    const levelNum = parseInt(node.dataset.level, 10);

    node.addEventListener('mouseenter', () => setPreview(levelNum));
    node.addEventListener('focus', () => setPreview(levelNum));

    if (levelNum <= unlocked) {
      node.addEventListener('click', () => {
        document.body.style.transition = 'opacity 0.4s ease';
        document.body.style.opacity = '0';
        setTimeout(() => {
          window.location.href = `game.html?level=${levelNum}`;
        }, 400);
      });
    }
  });
}

function setPreview(levelNum) {
  const stage = stageData.find(item => item.level === levelNum) || stageData[0];
  document.getElementById('preview-kicker').textContent = stage.level === 5 ? 'FINAL SECTOR' : 'SECTOR PREVIEW';
  document.getElementById('preview-title').textContent = `${stage.shortName} · ${stage.name}`;
  document.getElementById('preview-text').textContent = stage.description;
  document.getElementById('preview-difficulty').textContent = stage.difficulty;
  document.getElementById('preview-objective').textContent = stage.objective;
  document.getElementById('preview-map').innerHTML = stage.svg;
}

function updateActivePath(unlocked) {
  const active = document.getElementById('track-active');
  if (!active) return;

  const segments = [
    '',
    'M 80 260 C 80 100, 210 100, 210 100',
    'M 80 260 C 80 100, 210 100, 210 100 S 350 100, 350 220',
    'M 80 260 C 80 100, 210 100, 210 100 S 350 100, 350 220 S 470 320, 530 220',
    'M 80 260 C 80 100, 210 100, 210 100 S 350 100, 350 220 S 470 320, 530 220 S 630 100, 650 160',
  ];

  const idx = Math.min(unlocked - 1, segments.length - 1);
  if (segments[idx]) active.setAttribute('d', segments[idx]);
}