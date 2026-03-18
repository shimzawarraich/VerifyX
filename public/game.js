// How many questions per level
const ROUNDS_PER_LEVEL = 5;
 
// Points awarded per correct answer
const POINTS_PER_CORRECT = 100;
 
// Integrity lost per wrong answer (out of 100)
const INTEGRITY_LOSS = 20;
 
// =============================================
//  STATE
// =============================================
let currentLevel = 1;
let currentRound = 0;
let score = 0;
let integrity = 100;
let correctCount = 0;
let currentQuestion = null; // { text, answer, explanation }
 
// =============================================
//  DOM REFS
// =============================================
const levelDisplay    = document.getElementById('levelDisplay');
const roundCurrent    = document.getElementById('roundCurrent');
const roundTotal      = document.getElementById('roundTotal');
const scoreDisplay    = document.getElementById('scoreDisplay');
const integrityFill   = document.getElementById('integrityFill');
 
const loadingState    = document.getElementById('loadingState');
const questionState   = document.getElementById('questionState');
const feedbackState   = document.getElementById('feedbackState');
const completeState   = document.getElementById('completeState');
const gameoverState   = document.getElementById('gameoverState');
 
const headlineText    = document.getElementById('headlineText');
const choiceBtns      = document.querySelectorAll('.choice-btn');
 
const feedbackIcon          = document.getElementById('feedbackIcon');
const feedbackTitle         = document.getElementById('feedbackTitle');
const feedbackHeadline      = document.getElementById('feedbackHeadline');
const feedbackExplanation   = document.getElementById('feedbackExplanation');
const feedbackCorrectAnswer = document.getElementById('feedbackCorrectAnswer');
const nextBtn               = document.getElementById('nextBtn');
 
const correctCountEl   = document.getElementById('correctCount');
const finalScoreEl     = document.getElementById('finalScore');
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
  // Read level from URL param (e.g. game.html?level=3)
  const params = new URLSearchParams(window.location.search);
  currentLevel = parseInt(params.get('level')) || 1;
 
  roundTotal.textContent = ROUNDS_PER_LEVEL;
  updateHUD();
  startRound();
 
  // Button listeners
  choiceBtns.forEach(btn => {
    btn.addEventListener('click', () => handleAnswer(btn.dataset.answer));
  });
 
  nextBtn.addEventListener('click', () => {
    if (currentRound >= ROUNDS_PER_LEVEL) {
      if (integrity <= 0) {
        showGameOver();
      } else {
        showComplete();
      }
    } else {
      startRound();
    }
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
  showState(loadingState);
  updateHUD();
 
  try {
    currentQuestion = await fetchQuestion();
    headlineText.textContent = currentQuestion.text;
    showState(questionState);
  } catch (err) {
    console.error('Failed to fetch question:', err);
    currentQuestion = getFallbackQuestion();
    headlineText.textContent = currentQuestion.text;
    showState(questionState);
  }
}
 
function handleAnswer(selected) {
  const isCorrect = selected === currentQuestion.answer;
 
  if (isCorrect) {
    score += POINTS_PER_CORRECT;
    correctCount++;
  } else {
    integrity = Math.max(0, integrity - INTEGRITY_LOSS);
  }
 
  updateHUD();
  showFeedback(isCorrect, selected);
}
 
// =============================================
//  API CALL — routed through our server
// =============================================
async function fetchQuestion() {
  const response = await fetch('/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ level: currentLevel })
  });
 
  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }
 
  const parsed = await response.json();
 
  if (!parsed.text || !parsed.answer || !parsed.explanation) {
    throw new Error('Invalid question shape from server');
  }
 
  return parsed;
}
 
// =============================================
//  FALLBACK QUESTIONS (used if server/API fails)
// =============================================
const FALLBACKS = [
  {
    text: "Scientists confirm chocolate boosts memory by 47% overnight",
    answer: "fake",
    explanation: "This is fabricated misinformation. No peer-reviewed study has confirmed chocolate improves memory by any specific percentage overnight."
  },
  {
    text: "Government releases updated climate policy framework ahead of summit",
    answer: "real",
    explanation: "This is a plausible real headline. Governments regularly release policy documents ahead of major international summits."
  },
  {
    text: "Viral image shows 'thousands' at protest — original photo shows far fewer",
    answer: "manipulated",
    explanation: "This is manipulated media. The crowd size has been exaggerated through cropping or splicing to make a protest appear larger than it was."
  },
  {
    text: "Study finds people who sleep less than 6 hours are 300% more likely to develop dementia",
    answer: "fake",
    explanation: "The 300% figure is fabricated. Real studies link sleep deprivation to increased dementia risk, but no credible study uses this extreme statistic."
  },
  {
    text: "Central bank raises interest rates by 0.25% in response to inflation data",
    answer: "real",
    explanation: "This is a realistic and factual-sounding headline. Central banks regularly make small rate adjustments in response to economic data."
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
 
function showFeedback(isCorrect, selected) {
  feedbackState.className = 'feedback-state ' + (isCorrect ? 'feedback-correct' : 'feedback-wrong');
 
  feedbackTitle.textContent = isCorrect ? 'CORRECT CALL' : 'WRONG CALL';
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
  finalIntegrityEl.textContent = `${integrity}%`;
 
  // If on last level, change button to return to menu
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
  levelDisplay.textContent = String(currentLevel).padStart(2, '0');
  roundCurrent.textContent = Math.min(currentRound, ROUNDS_PER_LEVEL);
  scoreDisplay.textContent = String(score).padStart(3, '0');
  integrityFill.style.width = `${integrity}%`;
 
  if (integrity <= 40) {
    integrityFill.style.background = 'linear-gradient(90deg, #8B0000, #D47545)';
  } else {
    integrityFill.style.background = 'linear-gradient(90deg, #964B44, #F9CD89)';
  }
}
 
function resetAndRestart() {
  currentRound = 0;
  score = 0;
  integrity = 100;
  correctCount = 0;
  currentQuestion = null;
  fallbackIndex = 0;
  updateHUD();
  startRound();
}