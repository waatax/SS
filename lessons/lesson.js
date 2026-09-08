// ==========================================================================
// SS Dedicated Lesson Page Controller
// ==========================================================================

(function() {
  'use strict';

  // Section Tabs Switching
  const tabs = document.querySelectorAll('.sec-tab');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      panels.forEach(p => p.classList.toggle('active', p.id === target));
    });
  });

  // Memory Verse Gym
  const verseTokens = document.querySelectorAll('.v-token');
  const gymBtns = document.querySelectorAll('.gym-opt-btn');

  gymBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      gymBtns.forEach(b => b.classList.toggle('active', b === btn));
      const mode = btn.dataset.mode;
      
      verseTokens.forEach((tok, idx) => {
        if (tok.dataset.punc === 'true') return;
        tok.classList.remove('hidden-token');
        if (mode === 'partial' && idx % 3 === 1) {
          tok.classList.add('hidden-token');
        } else if (mode === 'hard' && idx % 2 === 0) {
          tok.classList.add('hidden-token');
        } else if (mode === 'all') {
          tok.classList.add('hidden-token');
        }
      });
    });
  });

  verseTokens.forEach(tok => {
    tok.addEventListener('click', () => {
      if (tok.dataset.punc !== 'true') {
        tok.classList.toggle('hidden-token');
      }
    });
  });

  // Floating Timer
  let timerSecs = 300;
  let timerRunning = false;
  let timerInterval = null;

  const timerDisplay = document.getElementById('timerDigits');
  const timerToggle = document.getElementById('timerToggle');

  if (timerToggle && timerDisplay) {
    timerToggle.addEventListener('click', () => {
      if (!timerRunning) {
        timerRunning = true;
        timerToggle.textContent = '暫停';
        timerInterval = setInterval(() => {
          if (timerSecs > 0) {
            timerSecs--;
            const m = Math.floor(timerSecs / 60);
            const s = timerSecs % 60;
            timerDisplay.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
          } else {
            clearInterval(timerInterval);
            timerRunning = false;
            timerToggle.textContent = '重設';
            alert('⏱️ 課堂時間到囉！');
          }
        }, 1000);
      } else {
        clearInterval(timerInterval);
        timerRunning = false;
        timerToggle.textContent = '繼續';
      }
    });
  }

  // Dark theme toggle
  const themeToggle = document.getElementById('themeToggleBtn');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('theme-dark');
      document.body.classList.toggle('theme-warm');
    });
  }
})();
