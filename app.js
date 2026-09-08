// ==========================================================================
// SS Teacher's Cockpit - Main Application Controller
// ==========================================================================

(function() {
  'use strict';

  // State Management
  const state = {
    quarter: '2026-Q3',
    lessonNum: 1,
    currentLesson: null,
    verseMode: 'full',
    fontSize: 16,
    isDark: false,
    activeTab: 'tab-expert',
    // Timer
    timerSeconds: 300,
    timerTotal: 300,
    timerInterval: null,
    timerRunning: false,
    // Presentation Mode
    presentIndex: 0,
    presentSlides: []
  };

  // DOM Elements
  const els = {
    quarterSwitcher: document.getElementById('quarterSwitcher'),
    lessonRail: document.getElementById('lessonRail'),
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    searchResultsDropdown: document.getElementById('searchResultsDropdown'),
    moduleTabs: document.getElementById('moduleTabs'),
    tabContentArea: document.getElementById('tabContentArea'),
    // Hero
    heroQuarter: document.getElementById('heroQuarter'),
    heroNum: document.getElementById('heroNum'),
    heroScripture: document.getElementById('heroScripture'),
    heroTitle: document.getElementById('heroTitle'),
    heroSubtitle: document.getElementById('heroSubtitle'),
    verseDisplay: document.getElementById('verseDisplay'),
    verseCitation: document.getElementById('verseCitation'),
    // Expert
    expertPacingList: document.getElementById('expertPacingList'),
    expertPrepList: document.getElementById('expertPrepList'),
    expertClassroomTip: document.getElementById('expertClassroomTip'),
    expertHumorOpener: document.getElementById('expertHumorOpener'),
    expertStoryHook: document.getElementById('expertStoryHook'),
    expertChildWorld: document.getElementById('expertChildWorld'),
    expertChildStruggle: document.getElementById('expertChildStruggle'),
    expertTheologyFocus: document.getElementById('expertTheologyFocus'),
    expertChristLens: document.getElementById('expertChristLens'),
    expertDevotion: document.getElementById('expertDevotion'),
    expertFiveE: document.getElementById('expertFiveE'),
    expertDevelopment: document.getElementById('expertDevelopment'),
    expertPsychSafety: document.getElementById('expertPsychSafety'),
    // Story & Modules
    storyActsContainer: document.getElementById('storyActsContainer'),
    hymnDetailArea: document.getElementById('hymnDetailArea'),
    gamesListArea: document.getElementById('gamesListArea'),
    truthListArea: document.getElementById('truthListArea'),
    appListArea: document.getElementById('appListArea'),
    conclusionBanner: document.getElementById('conclusionBanner'),
    craftsContainer: document.getElementById('craftsContainer'),
    lowerQuizList: document.getElementById('lowerQuizList'),
    upperQuizList: document.getElementById('upperQuizList'),
    prayerDisplay: document.getElementById('prayerDisplay'),
    teacherNotesInput: document.getElementById('teacherNotesInput'),
    saveStatusMsg: document.getElementById('saveStatusMsg'),
    clearNotesBtn: document.getElementById('clearNotesBtn'),
    // Timer
    timerToggleBtn: document.getElementById('timerToggleBtn'),
    timerFloatingPanel: document.getElementById('timerFloatingPanel'),
    closeTimerBtn: document.getElementById('closeTimerBtn'),
    timerClockDisplay: document.getElementById('timerClockDisplay'),
    timerStartBtn: document.getElementById('timerStartBtn'),
    timerPauseBtn: document.getElementById('timerPauseBtn'),
    timerResetBtn: document.getElementById('timerResetBtn'),
    // Presentation
    presentModeBtn: document.getElementById('presentModeBtn'),
    presentationModal: document.getElementById('presentationModal'),
    presentQuarterBadge: document.getElementById('presentQuarterBadge'),
    presentLessonBadge: document.getElementById('presentLessonBadge'),
    presentTitle: document.getElementById('presentTitle'),
    presentSlideIndicator: document.getElementById('presentSlideIndicator'),
    presentPrevBtn: document.getElementById('presentPrevBtn'),
    presentNextBtn: document.getElementById('presentNextBtn'),
    presentExitBtn: document.getElementById('presentExitBtn'),
    presentContentDisplay: document.getElementById('presentContentDisplay'),
    // Print
    printBtn: document.getElementById('printBtn'),
    printSelectionModal: document.getElementById('printSelectionModal'),
    closePrintModalBtn: document.getElementById('closePrintModalBtn'),
    printWorksheetBtn: document.getElementById('printWorksheetBtn'),
    printTeacherPrepBtn: document.getElementById('printTeacherPrepBtn'),
    printContainer: document.getElementById('printContainer'),
    // Styling
    fontDownBtn: document.getElementById('fontDownBtn'),
    fontUpBtn: document.getElementById('fontUpBtn'),
    themeToggleBtn: document.getElementById('themeToggleBtn')
  };

  // Initialize
  function init() {
    if (!window.CURRICULUM_DATA || !window.CURRICULUM_DATA.length) {
      console.error('Curriculum data not loaded!');
      return;
    }

    // Check URL Hash for initial lesson (e.g. #2026-q3-01)
    parseHash();

    // Event Listeners
    setupEventListeners();

    // Render Initial Lesson
    renderLessonRail();
    loadCurrentLesson();
  }

  function parseHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const match = hash.match(/(2026-q[34])-(\d+)/i);
      if (match) {
        state.quarter = match[1].toUpperCase();
        state.lessonNum = parseInt(match[2], 10);
      }
    }
  }

  function setupEventListeners() {
    // Quarter Switching
    els.quarterSwitcher.addEventListener('click', (e) => {
      const btn = e.target.closest('.quarter-btn');
      if (!btn) return;
      const q = btn.dataset.quarter;
      if (q === state.quarter) return;
      state.quarter = q;
      state.lessonNum = 1;
      
      document.querySelectorAll('.quarter-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderLessonRail();
      loadCurrentLesson();
      updateUrlHash();
    });

    // Module Tabs
    els.moduleTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      const targetId = btn.dataset.target;
      state.activeTab = targetId;

      document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.toggle('active', p.id === targetId));
    });

    // Live Search
    els.searchInput.addEventListener('input', handleSearch);
    els.clearSearchBtn.addEventListener('click', () => {
      els.searchInput.value = '';
      els.clearSearchBtn.style.display = 'none';
      els.searchResultsDropdown.style.display = 'none';
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-box')) {
        els.searchResultsDropdown.style.display = 'none';
      }
    });

    // Memory Verse Gym Controls
    document.querySelector('.verse-gym-controls').addEventListener('click', (e) => {
      const btn = e.target.closest('.gym-btn');
      if (!btn) return;
      state.verseMode = btn.dataset.mode;
      document.querySelectorAll('.gym-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderVerseGym();
    });

    // Click on individual verse word tokens to toggle
    els.verseDisplay.addEventListener('click', (e) => {
      const token = e.target.closest('.verse-token');
      if (token) {
        token.classList.toggle('hidden-word');
      }
    });

    // Font Sizing
    els.fontUpBtn.addEventListener('click', () => {
      if (state.fontSize < 24) {
        state.fontSize += 2;
        document.documentElement.style.setProperty('--font-base', state.fontSize + 'px');
      }
    });
    els.fontDownBtn.addEventListener('click', () => {
      if (state.fontSize > 12) {
        state.fontSize -= 2;
        document.documentElement.style.setProperty('--font-base', state.fontSize + 'px');
      }
    });

    // Theme Toggle
    els.themeToggleBtn.addEventListener('click', () => {
      state.isDark = !state.isDark;
      document.body.classList.toggle('theme-dark', state.isDark);
      document.body.classList.toggle('theme-warm', !state.isDark);
    });

    // Notes auto-save
    els.teacherNotesInput.addEventListener('input', debounce(saveTeacherNotes, 500));
    els.clearNotesBtn.addEventListener('click', () => {
      if (confirm('確定要清除本課的個人筆記嗎？')) {
        els.teacherNotesInput.value = '';
        saveTeacherNotes();
      }
    });

    // Timer controls
    els.timerToggleBtn.addEventListener('click', () => {
      els.timerFloatingPanel.classList.toggle('hidden');
    });
    els.closeTimerBtn.addEventListener('click', () => {
      els.timerFloatingPanel.classList.add('hidden');
    });
    document.querySelector('.timer-presets').addEventListener('click', (e) => {
      const btn = e.target.closest('.preset-btn');
      if (!btn) return;
      const mins = parseInt(btn.dataset.mins, 10);
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.toggle('active', b === btn));
      resetTimer(mins * 60);
    });
    els.timerStartBtn.addEventListener('click', startTimer);
    els.timerPauseBtn.addEventListener('click', pauseTimer);
    els.timerResetBtn.addEventListener('click', () => resetTimer(state.timerTotal));

    // Presentation Mode
    els.presentModeBtn.addEventListener('click', openPresentationMode);
    els.presentExitBtn.addEventListener('click', closePresentationMode);
    els.presentPrevBtn.addEventListener('click', prevPresentSlide);
    els.presentNextBtn.addEventListener('click', nextPresentSlide);
    document.addEventListener('keydown', (e) => {
      if (!els.presentationModal.classList.contains('hidden')) {
        if (e.key === 'ArrowRight' || e.key === 'Space') nextPresentSlide();
        else if (e.key === 'ArrowLeft') prevPresentSlide();
        else if (e.key === 'Escape') closePresentationMode();
      }
    });

    // Print Modal
    els.printBtn.addEventListener('click', () => {
      els.printSelectionModal.classList.remove('hidden');
    });
    els.closePrintModalBtn.addEventListener('click', () => {
      els.printSelectionModal.classList.add('hidden');
    });
    els.printWorksheetBtn.addEventListener('click', () => {
      els.printSelectionModal.classList.add('hidden');
      printDocument('worksheet');
    });
    
    // Portal Filter Tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    const portalCards = document.querySelectorAll('.lesson-portal-card');

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;
        filterTabs.forEach(t => t.classList.toggle('active', t === tab));

        portalCards.forEach(card => {
          if (filter === 'all' || card.dataset.quarter === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    els.printTeacherPrepBtn.addEventListener('click', () => {
      els.printSelectionModal.classList.add('hidden');
      printDocument('prep');
    });
  }

  // Render Lesson Rail
  function renderLessonRail() {
    const quarterLessons = window.CURRICULUM_DATA.filter(l => l.quarter === state.quarter);
    els.lessonRail.innerHTML = '';

    quarterLessons.forEach(lesson => {
      const btn = document.createElement('button');
      btn.className = `rail-item ${lesson.lesson_num === state.lessonNum ? 'active' : ''}`;
      btn.textContent = `第${lesson.lesson_num}課 · ${lesson.title}`;
      btn.addEventListener('click', () => {
        state.lessonNum = lesson.lesson_num;
        document.querySelectorAll('.rail-item').forEach(b => b.classList.toggle('active', b === btn));
        loadCurrentLesson();
        updateUrlHash();
      });
      els.lessonRail.appendChild(btn);
    });
  }

  // Load Current Lesson Content
  function loadCurrentLesson() {
    const lesson = window.CURRICULUM_DATA.find(
      l => l.quarter === state.quarter && l.lesson_num === state.lessonNum
    );
    if (!lesson) return;
    state.currentLesson = lesson;

    // 1. Hero
    els.heroQuarter.textContent = lesson.quarter;
    els.heroNum.textContent = `第 ${lesson.lesson_num} 課`;
    els.heroScripture.textContent = lesson.scripture || '聖經經文信息';
    els.heroTitle.textContent = lesson.title;
    els.heroSubtitle.textContent = lesson.subtitle || lesson.quarter_title;

    // 2. Verse Gym
    renderVerseGym();

    // 3. Expert Team
    renderExpertTeam(lesson.expert_insights);

    // 4. Story Acts
    renderStoryActs(lesson.story);

    // 5. Hymns & Games
    renderHymnsAndGames(lesson.hymn, lesson.games);

    // 6. Truths & Applications
    renderTruthsAndApps(lesson.life_lessons, lesson.life_apps, lesson.conclusion);

    // 7. Crafts
    renderCrafts(lesson.crafts);

    // 8. Quizzes
    renderQuizzes(lesson.quiz_lower, lesson.quiz_upper);

    // 9. Prayer
    els.prayerDisplay.textContent = lesson.prayer || '親愛的天父，感謝你透過本課的話語教導我們。奉主耶穌的名求，阿們！';

    // 10. Load Teacher Notes
    loadTeacherNotes();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Render Memory Verse Gym
  function renderVerseGym() {
    const lesson = state.currentLesson;
    if (!lesson || !lesson.verse) {
      els.verseDisplay.textContent = '本課無特定金句';
      return;
    }

    let verseText = lesson.verse;
    let citation = '';
    // Extract citation if inside parentheses
    const citeMatch = verseText.match(/[（\(]([^）\)]+)[）\)]$/);
    if (citeMatch) {
      citation = citeMatch[1];
      verseText = verseText.replace(/[（\(][^）\)]+[）\)]$/, '').trim();
    }
    els.verseCitation.textContent = citation || lesson.scripture || '';

    // Split text into tokens (Chinese characters or words)
    // Group into 2-3 characters for natural flow
    const tokens = [];
    let current = '';
    for (let i = 0; i < verseText.length; i++) {
      const ch = verseText[i];
      if (/[，。、；！「」『』\s]/.test(ch)) {
        if (current) { tokens.push(current); current = ''; }
        tokens.push(ch);
      } else {
        current += ch;
        if (current.length >= 2 && i + 1 < verseText.length && !/[，。、；！「」『』\s]/.test(verseText[i+1])) {
          tokens.push(current);
          current = '';
        }
      }
    }
    if (current) tokens.push(current);

    els.verseDisplay.innerHTML = '';
    tokens.forEach((tok, idx) => {
      const span = document.createElement('span');
      span.className = 'verse-token';
      span.textContent = tok;

      // Punctuation is never hidden
      if (!/[，。、；！「」『』\s]/.test(tok)) {
        if (state.verseMode === 'partial' && idx % 3 === 1) {
          span.classList.add('hidden-word');
        } else if (state.verseMode === 'hard' && (idx % 2 === 0)) {
          span.classList.add('hidden-word');
        } else if (state.verseMode === 'all') {
          span.classList.add('hidden-word');
        }
      }
      els.verseDisplay.appendChild(span);
    });
  }

  // Render Expert Team
  function renderExpertTeam(exp) {
    if (!exp) return;
    const p = exp.principal;
    const pr = exp.preacher;
    const pa = exp.pastor;
    const ed = exp.education;
    const ps = exp.psychologist;

    // Principal
    els.expertPacingList.innerHTML = p.pacing.map(item => `
      <li><span class="pacing-time">${item.time}</span><span><strong>${item.phase}：</strong>${item.focus}</span></li>
    `).join('');

    els.expertPrepList.innerHTML = p.quick_prep.map(item => `<li>${item}</li>`).join('');
    els.expertClassroomTip.textContent = p.classroom_tip;
    els.expertHumorOpener.textContent = p.humor_opener;

    // Preacher
    els.expertStoryHook.textContent = pr.storytelling_hook;
    els.expertChildWorld.textContent = pr.child_world;
    els.expertChildStruggle.textContent = pr.relatable_struggle;

    // Pastor
    els.expertTheologyFocus.textContent = pa.theological_focus;
    els.expertChristLens.textContent = pa.christ_lens;
    els.expertDevotion.textContent = pa.teacher_devotion;

    // Education & Psychology
    els.expertFiveE.innerHTML = `
      <div class="five-e-item"><strong>${ed.five_e.engage}</strong></div>
      <div class="five-e-item"><strong>${ed.five_e.explore}</strong></div>
      <div class="five-e-item"><strong>${ed.five_e.explain}</strong></div>
      <div class="five-e-item"><strong>${ed.five_e.elaborate}</strong></div>
      <div class="five-e-item"><strong>${ed.five_e.evaluate}</strong></div>
    `;
    els.expertDevelopment.textContent = ps.developmental_stage;
    els.expertPsychSafety.textContent = ps.psychological_safety + ' ' + ps.empathy_building;
  }

  // Render Story Acts
  function renderStoryActs(storyList) {
    if (!storyList || !storyList.length) {
      els.storyActsContainer.innerHTML = '<p class="sub-text">本課故事內容已融入信息經文中。</p>';
      return;
    }

    els.storyActsContainer.innerHTML = storyList.map((act, idx) => `
      <div class="story-act-card">
        <h4><span class="act-badge">幕次 ${idx + 1}</span> ${act.title}</h4>
        <div class="story-act-paras">
          ${act.paragraphs.map(p => `<p>${p}</p>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // Render Hymns & Games
  function renderHymnsAndGames(hymn, games) {
    // Hymn
    if (hymn) {
      els.hymnDetailArea.innerHTML = `
        <div class="hymn-card">
          <div class="hymn-name">${hymn.title}</div>
          <div class="hymn-desc">${hymn.description || '帶領孩子以喜樂的心同聲敬拜！'}</div>
          <div class="hymn-actions">
            <a href="${hymn.youtube_url || '#'}" target="_blank" rel="noopener" class="btn-youtube">
              ▶ 在 YouTube 上聆聽敬拜
            </a>
          </div>
        </div>
      `;
    }

    // Games
    if (games && games.length) {
      els.gamesListArea.innerHTML = games.map(g => `
        <div class="item-card">
          <h5>🎮 ${g.title}</h5>
          <div class="item-content">${g.content}</div>
        </div>
      `).join('');
    } else {
      els.gamesListArea.innerHTML = '<p class="sub-text">本課建議以分組互動或詩歌動作破冰。</p>';
    }
  }

  // Render Truths & Apps
  function renderTruthsAndApps(truths, apps, conclusion) {
    if (truths && truths.length) {
      els.truthListArea.innerHTML = truths.map(t => `
        <div class="truth-item">
          <h5>✨ ${t.title}</h5>
          <div>${t.points.map(p => `<p>${p}</p>`).join('')}</div>
        </div>
      `).join('');
    } else {
      els.truthListArea.innerHTML = '<p class="sub-text">請參考聖經經文核心信息。</p>';
    }

    if (apps && apps.length) {
      els.appListArea.innerHTML = apps.map(a => `
        <div class="app-item">
          <h5>🌱 ${a.title}</h5>
          <div>${a.points.map(p => `<p>${p}</p>`).join('')}</div>
        </div>
      `).join('');
    } else {
      els.appListArea.innerHTML = '<p class="sub-text">鼓勵孩子在家庭與學校實踐愛人與敬畏上帝的心志。</p>';
    }

    if (conclusion) {
      els.conclusionBanner.innerHTML = `
        <h4>🌈 總結與激勵</h4>
        <p>${conclusion}</p>
      `;
      els.conclusionBanner.style.display = 'block';
    } else {
      els.conclusionBanner.style.display = 'none';
    }
  }

  // Render Crafts
  function renderCrafts(crafts) {
    if (crafts && crafts.length) {
      els.craftsContainer.innerHTML = crafts.map(c => `
        <div class="item-card">
          <h5>✂️ ${c.title}</h5>
          <div class="item-content">${c.content}</div>
        </div>
      `).join('');
    } else {
      els.craftsContainer.innerHTML = '<p class="sub-text">本課可引導孩子自由繪畫本課聖經情境或製作經文卡片。</p>';
    }
  }

  // Render Quizzes
  function renderQuizzes(lowerList, upperList) {
    // 1. Lower Grade Quizzes (Interactive)
    if (lowerList && lowerList.length) {
      els.lowerQuizList.innerHTML = lowerList.map((q, qIdx) => `
        <div class="quiz-item-card" data-qidx="${qIdx}">
          <div class="quiz-question-title">${qIdx + 1}. ${q.question}</div>
          <div class="quiz-options-group">
            ${q.options.map((opt, optIdx) => `
              <button class="quiz-option-btn" data-optidx="${optIdx}" data-ans="${q.answer}">
                ${opt}
              </button>
            `).join('')}
          </div>
          <div class="quiz-feedback" id="feedback-${qIdx}">
            ${q.explanation}
          </div>
        </div>
      `).join('');

      // Add click handlers for quiz options
      document.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', handleQuizOptionClick);
      });
    } else {
      els.lowerQuizList.innerHTML = '<p class="sub-text">本課無指定選擇題。</p>';
    }

    // 2. Upper Grade Open Discussions
    if (upperList && upperList.length) {
      els.upperQuizList.innerHTML = upperList.map((qText, idx) => `
        <div class="discussion-card">
          <div class="discussion-q">Q${idx + 1}：${qText}</div>
          <div class="teacher-tip">💡 教師引導小訣竅：鼓勵孩子連結個人生活故事，接納任何分享，不給標準答案！</div>
        </div>
      `).join('');
    } else {
      els.upperQuizList.innerHTML = '<p class="sub-text">引導高年級學生思考本課金句對個人的意義。</p>';
    }
  }

  // Handle Interactive Quiz Option Click
  function handleQuizOptionClick(e) {
    const btn = e.currentTarget;
    const card = btn.closest('.quiz-item-card');
    const qIdx = card.dataset.qidx;
    const targetAns = btn.dataset.ans;
    const optText = btn.textContent.trim();
    const isCorrect = optText.startsWith(`(${targetAns})`) || optText.startsWith(`${targetAns}.`);

    // Reset sibling buttons in same card
    card.querySelectorAll('.quiz-option-btn').forEach(b => {
      b.classList.remove('selected-correct', 'selected-wrong');
    });

    const fb = document.getElementById(`feedback-${qIdx}`);

    if (isCorrect) {
      btn.classList.add('selected-correct');
      fb.className = 'quiz-feedback show correct';
      fb.innerHTML = `🎉 <strong>答對了！太棒了！</strong> ${fb.innerHTML}`;
      playChime(true);
    } else {
      btn.classList.add('selected-wrong');
      fb.className = 'quiz-feedback show wrong';
      fb.innerHTML = `🤔 <strong>再想想看喔！</strong> 正確答案是 (${targetAns})。`;
      playChime(false);
    }
  }

  // Audio Feedback using Web Audio API
  function playChime(isSuccess) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isSuccess) {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.frequency.setValueAtTime(330, ctx.currentTime);
        osc.frequency.setValueAtTime(261.63, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      // Audio not supported or blocked
    }
  }

  // Teacher Notes localStorage
  function getNoteKey() {
    return `ss_notes_${state.quarter}_${state.lessonNum}`;
  }

  function loadTeacherNotes() {
    const saved = localStorage.getItem(getNoteKey()) || '';
    els.teacherNotesInput.value = saved;
    els.saveStatusMsg.textContent = saved ? '已從本機載入' : '尚未有筆記';
  }

  function saveTeacherNotes() {
    const val = els.teacherNotesInput.value;
    localStorage.setItem(getNoteKey(), val);
    els.saveStatusMsg.textContent = '已自動儲存於 ' + new Date().toLocaleTimeString();
  }

  // Timer Implementation
  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function startTimer() {
    if (state.timerRunning) return;
    state.timerRunning = true;
    els.timerStartBtn.textContent = '計時中...';
    els.timerStartBtn.disabled = true;

    state.timerInterval = setInterval(() => {
      if (state.timerSeconds > 0) {
        state.timerSeconds--;
        els.timerClockDisplay.textContent = formatTime(state.timerSeconds);
      } else {
        pauseTimer();
        els.timerClockDisplay.textContent = '00:00';
        playBellSound();
        alert('⏱️ 課堂時間到囉！');
      }
    }, 1000);
  }

  function pauseTimer() {
    state.timerRunning = false;
    clearInterval(state.timerInterval);
    els.timerStartBtn.textContent = '繼續計時';
    els.timerStartBtn.disabled = false;
  }

  function resetTimer(seconds) {
    pauseTimer();
    state.timerTotal = seconds;
    state.timerSeconds = seconds;
    els.timerClockDisplay.textContent = formatTime(seconds);
    els.timerStartBtn.textContent = '開始計時';
    els.timerStartBtn.disabled = false;
  }

  function playBellSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {}
  }

  // Presentation Mode
  function openPresentationMode() {
    const l = state.currentLesson;
    if (!l) return;

    // Build slides sequence
    state.presentSlides = [
      {
        title: `📖 本課主題與經文`,
        html: `
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="font-size: 3rem; color: #f59e0b; margin-bottom: 12px;">${l.title}</h1>
            <h3 style="font-size: 1.8rem; color: #94a3b8;">${l.subtitle}</h3>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 24px; border-radius: 12px; border: 1px solid #334155;">
            <p style="font-size: 1.5rem; color: #38bdf8;">📌 信息經文：${l.scripture || '經文'}</p>
          </div>
        `
      },
      {
        title: `🌟 背誦金句`,
        html: `
          <div style="background: rgba(245, 158, 11, 0.1); border: 2px solid #f59e0b; padding: 36px; border-radius: 16px; text-align: center;">
            <p style="font-size: 2.2rem; line-height: 1.9; color: #fef3c7; font-family: 'Noto Serif TC', serif;">
              ${l.verse}
            </p>
          </div>
        `
      }
    ];

    // Add Hymn
    if (l.hymn && l.hymn.title) {
      state.presentSlides.push({
        title: `🎵 敬拜詩歌`,
        html: `
          <div style="text-align: center; padding: 32px;">
            <h2 style="font-size: 2.8rem; color: #38bdf8; margin-bottom: 16px;">${l.hymn.title}</h2>
            <p style="font-size: 1.8rem; color: #cbd5e1; line-height: 1.8;">${l.hymn.description}</p>
          </div>
        `
      });
    }

    // Add Story Acts
    if (l.story && l.story.length) {
      l.story.forEach((act, aIdx) => {
        state.presentSlides.push({
          title: `📖 聖經故事（幕次 ${aIdx + 1}）· ${act.title}`,
          html: `
            <div style="font-size: 1.8rem; line-height: 2.0; color: #f1f5f9;">
              ${act.paragraphs.map(p => `<p style="margin-bottom: 18px;">${p}</p>`).join('')}
            </div>
          `
        });
      });
    }

    // Add Core Truths
    if (l.life_lessons && l.life_lessons.length) {
      state.presentSlides.push({
        title: `💡 核心生命真理`,
        html: `
          <div style="display: flex; flex-direction: column; gap: 20px;">
            ${l.life_lessons.map(t => `
              <div style="background: rgba(255,255,255,0.06); padding: 20px; border-radius: 12px;">
                <h3 style="font-size: 1.8rem; color: #f59e0b; margin-bottom: 8px;">✨ ${t.title}</h3>
                <div style="font-size: 1.5rem; line-height: 1.7; color: #e2e8f0;">${t.points.map(p => `<p>${p}</p>`).join('')}</div>
              </div>
            `).join('')}
          </div>
        `
      });
    }

    // Add Closing Prayer
    if (l.prayer) {
      state.presentSlides.push({
        title: `🙏 同心回應禱告`,
        html: `
          <div style="background: rgba(255,255,255,0.05); padding: 36px; border-radius: 16px; font-size: 2rem; line-height: 2.2; color: #f8fafc; font-family: 'Noto Serif TC', serif;">
            ${l.prayer}
          </div>
        `
      });
    }

    state.presentIndex = 0;
    els.presentQuarterBadge.textContent = l.quarter;
    els.presentLessonBadge.textContent = `第 ${l.lesson_num} 課`;
    els.presentTitle.textContent = l.title;
    els.presentationModal.classList.remove('hidden');
    renderPresentSlide();
  }

  function renderPresentSlide() {
    const slide = state.presentSlides[state.presentIndex];
    if (!slide) return;
    els.presentSlideIndicator.textContent = `${state.presentIndex + 1} / ${state.presentSlides.length}`;
    els.presentContentDisplay.innerHTML = `
      <h2 class="present-slide-title">${slide.title}</h2>
      <div class="present-slide-body">${slide.html}</div>
    `;
    els.presentPrevBtn.disabled = state.presentIndex === 0;
    els.presentNextBtn.disabled = state.presentIndex === state.presentSlides.length - 1;
  }

  function nextPresentSlide() {
    if (state.presentIndex < state.presentSlides.length - 1) {
      state.presentIndex++;
      renderPresentSlide();
    }
  }

  function prevPresentSlide() {
    if (state.presentIndex > 0) {
      state.presentIndex--;
      renderPresentSlide();
    }
  }

  function closePresentationMode() {
    els.presentationModal.classList.add('hidden');
  }

  // Print Document Generation
  function printDocument(mode) {
    const l = state.currentLesson;
    if (!l) return;

    if (mode === 'worksheet') {
      els.printContainer.innerHTML = `
        <div class="print-page">
          <div class="print-header-banner">
            <div>
              <h1>【主日學學生學習單】${l.title}</h1>
              <p>2026 ${l.quarter} 第${l.lesson_num}課 · 經文：${l.scripture || ''}</p>
            </div>
            <div>
              <p>姓名：___________ 日期：___________</p>
            </div>
          </div>

          <div class="print-section">
            <h3>📖 本週背誦金句</h3>
            <p style="font-size: 14pt; font-weight: bold; margin: 8px 0;">${l.verse}</p>
            <p style="text-align: right;">□ 我已經熟背並背給老師聽了！</p>
          </div>

          <div class="print-section">
            <h3>🎯 故事大冒險複習題</h3>
            ${(l.quiz_lower || []).map((q, idx) => `
              <div style="margin-bottom: 12px;">
                <p><strong>${idx + 1}. ${q.question}</strong></p>
                <p style="margin-left: 16px;">${q.options.join('   ')}</p>
              </div>
            `).join('')}
          </div>

          <div class="print-section">
            <h3>💬 心靈小問答（高年級思考）</h3>
            ${(l.quiz_upper || []).slice(0, 3).map((q, idx) => `
              <div style="margin-bottom: 12px;">
                <p><strong>問 ${idx + 1}：${q}</strong></p>
                <div style="border-bottom: 1px dashed #999; height: 32px; margin-top: 4px;"></div>
              </div>
            `).join('')}
          </div>

          <div class="print-section">
            <h3>🌱 本週生活實踐挑戰</h3>
            <p>本週在學校或家庭，我要像以斯帖/摩西一樣做出一個美好的愛心行動：</p>
            <div style="border-bottom: 1px dashed #999; height: 28px; margin-top: 6px;"></div>
          </div>

          <div class="print-section" style="text-align: center; font-size: 10pt; color: #555;">
            <p>親愛的家長：請陪伴孩子複習今日金句，並為孩子本週在校園中的見證同心禱告！</p>
          </div>
        </div>
      `;
    } else {
      // Teacher Prep
      const exp = l.expert_insights;
      els.printContainer.innerHTML = `
        <div class="print-page">
          <div class="print-header-banner">
            <div>
              <h1>【主日學教師備課指南】第${l.lesson_num}課：${l.title}</h1>
              <p>${l.quarter} · 經文範圍：${l.scripture || ''}</p>
            </div>
            <div>
              <p>授課日期：___________ 授課教師：___________</p>
            </div>
          </div>

          <div class="print-section">
            <h3>⏱️ 50分鐘課堂節奏配比</h3>
            <ul>
              ${exp.principal.pacing.map(item => `<li><strong>${item.time} (${item.phase})：</strong>${item.focus}</li>`).join('')}
            </ul>
          </div>

          <div class="print-section">
            <h3>📋 課前備課檢核與物資</h3>
            <ul>
              ${exp.principal.quick_prep.map(item => `<li>[  ] ${item}</li>`).join('')}
            </ul>
          </div>

          <div class="print-section">
            <h3>✝️ 神學核心與基督透鏡</h3>
            <p><strong>神學焦點：</strong>${exp.pastor.theological_focus}</p>
            <p><strong>福音連結：</strong>${exp.pastor.christ_lens}</p>
          </div>

          <div class="print-section">
            <h3>🎣 講員開場白與生動破題</h3>
            <p>${exp.preacher.storytelling_hook}</p>
          </div>

          <div class="print-section">
            <h3>📖 聖經故事大綱</h3>
            ${(l.story || []).map((act, idx) => `<p><strong>第${idx+1}幕 (${act.title})：</strong>${act.paragraphs[0] || ''}</p>`).join('')}
          </div>

          <div class="print-section">
            <h3>🙏 課堂結束禱告文</h3>
            <p>${l.prayer}</p>
          </div>
        </div>
      `;
    }

    setTimeout(() => {
      window.print();
    }, 200);
  }

  // Live Search Handler
  function handleSearch(e) {
    const q = e.target.value.trim().toLowerCase();
    if (!q) {
      els.clearSearchBtn.style.display = 'none';
      els.searchResultsDropdown.style.display = 'none';
      return;
    }

    els.clearSearchBtn.style.display = 'block';
    const matches = [];

    window.CURRICULUM_DATA.forEach(lesson => {
      let score = 0;
      let matchedIn = '';

      if (lesson.title.toLowerCase().includes(q)) { score += 10; matchedIn = '課名'; }
      else if (lesson.subtitle.toLowerCase().includes(q)) { score += 8; matchedIn = '副標題'; }
      else if (lesson.scripture.toLowerCase().includes(q)) { score += 7; matchedIn = '經文'; }
      else if (lesson.verse.toLowerCase().includes(q)) { score += 6; matchedIn = '金句'; }
      else if (lesson.hymn && lesson.hymn.title.toLowerCase().includes(q)) { score += 5; matchedIn = '詩歌'; }
      else if (JSON.stringify(lesson.story).toLowerCase().includes(q)) { score += 3; matchedIn = '故事內容'; }

      if (score > 0) {
        matches.push({ lesson, score, matchedIn });
      }
    });

    matches.sort((a, b) => b.score - a.score);

    if (matches.length) {
      els.searchResultsDropdown.innerHTML = matches.slice(0, 10).map(m => `
        <div class="search-result-item" data-quarter="${m.lesson.quarter}" data-num="${m.lesson.lesson_num}">
          <div class="search-res-title">[${m.lesson.quarter} 第${m.lesson.lesson_num}課] ${m.lesson.title}</div>
          <div class="search-res-snippet">匹配於：${m.matchedIn} · ${m.lesson.scripture || ''}</div>
        </div>
      `).join('');

      els.searchResultsDropdown.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          state.quarter = item.dataset.quarter;
          state.lessonNum = parseInt(item.dataset.num, 10);
          document.querySelectorAll('.quarter-btn').forEach(b => b.classList.toggle('active', b.dataset.quarter === state.quarter));
          renderLessonRail();
          loadCurrentLesson();
          updateUrlHash();
          els.searchResultsDropdown.style.display = 'none';
          els.searchInput.value = '';
          els.clearSearchBtn.style.display = 'none';
        });
      });
      els.searchResultsDropdown.style.display = 'block';
    } else {
      els.searchResultsDropdown.innerHTML = '<div style="padding: 12px; font-size: 0.85rem; color: #666;">找不到相關課堂內容</div>';
      els.searchResultsDropdown.style.display = 'block';
    }
  }

  function updateUrlHash() {
    window.location.hash = `${state.quarter.toLowerCase()}-${String(state.lessonNum).padStart(2, '0')}`;
  }

  function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // Run
  document.addEventListener('DOMContentLoaded', init);
})();
