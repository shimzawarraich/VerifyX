document.addEventListener('DOMContentLoaded', function () {
  // Read highest unlocked level from localStorage (default: 1)
  let unlocked = parseInt(localStorage.getItem('unlocked')) || 1;

  const nodes = document.querySelectorAll('.node');

  nodes.forEach(node => {
    const levelNum = parseInt(node.dataset.level);

    if (levelNum <= unlocked) {
      node.classList.remove('locked');
      node.classList.add('unlocked');

      node.addEventListener('click', () => {
        // Fade out then navigate
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

  // Highlight the furthest unlocked node as current
  const currentNode = document.querySelector(`[data-level="${unlocked}"]`);
  if (currentNode) currentNode.classList.add('current');
});