document.addEventListener('DOMContentLoaded', function () {
  let unlocked = parseInt(localStorage.getItem('unlocked')) || 1;

  const nodes = document.querySelectorAll('.node');

  nodes.forEach(node => {
    const levelNum = parseInt(node.dataset.level);

    if (levelNum <= unlocked) {
      node.classList.remove('locked');
      node.classList.add('unlocked');

      node.addEventListener('click', () => {
        document.body.style.transition = 'opacity 0.4s ease';
        document.body.style.opacity = '0';
        setTimeout(() => {
          window.location.href = `game.html?level=${levelNum}`;
        }, 400);
      });
    } else {
      node.classList.add('locked');
      node.classList.remove('unlocked');
    }
  });

  // Highlight the furthest unlocked node
  const currentNode = document.querySelector(`[data-level="${unlocked}"]`);
  if (currentNode) currentNode.classList.add('current');

  // Update the active path segment based on unlocked level
  updateActivePath(unlocked);
});

function updateActivePath(unlocked) {
  const active = document.getElementById('track-active');
  if (!active) return;

  // Each segment of the path corresponds to a level transition
  const segments = [
    '',
    'M 80 260 C 80 100, 210 100, 210 100',
    'M 80 260 C 80 100, 210 100, 210 100 S 350 100, 350 220',
    'M 80 260 C 80 100, 210 100, 210 100 S 350 100, 350 220 S 470 320, 530 220',
    'M 80 260 C 80 100, 210 100, 210 100 S 350 100, 350 220 S 470 320, 530 220 S 630 100, 650 160',
  ];

  const idx = Math.min(unlocked - 1, segments.length - 1);
  if (segments[idx]) {
    active.setAttribute('d', segments[idx]);
  }
}