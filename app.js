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
    // Slide Presentation Deck
    slideIndex: 1,
    isGridOpen: false,
    isAutoPlaying: false,
    autoPlayIntervalSec: 5,
    autoPlayTimer: null,
    isSpeaking: false,
    speechRate: 1.0,
    autoAdvanceTTS: false,
    speechKeepAlive: null,
    // Presentation Fullscreen Cockpit
    presentIndex: 0,
    presentSlides: [],
    presentTimerSec: 0,
    presentTimerInterval: null,
    presentTimerRunning: false,
    showNotesHud: true
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
    verseSpeakBtn: document.getElementById('verseSpeakBtn'),
    verseCopyBtn: document.getElementById('verseCopyBtn'),
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
    // Slide Deck Cockpit Elements
    tabSlides: document.getElementById('tab-slides'),
    slideDeckInfo: document.getElementById('slideDeckInfo'),
    slideAudioNarrateBtn: document.getElementById('slideAudioNarrateBtn'),
    slideAudioIcon: document.getElementById('slideAudioIcon'),
    soundwaveBars: document.getElementById('soundwaveBars'),
    slideAudioBtnText: document.getElementById('slideAudioBtnText'),
    slideAutoAdvanceBtn: document.getElementById('slideAutoAdvanceBtn'),
    slideAutoAdvanceText: document.getElementById('slideAutoAdvanceText'),
    slideAudioSpeedSelect: document.getElementById('slideAudioSpeedSelect'),
    slideshowPlayBtn: document.getElementById('slideshowPlayBtn'),
    slideshowPlayIcon: document.getElementById('slideshowPlayIcon'),
    slideshowPlayText: document.getElementById('slideshowPlayText'),
    slideshowIntervalSelect: document.getElementById('slideshowIntervalSelect'),
    currentSlideNum: document.getElementById('currentSlideNum'),
    totalSlideNum: document.getElementById('totalSlideNum'),
    slideJumpSelect: document.getElementById('slideJumpSelect'),
    btnGridView: document.getElementById('btnGridView'),
    btnSlidePrev: document.getElementById('btnSlidePrev'),
    btnSlideNext: document.getElementById('btnSlideNext'),
    btnSlideFullscreen: document.getElementById('btnSlideFullscreen'),
    slideStageMain: document.getElementById('slideStageMain'),
    slideMainImg: document.getElementById('slideMainImg'),
    slideTextFallback: document.getElementById('slideTextFallback'),
    fallbackTitle: document.getElementById('fallbackTitle'),
    fallbackSnippet: document.getElementById('fallbackSnippet'),
    overlayPrevBtn: document.getElementById('overlayPrevBtn'),
    overlayNextBtn: document.getElementById('overlayNextBtn'),
    slideAutoplayProgress: document.getElementById('slideAutoplayProgress'),
    slideGridGallery: document.getElementById('slideGridGallery'),
    thumbnailsStrip: document.getElementById('thumbnailsStrip'),
    reviewBadgeIdx: document.getElementById('reviewBadgeIdx'),
    reviewSlideTitle: document.getElementById('reviewSlideTitle'),
    reviewTimingBadge: document.getElementById('reviewTimingBadge'),
    btnSpeakVerbatim: document.getElementById('btnSpeakVerbatim'),
    btnCopyVerbatim: document.getElementById('btnCopyVerbatim'),
    reviewTeacherScript: document.getElementById('reviewTeacherScript'),
    reviewStudentPrompt: document.getElementById('reviewStudentPrompt'),
    reviewRawContent: document.getElementById('reviewRawContent'),
    // Presentation Modal (Upgraded)
    presentModeBtn: document.getElementById('presentModeBtn'),
    presentationModal: document.getElementById('presentationModal'),
    presentQuarterBadge: document.getElementById('presentQuarterBadge'),
    presentLessonBadge: document.getElementById('presentLessonBadge'),
    presentTitle: document.getElementById('presentTitle'),
    presentTimerDisplay: document.getElementById('presentTimerDisplay'),
    presentTimerToggleBtn: document.getElementById('presentTimerToggleBtn'),
    presentTimerIcon: document.getElementById('presentTimerIcon'),
    presentTimerResetBtn: document.getElementById('presentTimerResetBtn'),
    presentToggleNotesBtn: document.getElementById('presentToggleNotesBtn'),
    notesToggleText: document.getElementById('notesToggleText'),
    presentSlideIndicator: document.getElementById('presentSlideIndicator'),
    presentPrevBtn: document.getElementById('presentPrevBtn'),
    presentNextBtn: document.getElementById('presentNextBtn'),
    presentExitBtn: document.getElementById('presentExitBtn'),
    presentContentDisplay: document.getElementById('presentContentDisplay'),
    presenterImg: document.getElementById('presenterImg'),
    presenterTextFallback: document.getElementById('presenterTextFallback'),
    presenterFallbackTitle: document.getElementById('presenterFallbackTitle'),
    presenterFallbackText: document.getElementById('presenterFallbackText'),
    presenterNotesHud: document.getElementById('presenterNotesHud'),
    hudTimingBadge: document.getElementById('hudTimingBadge'),
    hudTeacherScript: document.getElementById('hudTeacherScript'),
    hudStudentPrompt: document.getElementById('hudStudentPrompt'),
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
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    toastNotification: document.getElementById('toastNotification')
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

    // Verse Audio & Copy
    if (els.verseSpeakBtn) els.verseSpeakBtn.addEventListener('click', speakVerse);
    if (els.verseCopyBtn) els.verseCopyBtn.addEventListener('click', copyVerse);

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

    // Slide Deck Cockpit Controls
    if (els.btnSlidePrev) els.btnSlidePrev.addEventListener('click', prevSlide);
    if (els.btnSlideNext) els.btnSlideNext.addEventListener('click', nextSlide);
    if (els.overlayPrevBtn) els.overlayPrevBtn.addEventListener('click', prevSlide);
    if (els.overlayNextBtn) els.overlayNextBtn.addEventListener('click', nextSlide);
    if (els.slideJumpSelect) {
      els.slideJumpSelect.addEventListener('change', (e) => {
        setSlide(parseInt(e.target.value, 10), 'none');
      });
    }
    if (els.btnGridView) els.btnGridView.addEventListener('click', toggleGridView);
    if (els.btnSlideFullscreen) els.btnSlideFullscreen.addEventListener('click', openPresentationMode);

    // Speech Narration Controls
    if (els.slideAudioNarrateBtn) els.slideAudioNarrateBtn.addEventListener('click', toggleSpeechNarration);
    if (els.btnSpeakVerbatim) els.btnSpeakVerbatim.addEventListener('click', toggleSpeechNarration);
    if (els.btnCopyVerbatim) els.btnCopyVerbatim.addEventListener('click', copyTeacherScript);
    if (els.slideAutoAdvanceBtn) els.slideAutoAdvanceBtn.addEventListener('click', toggleAutoAdvance);
    if (els.slideAudioSpeedSelect) {
      els.slideAudioSpeedSelect.addEventListener('change', (e) => {
        state.speechRate = parseFloat(e.target.value);
      });
    }

    // Timed Slideshow Controls
    if (els.slideshowPlayBtn) els.slideshowPlayBtn.addEventListener('click', toggleSlideshowAutoplay);
    if (els.slideshowIntervalSelect) {
      els.slideshowIntervalSelect.addEventListener('change', (e) => {
        state.autoPlayIntervalSec = parseInt(e.target.value, 10);
        if (state.isAutoPlaying) {
          stopSlideshowAutoplay();
          startSlideshowAutoplay();
        }
      });
    }

    // Presentation Modal Controls
    if (els.presentModeBtn) els.presentModeBtn.addEventListener('click', openPresentationMode);
    if (els.presentExitBtn) els.presentExitBtn.addEventListener('click', closePresentationMode);
    if (els.presentPrevBtn) els.presentPrevBtn.addEventListener('click', prevSlide);
    if (els.presentNextBtn) els.presentNextBtn.addEventListener('click', nextSlide);
    if (els.presentTimerToggleBtn) els.presentTimerToggleBtn.addEventListener('click', togglePresenterTimer);
    if (els.presentTimerResetBtn) els.presentTimerResetBtn.addEventListener('click', resetPresenterTimer);
    if (els.presentToggleNotesBtn) els.presentToggleNotesBtn.addEventListener('click', togglePresenterNotesHud);

    // Global & Modal Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      const modalOpen = els.presentationModal && !els.presentationModal.classList.contains('hidden');
      const isSlidesTab = state.activeTab === 'tab-slides';

      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
      }

      // Hotkey to focus search box: / or Ctrl+K
      if (e.key === '/' || (e.key === 'k' && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        if (els.searchInput) {
          els.searchInput.focus();
          els.searchInput.select();
        }
        return;
      }

      if (modalOpen) {
        if (e.key === 'ArrowRight' || e.key === 'Space') {
          e.preventDefault();
          nextSlide();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevSlide();
        } else if (e.key === 'Escape') {
          closePresentationMode();
        } else if (e.key === 'n' || e.key === 'N') {
          togglePresenterNotesHud();
        }
      } else if (isSlidesTab) {
        if (e.key === 'ArrowRight' || e.key === 'Space') {
          e.preventDefault();
          nextSlide();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevSlide();
        } else if (e.key === 'f' || e.key === 'F') {
          e.preventDefault();
          openPresentationMode();
        } else if (e.key === 'g' || e.key === 'G') {
          e.preventDefault();
          toggleGridView();
        } else if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          toggleSlideshowAutoplay();
        } else if (e.key === 'Escape' && state.isGridOpen) {
          toggleGridView();
        }
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

    // 11. Render Slide Deck Presentation Cockpit (BlessEq architecture)
    state.slideIndex = 1;
    stopSpeechNarration();
    stopSlideshowAutoplay();
    renderSlideDeck();

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

  // Toast Notification Utility (和風微浮動提示)
  let toastTimeout = null;
  function showToast(message, icon = 'fa-check') {
    if (!els.toastNotification) return;
    els.toastNotification.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    els.toastNotification.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      if (els.toastNotification) els.toastNotification.classList.remove('show');
    }, 2400);
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('已複製到剪貼簿！', 'fa-copy');
    } catch (err) {
      showToast('複製失敗，請手動選取複製', 'fa-circle-exclamation');
    }
    document.body.removeChild(ta);
  }

  // Verse Audio & Copy
  function speakVerse() {
    const l = state.currentLesson;
    if (!l || !l.verse) return;
    if (!('speechSynthesis' in window)) {
      showToast('您的瀏覽器不支援語音朗讀功能', 'fa-triangle-exclamation');
      return;
    }
    window.speechSynthesis.cancel();
    const cleanVerse = l.verse.replace(/^背誦金句[：:]\s*/, '').replace(/[「」『』]/g, '');
    const utter = new SpeechSynthesisUtterance(cleanVerse);
    utter.lang = 'zh-TW';
    utter.rate = state.speechRate;

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const zhVoice = voices.find(v => v.lang === 'zh-TW') || voices.find(v => v.lang && v.lang.startsWith('zh'));
      if (zhVoice) utter.voice = zhVoice;
    };
    if (window.speechSynthesis.getVoices().length > 0) setVoice();
    else window.speechSynthesis.addEventListener('voiceschanged', setVoice, { once: true });

    showToast('正在朗讀本課背誦金句...', 'fa-volume-high');
    if (els.verseSpeakBtn) els.verseSpeakBtn.classList.add('active');

    utter.onend = () => {
      if (els.verseSpeakBtn) els.verseSpeakBtn.classList.remove('active');
    };
    utter.onerror = () => {
      if (els.verseSpeakBtn) els.verseSpeakBtn.classList.remove('active');
    };

    window.speechSynthesis.speak(utter);
  }

  function copyVerse() {
    const l = state.currentLesson;
    if (!l || !l.verse) return;
    const cleanVerse = l.verse.replace(/^背誦金句[：:]\s*/, '');
    const citation = l.scripture || '';
    const fullText = `${cleanVerse} ${citation ? '——' + citation : ''}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText).then(() => {
        showToast('本課金句已成功複製！', 'fa-copy');
      }).catch(() => fallbackCopy(fullText));
    } else {
      fallbackCopy(fullText);
    }
  }

  function copyTeacherScript() {
    const slides = getCurrentLessonSlides();
    if (!slides || !slides.length) return;
    const idx = Math.max(1, Math.min(state.slideIndex, slides.length));
    const slide = slides[idx - 1];
    if (!slide || !slide.teacherScript) return;
    const text = slide.teacherScript.replace(/^[『「]|['』」]$/g, '');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('老師講述逐字稿已複製！', 'fa-copy');
      }).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
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

  // ==========================================================================
  // BlessEq-Inspired Slide Presentation Deck & Deep Review Cockpit (V3)
  // ==========================================================================

  function getCurrentLessonSlides() {
    if (!state.currentLesson) return [];
    const lessonId = state.currentLesson.id || `${state.quarter.toLowerCase()}-${String(state.lessonNum).padStart(2, '0')}`;
    if (window.SLIDES_DATA && window.SLIDES_DATA[lessonId]) {
      return window.SLIDES_DATA[lessonId].slides || [];
    }
    return [];
  }

  function renderSlideDeck() {
    const slides = getCurrentLessonSlides();
    if (!slides || !slides.length) return;

    if (els.slideDeckInfo) {
      els.slideDeckInfo.textContent = `本課共 ${slides.length} 頁高畫質投影片`;
    }
    if (els.totalSlideNum) {
      els.totalSlideNum.textContent = slides.length;
    }

    // Populate Slide Jump Select
    if (els.slideJumpSelect) {
      els.slideJumpSelect.innerHTML = '';
      slides.forEach((s, i) => {
        const opt = document.createElement('option');
        opt.value = i + 1;
        opt.textContent = `${s.badge || '投影片 #' + (i + 1)} · ${(s.title || '').slice(0, 14)}`;
        els.slideJumpSelect.appendChild(opt);
      });
    }

    // Render Thumbnails & Grid
    renderThumbnails(slides);
    if (state.isGridOpen) {
      renderSlideGrid(slides);
    }

    // Set initial slide
    setSlide(state.slideIndex || 1, 'none');
  }

  function setSlide(newIdx, direction = 'none') {
    const slides = getCurrentLessonSlides();
    if (!slides || !slides.length) return;

    const idx = Math.max(1, Math.min(newIdx, slides.length));
    state.slideIndex = idx;
    const slide = slides[idx - 1];
    if (!slide) return;

    // Counter & Select
    if (els.currentSlideNum) els.currentSlideNum.textContent = idx;
    if (els.slideJumpSelect) els.slideJumpSelect.value = idx;

    // Prev / Next button states
    if (els.btnSlidePrev) els.btnSlidePrev.disabled = idx === 1;
    if (els.btnSlideNext) els.btnSlideNext.disabled = idx === slides.length;
    if (els.overlayPrevBtn) els.overlayPrevBtn.style.display = idx === 1 ? 'none' : 'flex';
    if (els.overlayNextBtn) els.overlayNextBtn.style.display = idx === slides.length ? 'none' : 'flex';

    // Slide Image Transition
    const img = els.slideMainImg;
    if (img) {
      img.classList.remove('enter-right', 'enter-left');
      void img.offsetWidth; // trigger reflow
      if (direction === 'next') img.classList.add('enter-right');
      else if (direction === 'prev') img.classList.add('enter-left');

      if (slide.image) {
        img.style.display = 'block';
        if (els.slideTextFallback) els.slideTextFallback.style.display = 'none';
        img.src = slide.image;
        img.alt = slide.alt || slide.title || `投影片 #${idx}`;
      } else {
        img.style.display = 'none';
        if (els.slideTextFallback) {
          els.slideTextFallback.style.display = 'block';
          if (els.fallbackTitle) els.fallbackTitle.textContent = slide.title || `投影片 #${idx}`;
          if (els.fallbackSnippet) els.fallbackSnippet.textContent = slide.rawText || '本頁為重要真理與課堂互動提要';
        }
      }
    }

    // Sync Thumbnails Strip
    syncThumbnailActive(idx);

    // Sync Grid Active
    if (els.slideGridGallery) {
      els.slideGridGallery.querySelectorAll('.slide-grid-thumb').forEach(t => {
        t.classList.toggle('active', parseInt(t.dataset.idx, 10) === idx);
      });
    }

    // Populate Deep Review Pane
    if (els.reviewBadgeIdx) els.reviewBadgeIdx.textContent = slide.badge || `投影片 #${idx}`;
    if (els.reviewSlideTitle) els.reviewSlideTitle.textContent = slide.title || '投影片重點提要';
    if (els.reviewTimingBadge) els.reviewTimingBadge.textContent = slide.timing || '⏱️ 建議停留：2-3 分鐘';

    if (els.reviewTeacherScript) {
      const script = slide.teacherScript ? slide.teacherScript.replace(/^[『「]|['』」]$/g, '') : '（請參考原文字稿進行口頭發揮，引導孩子們感受上帝話語的大能）';
      els.reviewTeacherScript.textContent = script;
    }

    if (els.reviewStudentPrompt) {
      els.reviewStudentPrompt.textContent = slide.studentPrompt || '（提問孩子們對於今天故事與生活情境的想法）';
    }

    if (els.reviewRawContent) {
      els.reviewRawContent.textContent = slide.rawText || '此頁為視覺插畫或概念總覽';
    }

    // If Presenter Modal is open, update it
    if (els.presentationModal && !els.presentationModal.classList.contains('hidden')) {
      updatePresenterSlide();
    }

    // Preload adjacent slides
    [idx - 1, idx + 1, idx + 2].forEach(i => {
      if (i >= 1 && i <= slides.length && slides[i - 1] && slides[i - 1].image) {
        const pImg = new Image();
        pImg.src = slides[i - 1].image;
      }
    });
  }

  function nextSlide() {
    const slides = getCurrentLessonSlides();
    if (state.slideIndex < slides.length) {
      setSlide(state.slideIndex + 1, 'next');
    }
  }

  function prevSlide() {
    if (state.slideIndex > 1) {
      setSlide(state.slideIndex - 1, 'prev');
    }
  }

  // Thumbnails Strip
  function renderThumbnails(slides) {
    if (!els.thumbnailsStrip) return;
    els.thumbnailsStrip.innerHTML = '';

    slides.forEach((slide, i) => {
      const idx = i + 1;
      const thumb = document.createElement('div');
      thumb.className = `thumb-item ${idx === state.slideIndex ? 'active' : ''}`;
      thumb.dataset.idx = idx;
      thumb.title = `第 ${idx} 頁：${slide.title || ''}`;

      if (slide.image) {
        const img = document.createElement('img');
        img.src = slide.image;
        img.alt = '';
        img.loading = 'lazy';
        thumb.appendChild(img);
      } else {
        const fallbackSpan = document.createElement('div');
        fallbackSpan.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100%;font-size:0.65rem;color:#fbbf24;text-align:center;padding:2px;background:#27272a;';
        fallbackSpan.textContent = '重點頁';
        thumb.appendChild(fallbackSpan);
      }

      const idxBadge = document.createElement('span');
      idxBadge.className = 'thumb-idx';
      idxBadge.textContent = `#${idx}`;
      thumb.appendChild(idxBadge);

      thumb.addEventListener('click', () => {
        const dir = idx > state.slideIndex ? 'next' : (idx < state.slideIndex ? 'prev' : 'none');
        setSlide(idx, dir);
      });

      els.thumbnailsStrip.appendChild(thumb);
    });
  }

  function syncThumbnailActive(activeIdx) {
    if (!els.thumbnailsStrip) return;
    els.thumbnailsStrip.querySelectorAll('.thumb-item').forEach(t => {
      const isActive = parseInt(t.dataset.idx, 10) === activeIdx;
      t.classList.toggle('active', isActive);
      if (isActive) {
        t.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });
  }

  // Grid Gallery Overview
  function renderSlideGrid(slides) {
    if (!els.slideGridGallery) return;
    els.slideGridGallery.innerHTML = '';

    slides.forEach((slide, i) => {
      const idx = i + 1;
      const thumb = document.createElement('div');
      thumb.className = `slide-grid-thumb ${idx === state.slideIndex ? 'active' : ''}`;
      thumb.dataset.idx = idx;

      if (slide.image) {
        const img = document.createElement('img');
        img.src = slide.image;
        img.alt = '';
        img.loading = 'lazy';
        thumb.appendChild(img);
      } else {
        const textDiv = document.createElement('div');
        textDiv.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100%;font-size:0.8rem;color:#fef08a;background:#27272a;padding:6px;text-align:center;';
        textDiv.textContent = slide.title || `第 ${idx} 頁`;
        thumb.appendChild(textDiv);
      }

      const badge = document.createElement('span');
      badge.className = 'grid-thumb-idx';
      badge.textContent = `#${idx}`;
      thumb.appendChild(badge);

      thumb.addEventListener('click', () => {
        const dir = idx > state.slideIndex ? 'next' : 'prev';
        setSlide(idx, dir);
        toggleGridView();
      });

      els.slideGridGallery.appendChild(thumb);
    });
  }

  function toggleGridView() {
    if (!els.slideGridGallery) return;
    state.isGridOpen = !state.isGridOpen;
    els.slideGridGallery.hidden = !state.isGridOpen;
    if (els.btnGridView) {
      els.btnGridView.classList.toggle('active', state.isGridOpen);
    }
    if (state.isGridOpen) {
      const slides = getCurrentLessonSlides();
      renderSlideGrid(slides);
    }
  }

  // Web Speech API Narration
  function toggleSpeechNarration() {
    if (!('speechSynthesis' in window)) {
      alert('您的瀏覽器不支援 Web Speech 語音合成功能，建議使用 Chrome / Edge 瀏覽器體驗！');
      return;
    }
    if (state.isSpeaking) {
      stopSpeechNarration();
    } else {
      startSpeechNarration();
    }
  }

  function startSpeechNarration(isAutoAdvance = false) {
    const slides = getCurrentLessonSlides();
    if (!slides || !slides.length) return;
    const slide = slides[state.slideIndex - 1];
    if (!slide) return;

    stopSpeechNarration(false);
    state.isSpeaking = true;

    if (els.slideAudioNarrateBtn) {
      els.slideAudioNarrateBtn.classList.add('speaking');
    }
    if (els.slideAudioIcon) {
      els.slideAudioIcon.className = 'fa-solid fa-pause';
    }
    if (els.slideAudioBtnText) {
      els.slideAudioBtnText.textContent = '暫停朗讀';
    }

    let textToSpeak = '';
    if (slide.teacherScript) {
      textToSpeak += slide.teacherScript.replace(/[『』「」]/g, '') + '。';
    }
    if (slide.studentPrompt) {
      textToSpeak += ' 課堂提問：' + slide.studentPrompt;
    }
    if (!textToSpeak.trim()) {
      textToSpeak = (slide.title || '') + '。' + (slide.rawText || '');
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'zh-TW';
    utterance.rate = state.speechRate;

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const zhVoice = voices.find(v => v.lang === 'zh-TW') || voices.find(v => v.lang && v.lang.startsWith('zh'));
      if (zhVoice) utterance.voice = zhVoice;
    };
    if (window.speechSynthesis.getVoices().length > 0) setVoice();
    else window.speechSynthesis.addEventListener('voiceschanged', setVoice, { once: true });

    utterance.onend = () => {
      state.isSpeaking = false;
      clearInterval(state.speechKeepAlive);
      if (els.slideAudioNarrateBtn) els.slideAudioNarrateBtn.classList.remove('speaking');
      if (els.slideAudioIcon) els.slideAudioIcon.className = 'fa-solid fa-volume-high';
      if (els.slideAudioBtnText) els.slideAudioBtnText.textContent = '朗讀本頁講稿';

      if (state.autoAdvanceTTS) {
        if (state.slideIndex < slides.length) {
          setTimeout(() => {
            nextSlide();
            setTimeout(() => {
              startSpeechNarration(true);
            }, 600);
          }, 800);
        }
      }
    };

    utterance.onerror = () => {
      stopSpeechNarration();
    };

    clearInterval(state.speechKeepAlive);
    state.speechKeepAlive = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);

    window.speechSynthesis.speak(utterance);
  }

  function stopSpeechNarration(resetState = true) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    clearInterval(state.speechKeepAlive);
    if (resetState) {
      state.isSpeaking = false;
      if (els.slideAudioNarrateBtn) els.slideAudioNarrateBtn.classList.remove('speaking');
      if (els.slideAudioIcon) els.slideAudioIcon.className = 'fa-solid fa-volume-high';
      if (els.slideAudioBtnText) els.slideAudioBtnText.textContent = '朗讀本頁講稿';
    }
  }

  function toggleAutoAdvance() {
    state.autoAdvanceTTS = !state.autoAdvanceTTS;
    if (els.slideAutoAdvanceBtn) {
      els.slideAutoAdvanceBtn.classList.toggle('active', state.autoAdvanceTTS);
    }
    if (els.slideAutoAdvanceText) {
      els.slideAutoAdvanceText.textContent = state.autoAdvanceTTS ? '自動連播：開' : '自動連播：關';
    }
  }

  // Timed Slideshow Autoplay
  function toggleSlideshowAutoplay() {
    if (state.isAutoPlaying) {
      stopSlideshowAutoplay();
    } else {
      startSlideshowAutoplay();
    }
  }

  function startSlideshowAutoplay() {
    state.isAutoPlaying = true;
    if (els.slideshowPlayBtn) els.slideshowPlayBtn.classList.add('playing');
    if (els.slideshowPlayIcon) els.slideshowPlayIcon.className = 'fa-solid fa-pause';
    if (els.slideshowPlayText) els.slideshowPlayText.textContent = '暫停放映';

    const intervalMs = state.autoPlayIntervalSec * 1000;
    if (els.slideAutoplayProgress) {
      els.slideAutoplayProgress.style.transition = `width ${state.autoPlayIntervalSec}s linear`;
      els.slideAutoplayProgress.style.width = '100%';
    }

    state.autoPlayTimer = setInterval(() => {
      const slides = getCurrentLessonSlides();
      if (state.slideIndex >= slides.length) {
        setSlide(1, 'next');
      } else {
        nextSlide();
      }
      if (els.slideAutoplayProgress) {
        els.slideAutoplayProgress.style.transition = 'none';
        els.slideAutoplayProgress.style.width = '0%';
        setTimeout(() => {
          if (els.slideAutoplayProgress) {
            els.slideAutoplayProgress.style.transition = `width ${state.autoPlayIntervalSec}s linear`;
            els.slideAutoplayProgress.style.width = '100%';
          }
        }, 50);
      }
    }, intervalMs);
  }

  function stopSlideshowAutoplay() {
    state.isAutoPlaying = false;
    clearInterval(state.autoPlayTimer);
    if (els.slideshowPlayBtn) els.slideshowPlayBtn.classList.remove('playing');
    if (els.slideshowPlayIcon) els.slideshowPlayIcon.className = 'fa-solid fa-play';
    if (els.slideshowPlayText) els.slideshowPlayText.textContent = '幻燈放映';
    if (els.slideAutoplayProgress) {
      els.slideAutoplayProgress.style.transition = 'none';
      els.slideAutoplayProgress.style.width = '0%';
    }
  }

  // Presenter Fullscreen Cockpit
  function openPresentationMode() {
    const l = state.currentLesson;
    if (!l) return;
    const slides = getCurrentLessonSlides();
    if (!slides.length) return;

    if (els.presentQuarterBadge) els.presentQuarterBadge.textContent = l.quarter;
    if (els.presentLessonBadge) els.presentLessonBadge.textContent = `第 ${l.lesson_num} 課`;
    if (els.presentTitle) els.presentTitle.textContent = l.title;

    els.presentationModal.classList.remove('hidden');
    updatePresenterSlide();
    startPresenterTimer();
  }

  function updatePresenterSlide() {
    const slides = getCurrentLessonSlides();
    if (!slides.length) return;
    const idx = Math.max(1, Math.min(state.slideIndex, slides.length));
    const slide = slides[idx - 1];
    if (!slide) return;

    if (els.presentSlideIndicator) {
      els.presentSlideIndicator.textContent = `${idx} / ${slides.length}`;
    }

    if (slide.image) {
      if (els.presenterImg) {
        els.presenterImg.style.display = 'block';
        els.presenterImg.src = slide.image;
        els.presenterImg.alt = slide.title || `投影片 #${idx}`;
      }
      if (els.presenterTextFallback) els.presenterTextFallback.style.display = 'none';
    } else {
      if (els.presenterImg) els.presenterImg.style.display = 'none';
      if (els.presenterTextFallback) {
        els.presenterTextFallback.style.display = 'block';
        if (els.presenterFallbackTitle) els.presenterFallbackTitle.textContent = slide.title || `投影片 #${idx}`;
        if (els.presenterFallbackText) els.presenterFallbackText.textContent = slide.rawText || '';
      }
    }

    // Teleprompter / HUD
    if (els.hudTimingBadge) els.hudTimingBadge.textContent = slide.timing || '建議 2-3 分鐘';
    if (els.hudTeacherScript) {
      els.hudTeacherScript.textContent = slide.teacherScript ? slide.teacherScript.replace(/^[『「]|['』」]$/g, '') : '（參考投影片重點進行口頭分享）';
    }
    if (els.hudStudentPrompt) {
      els.hudStudentPrompt.textContent = slide.studentPrompt || '（課堂互動提問）';
    }

    if (els.presentPrevBtn) els.presentPrevBtn.disabled = idx === 1;
    if (els.presentNextBtn) els.presentNextBtn.disabled = idx === slides.length;
  }

  function closePresentationMode() {
    els.presentationModal.classList.add('hidden');
    stopPresenterTimer();
  }

  function togglePresenterTimer() {
    if (state.presentTimerRunning) {
      stopPresenterTimer();
    } else {
      startPresenterTimer();
    }
  }

  function startPresenterTimer() {
    if (state.presentTimerRunning) return;
    state.presentTimerRunning = true;
    if (els.presentTimerIcon) els.presentTimerIcon.className = 'fa-solid fa-pause';
    state.presentTimerInterval = setInterval(() => {
      state.presentTimerSec++;
      const m = Math.floor(state.presentTimerSec / 60);
      const s = state.presentTimerSec % 60;
      if (els.presentTimerDisplay) {
        els.presentTimerDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }
    }, 1000);
  }

  function stopPresenterTimer() {
    state.presentTimerRunning = false;
    clearInterval(state.presentTimerInterval);
    if (els.presentTimerIcon) els.presentTimerIcon.className = 'fa-solid fa-play';
  }

  function resetPresenterTimer() {
    stopPresenterTimer();
    state.presentTimerSec = 0;
    if (els.presentTimerDisplay) els.presentTimerDisplay.textContent = '00:00';
  }

  function togglePresenterNotesHud() {
    state.showNotesHud = !state.showNotesHud;
    if (els.presenterNotesHud) {
      els.presenterNotesHud.classList.toggle('minimized', !state.showNotesHud);
    }
    if (els.presentToggleNotesBtn) {
      els.presentToggleNotesBtn.classList.toggle('active', state.showNotesHud);
    }
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
