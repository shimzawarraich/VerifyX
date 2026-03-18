// =============================================
//  CONFIG
// =============================================
const ROUNDS_PER_LEVEL   = 5;
const POINTS_PER_CORRECT = 100;
const INTEGRITY_LOSS     = 20;
const HINT_COST          = 50;
const TIMER_SECONDS      = 30; // seconds per question, decreases with level

// Streak bonus thresholds
const STREAK_BONUSES = { 3: 50, 5: 150, 7: 300 };

// =============================================
//  STATE
// =============================================
let currentLevel    = 1;
let currentRound    = 0;
let score           = 0;
let integrity       = 100;
let correctCount    = 0;
let streak          = 0;
let bestStreak      = 0;
let hintUsed        = false;
let timerInterval   = null;
let timeLeft        = TIMER_SECONDS;
let currentQuestion = null;

// =============================================
//  DOM REFS
// =============================================
const levelDisplay    = document.getElementById('levelDisplay');
const roundCurrent    = document.getElementById('roundCurrent');
const roundTotal      = document.getElementById('roundTotal');
const scoreDisplay    = document.getElementById('scoreDisplay');
const streakDisplay   = document.getElementById('streakDisplay');
const integrityFill   = document.getElementById('integrityFill');
const timerFill       = document.getElementById('timerFill');

const loadingState    = document.getElementById('loadingState');
const questionState   = document.getElementById('questionState');
const feedbackState   = document.getElementById('feedbackState');
const completeState   = document.getElementById('completeState');
const gameoverState   = document.getElementById('gameoverState');

const headlineText    = document.getElementById('headlineText');
const formatBadge     = document.getElementById('formatBadge');
const choiceBtns      = document.querySelectorAll('.choice-btn');

const hintBtn         = document.getElementById('hintBtn');
const hintText        = document.getElementById('hintText');
const hintArea        = document.getElementById('hintArea');

const feedbackIcon          = document.getElementById('feedbackIcon');
const feedbackTitle         = document.getElementById('feedbackTitle');
const feedbackStreak        = document.getElementById('feedbackStreak');
const feedbackHeadline      = document.getElementById('feedbackHeadline');
const feedbackExplanation   = document.getElementById('feedbackExplanation');
const feedbackCorrectAnswer = document.getElementById('feedbackCorrectAnswer');
const nextBtn               = document.getElementById('nextBtn');

const correctCountEl   = document.getElementById('correctCount');
const finalScoreEl     = document.getElementById('finalScore');
const finalStreakEl    = document.getElementById('finalStreak');
const finalIntegrityEl = document.getElementById('finalIntegrity');
const nextLevelBtn     = document.getElementById('nextLevelBtn');
const retryBtn         = document.getElementById('retryBtn');

const gameoverCorrectEl = document.getElementById('gameoverCorrect');
const gameoverScoreEl   = document.getElementById('gameoverScore');
const retryBtn2         = document.getElementById('retryBtn2');
const menuBtn           = document.getElementById('menuBtn');

// =============================================
//  INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  currentLevel = parseInt(params.get('level')) || 1;

  roundTotal.textContent = ROUNDS_PER_LEVEL;
  updateHUD();
  startRound();

  choiceBtns.forEach(btn => {
    btn.addEventListener('click', () => handleAnswer(btn.dataset.answer));
  });

  hintBtn.addEventListener('click', useHint);

  nextBtn.addEventListener('click', () => {
    if (currentRound >= ROUNDS_PER_LEVEL) {
      integrity <= 0 ? showGameOver() : showComplete();
    } else {
      startRound();
    }
  });

  document.getElementById('hudMenuBtn').addEventListener('click', () => {
    stopTimer();
    window.location.href = 'index.html';
  });

  document.getElementById('hudMapBtn').addEventListener('click', () => {
    stopTimer();
    window.location.href = 'level.html';
  });

  nextLevelBtn.addEventListener('click', () => {
    const next = currentLevel + 1;
    const unlocked = parseInt(localStorage.getItem('unlocked')) || 1;
    if (next > unlocked) localStorage.setItem('unlocked', next);
    window.location.href = `game.html?level=${next}`;
  });

  retryBtn.addEventListener('click', resetAndRestart);
  retryBtn2.addEventListener('click', resetAndRestart);
  menuBtn.addEventListener('click', () => { window.location.href = 'index.html'; });
});

// =============================================
//  ROUND FLOW
// =============================================
async function startRound() {
  currentRound++;
  hintUsed = false;
  showState(loadingState);
  stopTimer();
  updateHUD();

  // Reset hint UI
  hintBtn.classList.remove('hidden', 'used');
  hintText.classList.add('hidden');
  hintText.textContent = '';

  try {
    currentQuestion = await fetchQuestion();
  } catch (err) {
    console.error('Failed to fetch question:', err);
    currentQuestion = getFallbackQuestion();
  }

  // Update format badge
  const formatLabels = {
    headline: 'HEADLINE',
    social: 'SOCIAL POST',
    statistic: 'STATISTIC',
    image_description: 'IMAGE REPORT'
  };
  formatBadge.textContent = formatLabels[currentQuestion.format] || 'TRANSMISSION';

  headlineText.textContent = currentQuestion.text;
  showState(questionState);
  startTimer();
}

function handleAnswer(selected) {
  stopTimer();
  const isCorrect = selected === currentQuestion.answer;

  if (isCorrect) {
    streak++;
    if (streak > bestStreak) bestStreak = streak;

    // Base points + time bonus
    const timeBonus = Math.floor((timeLeft / getTimerDuration()) * 50);
    let earned = POINTS_PER_CORRECT + timeBonus;

    // Streak bonus
    let streakBonus = 0;
    if (STREAK_BONUSES[streak]) {
      streakBonus = STREAK_BONUSES[streak];
      earned += streakBonus;
    }

    score += earned;
    correctCount++;

    currentQuestion._earned = earned;
    currentQuestion._streakBonus = streakBonus;
    currentQuestion._streak = streak;
  } else {
    streak = 0;
    integrity = Math.max(0, integrity - INTEGRITY_LOSS);
    currentQuestion._earned = 0;
    currentQuestion._streakBonus = 0;
    currentQuestion._streak = 0;
  }

  updateHUD();
  showFeedback(isCorrect);
}

// =============================================
//  TIMER
// =============================================
function getTimerDuration() {
  // Timer gets tighter each level: 30s → 20s → 18s → 16s → 14s
  const durations = { 1: 30, 2: 26, 3: 22, 4: 18, 5: 14 };
  return durations[currentLevel] || 30;
}

function startTimer() {
  timeLeft = getTimerDuration();
  updateTimerBar();

  timerInterval = setInterval(() => {
    timeLeft = Math.max(0, timeLeft - 0.1);
    updateTimerBar();

    if (timeLeft <= 0) {
      stopTimer();
      // Time's up — treat as wrong answer
      streak = 0;
      integrity = Math.max(0, integrity - INTEGRITY_LOSS);
      currentQuestion._earned = 0;
      currentQuestion._streakBonus = 0;
      currentQuestion._streak = 0;
      updateHUD();
      showFeedback(false, true); // true = timed out
    }
  }, 100);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function updateTimerBar() {
  const pct = (timeLeft / getTimerDuration()) * 100;
  timerFill.style.width = `${pct}%`;

  if (pct <= 25) {
    timerFill.style.background = '#D44545';
  } else if (pct <= 50) {
    timerFill.style.background = '#D47545';
  } else {
    timerFill.style.background = 'linear-gradient(90deg, #D47545, #F9CD89)';
  }
}

// =============================================
//  HINT SYSTEM
// =============================================
function useHint() {
  if (hintUsed) return;
  hintUsed = true;

  // Deduct points (can't go below 0)
  score = Math.max(0, score - HINT_COST);
  updateHUD();

  hintBtn.classList.add('used');
  hintBtn.textContent = '⚙ HINT USED';

  hintText.textContent = currentQuestion.hint;
  hintText.classList.remove('hidden');
}

// =============================================
//  API CALL
// =============================================
async function fetchQuestion() {
  const response = await fetch('/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ level: currentLevel })
  });

  if (!response.ok) throw new Error(`Server error: ${response.status}`);

  const parsed = await response.json();

  if (!parsed.text || !parsed.answer || !parsed.explanation || !parsed.hint) {
    throw new Error('Invalid question shape from server');
  }

  return parsed;
}

// =============================================
//  FALLBACK QUESTIONS
// =============================================
const FALLBACKS = [
  {
    format: 'headline',
    text: "Scientists confirm chocolate boosts memory by 47% overnight",
    answer: "fake",
    explanation: "No peer-reviewed study has confirmed chocolate improves memory by any specific percentage overnight.",
    hint: "Extremely specific percentages in health claims are a common red flag for fabricated studies."
  },
  {
    format: 'social',
    text: "🚨 BREAKING: Government quietly bans cash transactions over $50. They don't want you to know. Share before deleted! 👇",
    answer: "fake",
    explanation: "This is fabricated misinformation. The urgency, lack of source, and 'share before deleted' phrasing are classic viral misinformation tactics.",
    hint: "Posts urging you to share before they're deleted are almost always misinformation designed to spread fear."
  },
  {
    format: 'statistic',
    text: "A new study claims that 9 out of 10 doctors recommend avoiding tap water, citing 'hidden contaminants' affecting 200 million Americans.",
    answer: "fake",
    explanation: "The '9 out of 10 doctors' framing without citing who conducted the study or in what journal it was published is a hallmark of fabricated statistics.",
    hint: "Legitimate studies always cite a specific institution, journal, or methodology. Vague sourcing is a warning sign."
  },
  {
    format: 'headline',
    text: "Government releases updated climate policy framework ahead of summit",
    answer: "real",
    explanation: "This is a plausible real headline. Governments regularly release policy documents ahead of major international summits.",
    hint: "This headline makes a specific, verifiable claim with no emotionally charged language."
  },
  {
    format: 'image_description',
    text: "Photo circulating online shows a packed stadium captioned 'Record turnout at climate rally — over 500,000 attend.' Reverse image search shows the original photo is from a 2014 concert.",
    answer: "manipulated",
    explanation: "This is manipulated media. A real photo has been repurposed with a false caption to misrepresent an event.",
    hint: "When a photo's claimed date or event doesn't match context clues like signage, weather, or crowds, it may be recycled."
  }
];

let fallbackIndex = 0;
function getFallbackQuestion() {
  const q = FALLBACKS[fallbackIndex % FALLBACKS.length];
  fallbackIndex++;
  return q;
}

// =============================================
//  UI HELPERS
// =============================================
function showState(activeEl) {
  [loadingState, questionState, feedbackState, completeState, gameoverState].forEach(el => {
    el.classList.add('hidden');
  });
  activeEl.classList.remove('hidden');
}

function showFeedback(isCorrect, timedOut = false) {
  stopTimer();
  feedbackState.className = 'feedback-state ' + (isCorrect ? 'feedback-correct' : 'feedback-wrong');

  if (timedOut) {
    feedbackTitle.textContent = 'TIME\'S UP';
  } else {
    feedbackTitle.textContent = isCorrect ? 'CORRECT CALL' : 'WRONG CALL';
  }

  // Streak message
  if (isCorrect && currentQuestion._streak >= 3) {
    feedbackStreak.textContent = `✦ ${currentQuestion._streak}x STREAK — +${currentQuestion._streakBonus} BONUS`;
    feedbackStreak.classList.remove('hidden');
  } else if (isCorrect && currentQuestion._earned > POINTS_PER_CORRECT) {
    feedbackStreak.textContent = `⚡ SPEED BONUS — +${currentQuestion._earned - POINTS_PER_CORRECT} pts`;
    feedbackStreak.classList.remove('hidden');
  } else {
    feedbackStreak.classList.add('hidden');
  }

  feedbackHeadline.textContent = `"${currentQuestion.text}"`;
  feedbackExplanation.textContent = currentQuestion.explanation;
  feedbackCorrectAnswer.textContent = isCorrect
    ? `✔ That was indeed: ${currentQuestion.answer.toUpperCase()}`
    : `✕ Correct answer was: ${currentQuestion.answer.toUpperCase()}`;

  showState(feedbackState);
}

function showComplete() {
  correctCountEl.textContent = `${correctCount} / ${ROUNDS_PER_LEVEL}`;
  finalScoreEl.textContent = String(score).padStart(3, '0');
  finalStreakEl.textContent = `✦ ${bestStreak}`;
  finalIntegrityEl.textContent = `${integrity}%`;

  if (currentLevel >= 5) {
    nextLevelBtn.textContent = '⍟ ARCHIVE RESTORED';
    nextLevelBtn.onclick = () => { window.location.href = 'index.html'; };
  }

  showState(completeState);
}

function showGameOver() {
  gameoverCorrectEl.textContent = `${correctCount} / ${ROUNDS_PER_LEVEL}`;
  gameoverScoreEl.textContent = String(score).padStart(3, '0');
  showState(gameoverState);
}

function updateHUD() {
  levelDisplay.textContent   = String(currentLevel).padStart(2, '0');
  roundCurrent.textContent   = Math.min(currentRound, ROUNDS_PER_LEVEL);
  scoreDisplay.textContent   = String(score).padStart(3, '0');
  streakDisplay.textContent  = `✦ ${streak}`;
  integrityFill.style.width  = `${integrity}%`;

  if (integrity <= 40) {
    integrityFill.style.background = '#D44545';
  } else {
    integrityFill.style.background = 'linear-gradient(90deg, #D47545, #F9CD89)';
  }

  // Streak glow when on a run
  if (streak >= 3) {
    streakDisplay.style.color = '#F9CD89';
    streakDisplay.style.textShadow = '0 0 16px rgba(249,205,137,0.7)';
  } else {
    streakDisplay.style.color = '';
    streakDisplay.style.textShadow = '';
  }
}

function resetAndRestart() {
  currentRound  = 0;
  score         = 0;
  integrity     = 100;
  correctCount  = 0;
  streak        = 0;
  bestStreak    = 0;
  hintUsed      = false;
  fallbackIndex = 0;
  currentQuestion = null;
  stopTimer();
  updateHUD();
  startRound();
}