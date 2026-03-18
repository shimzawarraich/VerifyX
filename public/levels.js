let unlockedLevels = 1;

document.addEventListener('DOMContentLoaded', function () {
  const levels = document.querySelectorAll('.node');

  levels.forEach(level => {
    level.addEventListener('click', () => {
      const levelNum = parseInt(level.dataset.level);

      if (levelNum <= unlockedLevels) {
        alert(`Starting Level ${levelNum}!`);

        // simulate unlocking next level
        if (levelNum === unlockedLevels && unlockedLevels < levels.length) {
          unlockedLevels++;
          updateLevels();
        }
      } else {
        alert(`Level ${levelNum} is locked!`);
      }
    });
  });

  function updateLevels() {
    levels.forEach(level => {
      const levelNum = parseInt(level.dataset.level);

      if (levelNum <= unlockedLevels) {
        level.classList.remove('locked');
        level.classList.add('unlocked');
      }

      level.classList.remove('current');
    });

    // highlight current level
    const current = document.querySelector(`[data-level="${unlockedLevels}"]`);
    if (current) current.classList.add('current');
  }
  document.addEventListener('DOMContentLoaded', function () {
  let unlocked = parseInt(localStorage.getItem('unlocked')) || 1;

  const levels = document.querySelectorAll('.node');

  levels.forEach(level => {
    const levelNum = parseInt(level.dataset.level);

    if (levelNum <= unlocked) {
      level.classList.add('unlocked');
      level.classList.remove('locked');

      level.addEventListener('click', () => {
        window.location.href = `game.html?level=${levelNum}`;
      });
    } else {
      level.classList.add('locked');
    }
  });
});

  updateLevels();
});