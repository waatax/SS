// ==========================================================================
// Sunday School Teaching AidKit 備課資料 - Main Application Controller
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
    activeTab: 'tab-slides',
    // Timer
    timerSeconds: 300,
    timerTotal: 300,
    timerInterval: null,
    timerRunning: false,
    // Slide Presentation Deck
    slideIndex: 1,
    isGridOpen: false,
    isTheaterMode: false,
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
    // Auth & Protection Elements
    pptLockGate: document.getElementById('pptLockGate'),
    slideDeckContainer: document.getElementById('slideDeckContainer'),
    pptAuthStatusBtn: document.getElementById('pptAuthStatusBtn'),
    pptAuthStatusText: document.getElementById('pptAuthStatusText'),
    pptAuthModal: document.getElementById('pptAuthModal'),
    closePptAuthModalBtn: document.getElementById('closePptAuthModalBtn'),
    closePptAuthModalBackdrop: document.getElementById('closePptAuthModalBackdrop'),
    pptAuthModalForm: document.getElementById('pptAuthModalForm'),
    modalPptPasswordInput: document.getElementById('modalPptPasswordInput'),
    modalToggleEyeBtn: document.getElementById('modalToggleEyeBtn'),
    modalPptAuthError: document.getElementById('modalPptAuthError'),
    pptInlineAuthForm: document.getElementById('pptInlineAuthForm'),
    inlinePptPasswordInput: document.getElementById('inlinePptPasswordInput'),
    inlineToggleEyeBtn: document.getElementById('inlineToggleEyeBtn'),
    inlinePptAuthError: document.getElementById('inlinePptAuthError'),

    // AI Diagrams Elements
    tabAiDiagrams: document.getElementById('tab-ai-diagrams'),
    aiBannerSymbol: document.getElementById('aiBannerSymbol'),
    aiBannerTitle: document.getElementById('aiBannerTitle'),
    aiBannerSubtitle: document.getElementById('aiBannerSubtitle'),
    aiMindmapTheme: document.getElementById('aiMindmapTheme'),
    aiMindmapRoadmap: document.getElementById('aiMindmapRoadmap'),
    aiTheologyContainer: document.getElementById('aiTheologyContainer'),
    aiPacingBar: document.getElementById('aiPacingBar'),
    aiVerseTreeContainer: document.getElementById('aiVerseTreeContainer'),
    btnPrintAiDiagrams: document.getElementById('btnPrintAiDiagrams'),

    // Auxiliary Teaching Materials Elements
    tabAuxLib: document.getElementById('tab-aux-lib'),
    auxDramaTitle: document.getElementById('auxDramaTitle'),
    auxDramaBody: document.getElementById('auxDramaBody'),
    auxFamilyBody: document.getElementById('auxFamilyBody'),
    auxHebrewTitle: document.getElementById('auxHebrewTitle'),
    auxHebrewBody: document.getElementById('auxHebrewBody'),
    auxSopTitle: document.getElementById('auxSopTitle'),
    auxSopBody: document.getElementById('auxSopBody'),
    auxFaqTitle: document.getElementById('auxFaqTitle'),
    auxFaqBody: document.getElementById('auxFaqBody'),

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
    heroPlayPptBtn: document.getElementById('heroPlayPptBtn'),
    heroPresentPptBtn: document.getElementById('heroPresentPptBtn'),
    heroDownloadPptBtn: document.getElementById('heroDownloadPptBtn'),
    heroPptSource: document.getElementById('heroPptSource'),
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
    pptFileBadge: document.getElementById('pptFileBadge'),
    pptFileNameText: document.getElementById('pptFileNameText'),
    pptLessonSwitcher: document.getElementById('pptLessonSwitcher'),
    slideDownloadPptxBtn: document.getElementById('slideDownloadPptxBtn'),
    btnToolbarPresent: document.getElementById('btnToolbarPresent'),
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
    btnTheaterMode: document.getElementById('btnTheaterMode'),
    btnSlidePrev: document.getElementById('btnSlidePrev'),
    btnSlideNext: document.getElementById('btnSlideNext'),
    btnSlideFullscreen: document.getElementById('btnSlideFullscreen'),
    // Mobile slide thumb bar
    mobileSlideBar: document.getElementById('mobileSlideBar'),
    mBtnSlidePrev: document.getElementById('mBtnSlidePrev'),
    mBtnSlideNext: document.getElementById('mBtnSlideNext'),
    mBtnSlideSpeak: document.getElementById('mBtnSlideSpeak'),
    mBtnSlideFullscreen: document.getElementById('mBtnSlideFullscreen'),
    mCurrentSlide: document.getElementById('mCurrentSlide'),
    mTotalSlide: document.getElementById('mTotalSlide'),
    mAudioIcon: document.getElementById('mAudioIcon'),
    slideStageMain: document.getElementById('slideStageMain'),
    slideStageLoader: document.getElementById('slideStageLoader'),
    slideMainImg: document.getElementById('slideMainImg'),
    slideTextFallback: document.getElementById('slideTextFallback'),
    fallbackTitle: document.getElementById('fallbackTitle'),
    fallbackSnippet: document.getElementById('fallbackSnippet'),
    fallbackRetryBtn: document.getElementById('fallbackRetryBtn'),
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
    presenterFileTag: document.getElementById('presenterFileTag'),
    presenterFileName: document.getElementById('presenterFileName'),
    presenterDlBtn: document.getElementById('presenterDlBtn'),
    presentTitle: document.getElementById('presentTitle'),
    presentTimerDisplay: document.getElementById('presentTimerDisplay'),
    presentTimerToggleBtn: document.getElementById('presentTimerToggleBtn'),
    presentTimerIcon: document.getElementById('presentTimerIcon'),
    presentTimerResetBtn: document.getElementById('presentTimerResetBtn'),
    presentAutoplayBtn: document.getElementById('presentAutoplayBtn'),
    presentAutoplayIcon: document.getElementById('presentAutoplayIcon'),
    presentAutoplayText: document.getElementById('presentAutoplayText'),
    presentSpeakBtn: document.getElementById('presentSpeakBtn'),
    presentSpeakIcon: document.getElementById('presentSpeakIcon'),
    presentSpeakText: document.getElementById('presentSpeakText'),
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
    // PPT Catalog Modal
    btnPptCatalogModal: document.getElementById('btnPptCatalogModal'),
    pptCatalogModal: document.getElementById('pptCatalogModal'),
    closePptModalBtn: document.getElementById('closePptModalBtn'),
    closePptModalBtn2: document.getElementById('closePptModalBtn2'),
    closePptModalBackdrop: document.getElementById('closePptModalBackdrop'),
    pptTabQ3: document.getElementById('pptTabQ3'),
    pptTabQ4: document.getElementById('pptTabQ4'),
    pptCatalogBody: document.getElementById('pptCatalogBody'),
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
      console.warn('Curriculum data not loaded yet, retrying in 50ms...');
      setTimeout(init, 50);
      return;
    }

    try {
      // Check URL Hash for initial lesson (e.g. #2026-q3-01)
      parseHash();
    } catch (e) {
      console.warn('Error parsing hash:', e);
    }

    try {
      // Event Listeners
      setupEventListeners();
    } catch (e) {
      console.error('Error in setupEventListeners:', e);
    }

    try {
      // Populate PPT Lesson Switcher Dropdown
      populatePptLessonSwitcher();
    } catch (e) {
      console.warn('Error populating switcher:', e);
    }

    try {
      // Render Initial Lesson
      renderLessonRail();
    } catch (e) {
      console.warn('Error rendering rail:', e);
    }

    try {
      loadCurrentLesson();
    } catch (e) {
      console.error('Error loading current lesson:', e);
    }
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

  // PPT File Information Helper
  function getPptFileInfo(quarter, lessonNum) {
    const q = quarter || state.quarter || '2026-Q3';
    const num = lessonNum || state.lessonNum || 1;
    const folder = `${q} PPT`;
    const fileName = `繁${q}-第${num}課.pptx`;
    const encodedPath = `${encodeURIComponent(folder)}/${encodeURIComponent(fileName)}`;
    return {
      quarter: q,
      lessonNum: num,
      folder,
      fileName,
      displayPath: `${folder} / ${fileName}`,
      downloadUrl: encodedPath
    };
  }

  function populatePptLessonSwitcher() {
    if (!els.pptLessonSwitcher || !window.CURRICULUM_DATA) return;
    els.pptLessonSwitcher.innerHTML = '';

    const q3Lessons = window.CURRICULUM_DATA.filter(l => l.quarter === '2026-Q3');
    const q4Lessons = window.CURRICULUM_DATA.filter(l => l.quarter === '2026-Q4');

    const g3 = document.createElement('optgroup');
    g3.label = '📁 2026-Q3 PPT (13 份簡報)';
    q3Lessons.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l.id;
      opt.textContent = `第 ${l.lesson_num} 課：${l.title}`;
      g3.appendChild(opt);
    });
    els.pptLessonSwitcher.appendChild(g3);

    const g4 = document.createElement('optgroup');
    g4.label = '📁 2026-Q4 PPT (13 份簡報)';
    q4Lessons.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l.id;
      opt.textContent = `第 ${l.lesson_num} 課：${l.title}`;
      g4.appendChild(opt);
    });
    els.pptLessonSwitcher.appendChild(g4);

    if (state.currentLesson) {
      els.pptLessonSwitcher.value = state.currentLesson.id;
    }
  }

  function switchLessonById(lessonId) {
    if (!lessonId) return;
    const match = lessonId.match(/(2026-q[34])-(\d+)/i);
    if (!match) return;
    const quarter = match[1].toUpperCase();
    const num = parseInt(match[2], 10);
    state.quarter = quarter;
    state.lessonNum = num;
    document.querySelectorAll('.quarter-btn').forEach(b => b.classList.toggle('active', b.dataset.quarter === quarter));
    renderLessonRail();
    loadCurrentLesson();
    updateUrlHash();
    if (els.pptLessonSwitcher) {
      els.pptLessonSwitcher.value = lessonId;
    }
  }

  
  // ==========================================================================
  // PPT Copyright Protection & WOLSS Password Authentication System
  // ==========================================================================

  const WOLSS_KEY = 'ss_wolss_auth_unlocked';
  const WOLSS_CORRECT_PASSWORD = 'WOLSS';
  let pendingAuthAction = null;

  function isPptUnlocked() {
    try {
      return localStorage.getItem(WOLSS_KEY) === 'true' || sessionStorage.getItem(WOLSS_KEY) === 'true';
    } catch (e) {
      return false;
    }
  }

  function verifyPptPassword(input) {
    if (!input) return false;
    return input.trim().toUpperCase() === WOLSS_CORRECT_PASSWORD;
  }

  function unlockPptSystem(callback) {
    try {
      localStorage.setItem(WOLSS_KEY, 'true');
      sessionStorage.setItem(WOLSS_KEY, 'true');
    } catch (e) {}

    updatePptLockUI();
    closePptAuthModal();
    showToast('🎉 通行密碼驗證成功！已解鎖 PPT 投影片檢視與播放功能。');

    if (state.activeTab === 'tab-slides') {
      renderSlideDeck();
    }

    if (typeof callback === 'function') {
      callback();
    } else if (pendingAuthAction) {
      const act = pendingAuthAction;
      pendingAuthAction = null;
      act();
    }
  }

  function lockPptSystem() {
    try {
      localStorage.removeItem(WOLSS_KEY);
      sessionStorage.removeItem(WOLSS_KEY);
    } catch (e) {}

    stopSpeechNarration();
    stopSlideshowAutoplay();
    updatePptLockUI();
    showToast('🔒 已重新鎖定 PPT 投影片內容。');
  }

  function updatePptLockUI() {
    const unlocked = isPptUnlocked();
    document.body.classList.toggle('ppt-unlocked', !!unlocked);

    // 1. Update Header Badge
    if (els.pptAuthStatusBtn && els.pptAuthStatusText) {
      if (unlocked) {
        els.pptAuthStatusBtn.className = 'ppt-auth-status-btn unlocked';
        els.pptAuthStatusBtn.innerHTML = `<i class="fa-solid fa-unlock"></i> <span>PPT 已解鎖</span> <button type="button" class="relock-link-btn" id="btnRelockPpt" title="重新上鎖">[上鎖]</button>`;
        const relockBtn = document.getElementById('btnRelockPpt');
        if (relockBtn) {
          relockBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            lockPptSystem();
          });
        }
      } else {
        els.pptAuthStatusBtn.className = 'ppt-auth-status-btn locked';
        els.pptAuthStatusBtn.innerHTML = `<i class="fa-solid fa-lock"></i> <span>PPT 版權保護中</span>`;
      }
    }

    // 2. Toggle Slide Deck & Lock Gate
    if (els.pptLockGate && els.slideDeckContainer) {
      if (unlocked) {
        els.pptLockGate.style.display = 'none';
        els.slideDeckContainer.style.display = 'block';
      } else {
        els.pptLockGate.style.display = 'block';
        els.slideDeckContainer.style.display = 'none';
      }
    }

    // 3. Update download buttons
    const pptInfo = getPptFileInfo(state.quarter, state.lessonNum);
    if (els.heroDownloadPptBtn) {
      if (!unlocked) {
        els.heroDownloadPptBtn.removeAttribute('download');
      } else {
        els.heroDownloadPptBtn.setAttribute('download', pptInfo.fileName);
      }
    }
  }

  function openPptAuthModal(actionMsg, actionCallback) {
    if (isPptUnlocked()) {
      if (typeof actionCallback === 'function') actionCallback();
      return;
    }

    pendingAuthAction = actionCallback || null;
    if (els.pptAuthModal) {
      els.pptAuthModal.classList.remove('hidden');
      if (els.modalPptPasswordInput) {
        els.modalPptPasswordInput.value = '';
        setTimeout(() => els.modalPptPasswordInput.focus(), 150);
      }
      if (els.modalPptAuthError) {
        els.modalPptAuthError.classList.add('hidden');
        els.modalPptAuthError.textContent = '';
      }
    }
  }

  function closePptAuthModal() {
    if (els.pptAuthModal) {
      els.pptAuthModal.classList.add('hidden');
    }
  }

  // ==========================================================================
  // AI Visual Diagrams & Infographics Renderer (26 Lessons)
  // ==========================================================================

  function renderAiDiagramsTab(lessonId) {
    if (!window.SS_AI_DIAGRAMS_DATA) return;
    const lId = lessonId || (state.currentLesson ? state.currentLesson.id : '2026-q3-01');
    const data = window.SS_AI_DIAGRAMS_DATA[lId];
    if (!data) return;

    // 1. Banner
    if (els.aiBannerSymbol) {
      els.aiBannerSymbol.innerHTML = data.svg_icon || '<i class="fa-solid fa-chart-pie text-gold" style="font-size:2rem;"></i>';
    }
    if (els.aiBannerTitle) {
      els.aiBannerTitle.textContent = `第 ${data.lesson_num} 課：${data.title} · ${data.symbol_title}`;
    }
    if (els.aiBannerSubtitle) {
      els.aiBannerSubtitle.textContent = data.symbol_desc;
    }

    // 2. Story Arc & Narrative Mind Map
    if (els.aiMindmapTheme) {
      els.aiMindmapTheme.textContent = data.story_theme;
    }
    if (els.aiMindmapRoadmap) {
      els.aiMindmapRoadmap.innerHTML = data.story_nodes.map(node => `
        <div class="mindmap-node-card" style="border-top: 4px solid ${node.color};">
          <div class="node-top-bar">
            <span class="node-step-pill" style="background:${node.color};">階段 ${node.step}</span>
            <span class="node-phase-tag">${node.phase} · ${node.tag}</span>
          </div>
          <h5 class="node-title-text"><i class="fa-solid ${node.icon}" style="color:${node.color};"></i> ${node.title}</h5>
          <p class="node-desc-text">${node.desc}</p>
        </div>
      `).join('');
    }

    // 3. Theological Contrast Matrix
    if (els.aiTheologyContainer) {
      els.aiTheologyContainer.innerHTML = `
        <div class="theology-contrast-grid">
          <div class="contrast-side-card contrast-left">
            <div class="contrast-card-header"><i class="fa-solid fa-triangle-exclamation"></i> ${data.contrast_left_title}</div>
            <ul class="contrast-points-list">
              ${data.contrast_left_points.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
          <div class="contrast-side-card contrast-right">
            <div class="contrast-card-header"><i class="fa-solid fa-circle-check"></i> ${data.contrast_right_title}</div>
            <ul class="contrast-points-list">
              ${data.contrast_right_points.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="theology-christ-banner">
          <i class="fa-solid fa-cross text-danger"></i> <strong>基督中心福音透鏡 (Christ-Centered Reflection)：</strong>
          ${data.christ_lens}
        </div>
        <div class="theology-life-app-banner">
          <i class="fa-solid fa-seedling text-success"></i> <strong>兒童本週生活實踐挑戰：</strong>
          ${data.life_app}
        </div>
      `;
    }

    // 4. Pacing Infographic
    if (els.aiPacingBar) {
      els.aiPacingBar.innerHTML = data.pacing_infographic.map(p => `
        <div class="pacing-phase-card">
          <div>
            <span class="pacing-time-badge">${p.time}</span>
            <div class="pacing-phase-title">${p.phase} · ${p.name}</div>
            <div class="pacing-goal-text">${p.goal}</div>
          </div>
          <div class="energy-meter-box">
            <div class="energy-meter-label">
              <span>${p.type}</span>
              <span>能量 ${p.energy}%</span>
            </div>
            <div class="energy-meter-track">
              <div class="energy-meter-fill" style="width: ${p.energy}%;"></div>
            </div>
          </div>
        </div>
      `).join('');
    }

    // 5. Verse Tree
    if (els.aiVerseTreeContainer && data.verse_tree) {
      const vt = data.verse_tree;
      els.aiVerseTreeContainer.innerHTML = `
        <div class="verse-tree-card-item" style="border-left-color: #b88628;">
          <span class="verse-tree-badge">🌱 ${vt.root.label}</span>
          <div class="verse-tree-content">${vt.root.text}</div>
        </div>
        <div class="verse-tree-card-item" style="border-left-color: #2563eb;">
          <span class="verse-tree-badge">🪵 ${vt.trunk.label}</span>
          <div class="verse-tree-content">${vt.trunk.text}</div>
        </div>
        <div class="verse-tree-card-item" style="border-left-color: #16a34a;">
          <span class="verse-tree-badge">🌿 ${vt.branches.label}</span>
          <div class="verse-tree-content">${vt.branches.text}</div>
        </div>
        <div class="verse-tree-card-item" style="border-left-color: #d97706;">
          <span class="verse-tree-badge">🍎 ${vt.fruits.label}</span>
          <div class="verse-tree-content">${vt.fruits.text}</div>
        </div>
      `;
    }
  }

  // ==========================================================================
  // Five Auxiliary Teaching Materials Renderer (Index Page Integration)
  // ==========================================================================

  function renderAuxiliaryMaterialsTab(lesson) {
    if (!lesson || !lesson.auxiliary_materials) return;
    const aux = lesson.auxiliary_materials;

    // 1. Drama Script
    if (aux.drama_script && els.auxDramaBody) {
      const d = aux.drama_script;
      if (els.auxDramaTitle) els.auxDramaTitle.textContent = `《${d.title || lesson.title}》· 登場角色：${(d.characters || []).join('、')}`;
      els.auxDramaBody.innerHTML = (d.scenes || []).map((sc, idx) => `
        <div class="drama-scene-box">
          <div class="drama-scene-title">第 ${idx + 1} 幕：${sc.scene_title || '場景'}</div>
          ${sc.description ? `<div class="drama-desc">${sc.description}</div>` : ''}
          <div class="drama-dialogue">${sc.dialogue || ''}</div>
        </div>
      `).join('');
    }

    // 2. Family Connection Card
    if (aux.family_card && els.auxFamilyBody) {
      const fc = aux.family_card;
      els.auxFamilyBody.innerHTML = `
        <div class="family-section">
          <div class="family-title"><i class="fa-solid fa-utensils"></i> 餐桌信仰話題（Dining Talk）：</div>
          <div class="family-content">${fc.dinner_topic || '分享今天主日學最有感觸的一句話。'}</div>
        </div>
        <div class="family-section">
          <div class="family-title"><i class="fa-solid fa-hands-praying"></i> 全家同心晚禱詞（Family Prayer）：</div>
          <div class="family-content">${fc.family_prayer || '親愛的天父，感謝祢在我們家中作主。'}</div>
        </div>
      `;
    }

    // 3. Hebrew / Greek Micro-Lesson
    if (aux.hebrew_greek && els.auxHebrewBody) {
      const hg = aux.hebrew_greek;
      if (els.auxHebrewTitle) els.auxHebrewTitle.textContent = `${hg.word}（${hg.transliteration}）· ${hg.meaning}`;
      els.auxHebrewBody.innerHTML = `
        <div class="hebrew-word-card">
          <div class="hebrew-original">${hg.word}</div>
          <div class="hebrew-translit">${hg.language || '原文'}：${hg.transliteration}</div>
          <div class="hebrew-meaning"><strong>核心字義：</strong>${hg.meaning}</div>
          <div style="margin-top:8px;font-size:0.86rem;line-height:1.6;color:var(--text-main);">${hg.devotional_note || ''}</div>
        </div>
      `;
    }

    // 4. Classroom SOP
    if (aux.classroom_sop && els.auxSopBody) {
      const sop = aux.classroom_sop;
      if (els.auxSopTitle) els.auxSopTitle.textContent = `針對【${sop.scenario || '課堂秩序'}】之專業應變 SOP`;
      els.auxSopBody.innerHTML = `
        <div class="sop-item">
          <div class="sop-scenario">🚨 突發情境：${sop.scenario || ''}</div>
          <div class="sop-solution"><strong>應變三部曲：</strong>${sop.action_steps ? sop.action_steps.join(' ➔ ') : sop.solution || ''}</div>
        </div>
      `;
    }

    // 5. Child FAQ
    if (aux.child_faq && els.auxFaqBody) {
      const faq = aux.child_faq;
      if (els.auxFaqTitle) els.auxFaqTitle.textContent = '傳道人深層信仰對話錄';
      els.auxFaqBody.innerHTML = `
        <div class="faq-item">
          <div class="faq-q">❓ 孩子的尖銳提問：${faq.question}</div>
          <div class="faq-a">💡 傳道人引導回應：${faq.answer}</div>
        </div>
      `;
    }
  }

    function switchToPptTab() {
    if (!isPptUnlocked()) {
      state.activeTab = 'tab-slides';
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.target === 'tab-slides');
      });
      document.querySelectorAll('.tab-pane').forEach(p => {
        p.classList.toggle('active', p.id === 'tab-slides');
      });
      updatePptLockUI();
      const target = document.getElementById('tab-slides');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    state.activeTab = 'tab-slides';
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.target === 'tab-slides');
    });
    document.querySelectorAll('.tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === 'tab-slides');
    });
    renderSlideDeck();
    const target = document.getElementById('tab-slides');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // PPT Catalog Modal Operations
  function openPptCatalogModal(quarter) {
    if (!els.pptCatalogModal) return;
    els.pptCatalogModal.classList.remove('hidden');
    renderPptCatalogCards(quarter || state.quarter || '2026-Q3');
  }

  function closePptCatalogModal() {
    if (!els.pptCatalogModal) return;
    els.pptCatalogModal.classList.add('hidden');
  }

  function renderPptCatalogCards(quarter = '2026-Q3') {
    if (!els.pptCatalogBody || !window.CURRICULUM_DATA) return;
    const slidesData = window.SLIDES_DATA || window.SS_SLIDES_DATA || {};
    const lessons = window.CURRICULUM_DATA.filter(l => l.quarter === quarter);

    if (els.pptTabQ3) els.pptTabQ3.classList.toggle('active', quarter === '2026-Q3');
    if (els.pptTabQ4) els.pptTabQ4.classList.toggle('active', quarter === '2026-Q4');

    els.pptCatalogBody.innerHTML = '';
    lessons.forEach(l => {
      const lessonSlides = (slidesData[l.id] && slidesData[l.id].slides) ? slidesData[l.id].slides : [];
      const count = lessonSlides.length || 15;
      const firstSlideImg = (lessonSlides[0] && lessonSlides[0].image) ? lessonSlides[0].image : `assets/lessons/${l.id}/slide_01.jpg`;
      const pptInfo = getPptFileInfo(l.quarter, l.lesson_num);

      const card = document.createElement('div');
      card.className = 'ppt-cat-card';
      const isLocked = !isPptUnlocked();
      card.innerHTML = `
        <div class="ppt-cat-thumb ${isLocked ? 'locked-thumb' : ''}">
          <img src="${isLocked ? '' : firstSlideImg}" alt="${l.title}" loading="lazy" style="${isLocked ? 'display:none;' : ''}">
          <span class="ppt-cat-badge">第 ${l.lesson_num} 課 · ${count} 頁</span>
        </div>
        <div class="ppt-cat-content">
          <div class="ppt-cat-meta">
            <span class="ppt-cat-filename"><i class="fa-solid fa-file-powerpoint text-danger"></i> ${pptInfo.fileName}</span>
          </div>
          <h3 class="ppt-cat-title">第 ${l.lesson_num} 課：${l.title}</h3>
          <p class="ppt-cat-subtitle">${l.subtitle || ''}</p>
          <p class="ppt-cat-scripture"><i class="fa-solid fa-book-bible text-gold"></i> ${l.scripture || ''}</p>
          <div class="ppt-cat-actions">
            <button class="ppt-action-btn ppt-btn-play" type="button" title="在此頁播放投影片"><i class="fa-solid fa-play"></i> 立即播放</button>
            <button class="ppt-action-btn ppt-btn-present" type="button" title="全螢幕投影演講模式"><i class="fa-solid fa-desktop"></i> 投影模式</button>
            <a class="ppt-action-btn ppt-btn-dl" href="${isLocked ? 'javascript:void(0)' : pptInfo.downloadUrl}" ${isLocked ? '' : 'download'} title="下載原檔 PPTX"><i class="fa-solid fa-download"></i> 下載 PPTX</a>
            <a class="ppt-action-btn ppt-btn-page" href="lessons/${l.id}.html" target="_blank" title="開啟獨立專屬教學頁面"><i class="fa-solid fa-arrow-up-right-from-square"></i> 專屬頁</a>
          </div>
        </div>
      `;

      // Button clicks
      const playBtn = card.querySelector('.ppt-btn-play');
      playBtn.addEventListener('click', () => {
        if (!isPptUnlocked()) {
          openPptAuthModal('請輸入授權通行密碼「WOLSS」以播放本課 PPT', () => {
            switchLessonById(l.id);
            closePptCatalogModal();
            switchToPptTab();
          });
          return;
        }
        switchLessonById(l.id);
        closePptCatalogModal();
        switchToPptTab();
      });

      const presentBtn = card.querySelector('.ppt-btn-present');
      presentBtn.addEventListener('click', () => {
        if (!isPptUnlocked()) {
          openPptAuthModal('請輸入授權通行密碼「WOLSS」以全螢幕投影演講', () => {
            switchLessonById(l.id);
            closePptCatalogModal();
            setTimeout(() => {
              openPresentationMode();
            }, 120);
          });
          return;
        }
        switchLessonById(l.id);
        closePptCatalogModal();
        setTimeout(() => {
          openPresentationMode();
        }, 120);
      });

      const dlBtn = card.querySelector('.ppt-btn-dl');
      if (dlBtn) {
        dlBtn.addEventListener('click', (e) => {
          if (!isPptUnlocked()) {
            e.preventDefault();
            openPptAuthModal('請輸入授權通行密碼「WOLSS」以下載本課 PPTX 簡報');
          }
        });
      }

      els.pptCatalogBody.appendChild(card);
    });
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

            if (targetId === 'tab-slides') {
        if (!isPptUnlocked()) {
          updatePptLockUI();
        } else {
          renderSlideDeck();
        }
      } else if (targetId === 'tab-ai-diagrams') {
        renderAiDiagramsTab(state.currentLesson ? state.currentLesson.id : '2026-q3-01');
      } else if (targetId === 'tab-aux-lib') {
        renderAuxiliaryMaterialsTab(state.currentLesson);
      }
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
    if (els.btnTheaterMode) els.btnTheaterMode.addEventListener('click', toggleTheaterMode);
    if (els.btnSlideFullscreen) els.btnSlideFullscreen.addEventListener('click', openPresentationMode);
    if (els.fallbackRetryBtn) {
      els.fallbackRetryBtn.addEventListener('click', () => {
        setSlide(state.slideIndex || 1, 'none');
      });
    }

    // Mobile Slide Bar Buttons
    if (els.mBtnSlidePrev) els.mBtnSlidePrev.addEventListener('click', prevSlide);
    if (els.mBtnSlideNext) els.mBtnSlideNext.addEventListener('click', nextSlide);
    if (els.mBtnSlideSpeak) els.mBtnSlideSpeak.addEventListener('click', toggleSpeechNarration);
    if (els.mBtnSlideFullscreen) els.mBtnSlideFullscreen.addEventListener('click', openPresentationMode);

    // Touch Swipe Gestures for Mobile
    let touchStartX = 0;
    let touchStartY = 0;
    if (els.slideStageMain) {
      els.slideStageMain.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      els.slideStageMain.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches.length === 1) {
          const deltaX = e.changedTouches[0].clientX - touchStartX;
          const deltaY = e.changedTouches[0].clientY - touchStartY;
          if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) nextSlide();
            else prevSlide();
          }
        }
      }, { passive: true });
    }

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

    // Hero PPT Play & Present Buttons
    if (els.heroPlayPptBtn) els.heroPlayPptBtn.addEventListener('click', switchToPptTab);
    if (els.heroPresentPptBtn) els.heroPresentPptBtn.addEventListener('click', openPresentationMode);

    // PPT Switcher & Toolbar Presentation
    if (els.pptLessonSwitcher) {
      els.pptLessonSwitcher.addEventListener('change', (e) => switchLessonById(e.target.value));
    }
    if (els.btnToolbarPresent) els.btnToolbarPresent.addEventListener('click', openPresentationMode);

    // PPT Catalog Modal
    if (els.btnPptCatalogModal) {
      els.btnPptCatalogModal.addEventListener('click', () => openPptCatalogModal(state.quarter));
    }
    if (els.closePptModalBtn) els.closePptModalBtn.addEventListener('click', closePptCatalogModal);
    if (els.closePptModalBtn2) els.closePptModalBtn2.addEventListener('click', closePptCatalogModal);
    if (els.closePptModalBackdrop) els.closePptModalBackdrop.addEventListener('click', closePptCatalogModal);
    if (els.pptTabQ3) els.pptTabQ3.addEventListener('click', () => renderPptCatalogCards('2026-Q3'));
    if (els.pptTabQ4) els.pptTabQ4.addEventListener('click', () => renderPptCatalogCards('2026-Q4'));

    
    // PPT Password Protection & Auth Handlers
    if (els.pptAuthStatusBtn) {
      els.pptAuthStatusBtn.addEventListener('click', () => {
        if (!isPptUnlocked()) {
          openPptAuthModal('請輸入通行密碼以解鎖 PPT 內容');
        }
      });
    }

    if (els.closePptAuthModalBtn) els.closePptAuthModalBtn.addEventListener('click', closePptAuthModal);
    if (els.closePptAuthModalBackdrop) els.closePptAuthModalBackdrop.addEventListener('click', closePptAuthModal);

    // Modal Auth Form
    if (els.pptAuthModalForm) {
      els.pptAuthModalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = els.modalPptPasswordInput ? els.modalPptPasswordInput.value : '';
        if (verifyPptPassword(val)) {
          unlockPptSystem();
        } else {
          if (els.modalPptAuthError) {
            els.modalPptAuthError.textContent = '❌ 通行密碼錯誤，請輸入授權密碼 WOLSS';
            els.modalPptAuthError.classList.remove('hidden');
          }
        }
      });
    }

    if (els.modalToggleEyeBtn && els.modalPptPasswordInput) {
      els.modalToggleEyeBtn.addEventListener('click', () => {
        const isPass = els.modalPptPasswordInput.type === 'password';
        els.modalPptPasswordInput.type = isPass ? 'text' : 'password';
        els.modalToggleEyeBtn.innerHTML = isPass ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
      });
    }

    // Inline Auth Form in #tab-slides
    if (els.pptInlineAuthForm) {
      els.pptInlineAuthForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = els.inlinePptPasswordInput ? els.inlinePptPasswordInput.value : '';
        if (verifyPptPassword(val)) {
          unlockPptSystem();
        } else {
          if (els.inlinePptAuthError) {
            els.inlinePptAuthError.textContent = '❌ 通行密碼錯誤，請輸入授權密碼 WOLSS';
            els.inlinePptAuthError.classList.remove('hidden');
          }
        }
      });
    }

    if (els.inlineToggleEyeBtn && els.inlinePptPasswordInput) {
      els.inlineToggleEyeBtn.addEventListener('click', () => {
        const isPass = els.inlinePptPasswordInput.type === 'password';
        els.inlinePptPasswordInput.type = isPass ? 'text' : 'password';
        els.inlineToggleEyeBtn.innerHTML = isPass ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
      });
    }

    // Intercept Download Buttons
    if (els.heroDownloadPptBtn) {
      els.heroDownloadPptBtn.addEventListener('click', (e) => {
        if (!isPptUnlocked()) {
          e.preventDefault();
          openPptAuthModal('請先輸入通行密碼 WOLSS 以下載本課 PPTX 原檔', () => {
            const pptInfo = getPptFileInfo(state.quarter, state.lessonNum);
            window.location.href = pptInfo.downloadUrl;
          });
        }
      });
    }

    if (els.slideDownloadPptxBtn) {
      els.slideDownloadPptxBtn.addEventListener('click', (e) => {
        if (!isPptUnlocked()) {
          e.preventDefault();
          openPptAuthModal('請先輸入通行密碼 WOLSS 以下載本課 PPTX 原檔', () => {
            const pptInfo = getPptFileInfo(state.quarter, state.lessonNum);
            window.location.href = pptInfo.downloadUrl;
          });
        }
      });
    }

    // Print AI Diagrams
    if (els.btnPrintAiDiagrams) {
      els.btnPrintAiDiagrams.addEventListener('click', () => {
        window.print();
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
    if (els.presentAutoplayBtn) els.presentAutoplayBtn.addEventListener('click', toggleSlideshowAutoplay);
    if (els.presentSpeakBtn) els.presentSpeakBtn.addEventListener('click', toggleSpeechNarration);

    // Global & Modal Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      const catalogOpen = els.pptCatalogModal && !els.pptCatalogModal.classList.contains('hidden');
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

      if (catalogOpen) {
        if (e.key === 'Escape') {
          closePptCatalogModal();
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
        } else if (e.key === 'p' || e.key === 'P') {
          toggleSlideshowAutoplay();
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
        } else if (e.key === 't' || e.key === 'T') {
          e.preventDefault();
          toggleTheaterMode();
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
    try {
      if (els.heroQuarter) els.heroQuarter.textContent = lesson.quarter;
      if (els.heroNum) els.heroNum.textContent = `第 ${lesson.lesson_num} 課`;
      if (els.heroScripture) els.heroScripture.textContent = lesson.scripture || '聖經經文信息';
      if (els.heroTitle) els.heroTitle.textContent = lesson.title;
      if (els.heroSubtitle) els.heroSubtitle.textContent = lesson.subtitle || lesson.quarter_title;

      // PPT Source & Download Links Update
      const pptInfo = getPptFileInfo(lesson.quarter, lesson.lesson_num);
      if (els.heroDownloadPptBtn) {
        els.heroDownloadPptBtn.href = pptInfo.downloadUrl;
        els.heroDownloadPptBtn.setAttribute('download', pptInfo.fileName);
      }
      if (els.heroPptSource) {
        els.heroPptSource.innerHTML = `<i class="fa-regular fa-folder-open"></i> 檔案：${pptInfo.displayPath}`;
      }
      if (els.pptFileNameText) {
        els.pptFileNameText.textContent = pptInfo.displayPath;
      }
      if (els.slideDownloadPptxBtn) {
        els.slideDownloadPptxBtn.href = pptInfo.downloadUrl;
        els.slideDownloadPptxBtn.setAttribute('download', pptInfo.fileName);
      }
      if (els.pptLessonSwitcher) {
        els.pptLessonSwitcher.value = lesson.id;
      }
      if (els.presenterFileName) {
        els.presenterFileName.textContent = pptInfo.displayPath;
      }
      if (els.presenterDlBtn) {
        els.presenterDlBtn.href = pptInfo.downloadUrl;
        els.presenterDlBtn.setAttribute('download', pptInfo.fileName);
      }
    } catch (e) {
      console.warn('Error in hero populate:', e);
    }

    // 2. Verse Gym
    try { renderVerseGym(); } catch (e) { console.warn('Error in renderVerseGym:', e); }

    // 3. Expert Team
    try { renderExpertTeam(lesson.expert_insights); } catch (e) { console.warn('Error in renderExpertTeam:', e); }

    // 4. Story Acts
    try { renderStoryActs(lesson.story); } catch (e) { console.warn('Error in renderStoryActs:', e); }

    // 5. Hymns & Games
    try { renderHymnsAndGames(lesson.hymn, lesson.games); } catch (e) { console.warn('Error in renderHymnsAndGames:', e); }

    // 6. Truths & Applications
    try { renderTruthsAndApps(lesson.life_lessons, lesson.life_apps, lesson.conclusion); } catch (e) { console.warn('Error in renderTruthsAndApps:', e); }

    // 7. Crafts
    try { renderCrafts(lesson.crafts); } catch (e) { console.warn('Error in renderCrafts:', e); }

    // 8. Quizzes
    try { renderQuizzes(lesson.quiz_lower, lesson.quiz_upper); } catch (e) { console.warn('Error in renderQuizzes:', e); }

    // 9. Prayer
    try {
      if (els.prayerDisplay) els.prayerDisplay.textContent = lesson.prayer || '親愛的天父，感謝你透過本課的話語教導我們。奉主耶穌的名求，阿們！';
    } catch (e) { console.warn('Error setting prayer:', e); }

        // 10. Load Teacher Notes
    try { loadTeacherNotes(); } catch (e) { console.warn('Error in loadTeacherNotes:', e); }

    // 10.1 Render AI Diagrams & Auxiliary Library
    try { renderAiDiagramsTab(lesson.id); } catch (e) { console.warn('Error in renderAiDiagramsTab:', e); }
    try { renderAuxiliaryMaterialsTab(lesson); } catch (e) { console.warn('Error in renderAuxiliaryMaterialsTab:', e); }
    try { updatePptLockUI(); } catch (e) {}

    // 11. Render Slide Deck Presentation Cockpit (BlessEq architecture)
    state.slideIndex = 1;
    try { stopSpeechNarration(); } catch (e) {}
    try { stopSlideshowAutoplay(); } catch (e) {}
    try { renderSlideDeck(); } catch (e) { console.error('Error in renderSlideDeck:', e); }

    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {}
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
      <div class="five-e-roadmap">
        <div class="five-e-card-item">
          <span class="five-e-badge-pill badge-e-engage">🎯 1. Engage 吸引</span>
          <div class="five-e-content-text">${ed.five_e.engage}</div>
        </div>
        <div class="five-e-card-item">
          <span class="five-e-badge-pill badge-e-explore">🔍 2. Explore 探索</span>
          <div class="five-e-content-text">${ed.five_e.explore}</div>
        </div>
        <div class="five-e-card-item">
          <span class="five-e-badge-pill badge-e-explain">💡 3. Explain 解釋</span>
          <div class="five-e-content-text">${ed.five_e.explain}</div>
        </div>
        <div class="five-e-card-item">
          <span class="five-e-badge-pill badge-e-elaborate">🌱 4. Elaborate 延伸</span>
          <div class="five-e-content-text">${ed.five_e.elaborate}</div>
        </div>
        <div class="five-e-card-item">
          <span class="five-e-badge-pill badge-e-evaluate">📝 5. Evaluate 評鑑</span>
          <div class="five-e-content-text">${ed.five_e.evaluate}</div>
        </div>
      </div>
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
          <div class="quiz-feedback" id="feedback-${qIdx}" data-explanation="${encodeURIComponent(q.explanation || '')}">
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
      els.upperQuizList.innerHTML = upperList.map((qText, idx) => {
        let badgeHtml = '';
        let displayText = qText;
        if (typeof qText === 'string' && qText.startsWith('【') && qText.includes('】')) {
          const parts = qText.split('】');
          const cat = parts[0].replace('【', '');
          badgeHtml = `<span class="badge" style="background: #e0f2fe; color: #0369a1; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; margin-right: 6px;">${cat}</span>`;
          displayText = parts.slice(1).join('】');
        }
        return `
        <div class="discussion-card">
          <div class="discussion-q">Q${idx + 1}：${badgeHtml}${displayText}</div>
          <div class="teacher-tip">💡 教師引導小訣竅：鼓勵孩子連結個人生活故事，接納任何分享，不給標準答案！</div>
        </div>
      `;
      }).join('');
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
    const expl = decodeURIComponent(fb.dataset.explanation || '');

    if (isCorrect) {
      btn.classList.add('selected-correct');
      fb.className = 'quiz-feedback show correct';
      fb.innerHTML = `🎉 <strong>答對了！太棒了！</strong><div style="margin-top:6px;font-size:0.92rem;line-height:1.6;">${expl}</div>`;
      playChime(true);
    } else {
      btn.classList.add('selected-wrong');
      fb.className = 'quiz-feedback show wrong';
      fb.innerHTML = `🤔 <strong>再想想看喔！</strong> 正確答案是 (${targetAns})。<div style="margin-top:6px;font-size:0.92rem;line-height:1.6;color:#6b7280;"><strong>💡 真理解析：</strong>${expl}</div>`;
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
    try {
      const saved = (typeof localStorage !== 'undefined' && localStorage) ? localStorage.getItem(getNoteKey()) || '' : '';
      if (els.teacherNotesInput) els.teacherNotesInput.value = saved;
      if (els.saveStatusMsg) els.saveStatusMsg.textContent = saved ? '已從本機載入' : '尚未有筆記';
    } catch (e) {
      console.warn('localStorage read unavailable:', e);
      if (els.saveStatusMsg) els.saveStatusMsg.textContent = '本機筆記暫不可用';
    }
  }

  function saveTeacherNotes() {
    try {
      const val = els.teacherNotesInput ? els.teacherNotesInput.value : '';
      if (typeof localStorage !== 'undefined' && localStorage) {
        localStorage.setItem(getNoteKey(), val);
      }
      if (els.saveStatusMsg) els.saveStatusMsg.textContent = '已自動儲存於 ' + new Date().toLocaleTimeString();
    } catch (e) {
      console.warn('localStorage write unavailable:', e);
      if (els.saveStatusMsg) els.saveStatusMsg.textContent = '本機存儲無法寫入';
    }
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
    const slidesData = window.SLIDES_DATA || window.SS_SLIDES_DATA;
    if (slidesData && slidesData[lessonId] && slidesData[lessonId].slides && slidesData[lessonId].slides.length) {
      return slidesData[lessonId].slides;
    }

    // Defensive fallback: construct standard slide items pointing directly to images on disk
    const count = 15;
    const fallbacks = [];
    for (let i = 1; i <= count; i++) {
      const pad = String(i).padStart(2, '0');
      fallbacks.push({
        slideIndex: i,
        badge: `投影片 #${i}`,
        image: `assets/lessons/${lessonId}/slide_${pad}.jpg`,
        alt: `${state.currentLesson.title || '投影片'} - 第 ${i} 頁`,
        title: `${state.currentLesson.title || '投影片'} (第 ${i} 頁)`,
        timing: '⏱️ 建議停留：2-3 分鐘',
        teacherScript: '請引導孩子們觀看投影片，分享上帝的恩典與真理話語。',
        studentPrompt: '提問孩子們對於這頁內容的想法與生活感受。',
        rawText: state.currentLesson.subtitle || state.currentLesson.title || ''
      });
    }
    return fallbacks;
  }

  function renderSlideDeck() {
    if (!isPptUnlocked()) {
      updatePptLockUI();
      return;
    }
    const slides = getCurrentLessonSlides();
    if (!slides || !slides.length) return;

    if (els.slideDeckInfo) {
      els.slideDeckInfo.textContent = `本課共 ${slides.length} 頁高畫質投影片`;
    }
    if (els.totalSlideNum) {
      els.totalSlideNum.textContent = slides.length;
    }
    if (els.mTotalSlide) {
      els.mTotalSlide.textContent = slides.length;
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
    if (els.mCurrentSlide) els.mCurrentSlide.textContent = idx;
    if (els.mTotalSlide) els.mTotalSlide.textContent = slides.length;

    // Prev / Next button states
    if (els.btnSlidePrev) els.btnSlidePrev.disabled = idx === 1;
    if (els.btnSlideNext) els.btnSlideNext.disabled = idx === slides.length;
    if (els.mBtnSlidePrev) els.mBtnSlidePrev.disabled = idx === 1;
    if (els.mBtnSlideNext) els.mBtnSlideNext.disabled = idx === slides.length;
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
        if (els.slideStageLoader) els.slideStageLoader.style.display = 'flex';
        img.style.display = 'block';
        if (els.slideTextFallback) els.slideTextFallback.style.display = 'none';

        img.onload = () => {
          if (els.slideStageLoader) els.slideStageLoader.style.display = 'none';
        };
        img.onerror = () => {
          if (els.slideStageLoader) els.slideStageLoader.style.display = 'none';
          img.style.display = 'none';
          if (els.slideTextFallback) {
            els.slideTextFallback.style.display = 'block';
            if (els.fallbackTitle) els.fallbackTitle.textContent = slide.title || `投影片 #${idx}`;
            if (els.fallbackSnippet) els.fallbackSnippet.textContent = slide.rawText || '投影片圖片讀取稍候中，此處為重點經文與課堂要點';
          }
        };

        img.src = slide.image;
        img.alt = slide.alt || slide.title || `投影片 #${idx}`;

        if (img.complete && img.naturalWidth > 0) {
          if (els.slideStageLoader) els.slideStageLoader.style.display = 'none';
        }
      } else {
        if (els.slideStageLoader) els.slideStageLoader.style.display = 'none';
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
    try {
      if (typeof Image !== 'undefined') {
        [idx - 1, idx + 1, idx + 2].forEach(i => {
          if (i >= 1 && i <= slides.length && slides[i - 1] && slides[i - 1].image) {
            const pImg = new Image();
            pImg.src = slides[i - 1].image;
          }
        });
      }
    } catch (e) {}
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

      const fallbackSpan = document.createElement('div');
      fallbackSpan.style.cssText = 'display:none;align-items:center;justify-content:center;height:100%;font-size:0.65rem;color:#fbbf24;text-align:center;padding:2px;background:#27272a;';
      fallbackSpan.textContent = '重點頁';

      if (slide.image) {
        const img = document.createElement('img');
        img.src = slide.image;
        img.alt = '';
        img.loading = 'lazy';
        img.onerror = () => {
          img.style.display = 'none';
          fallbackSpan.style.display = 'flex';
        };
        thumb.appendChild(img);
        thumb.appendChild(fallbackSpan);
      } else {
        fallbackSpan.style.display = 'flex';
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
        requestAnimationFrame(() => {
          try {
            t.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          } catch(e) {}
        });
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

  // Theater Mode (16:9 巨幕劇院模式)
  function toggleTheaterMode() {
    const dualPane = document.querySelector('.slide-dual-pane');
    if (!dualPane) return;
    state.isTheaterMode = !state.isTheaterMode;
    dualPane.classList.toggle('theater-mode', state.isTheaterMode);
    if (els.btnTheaterMode) {
      els.btnTheaterMode.classList.toggle('active', state.isTheaterMode);
      els.btnTheaterMode.title = state.isTheaterMode ? '還原雙欄駕駛艙 (T 鍵)' : '劇院巨幕模式 (T 鍵)';
    }
    showToast(state.isTheaterMode ? '已開啟 16:9 劇院巨幕模式！' : '已還原標準雙欄駕駛艙', 'fa-film');
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
    if (els.mAudioIcon) {
      els.mAudioIcon.className = 'fa-solid fa-pause';
    }
    if (els.mBtnSlideSpeak) {
      els.mBtnSlideSpeak.classList.add('speaking');
    }
    if (els.presentSpeakBtn) {
      els.presentSpeakBtn.classList.add('speaking');
    }
    if (els.presentSpeakIcon) {
      els.presentSpeakIcon.className = 'fa-solid fa-pause';
    }
    if (els.presentSpeakText) {
      els.presentSpeakText.textContent = '暫停朗讀';
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
      if (els.mAudioIcon) els.mAudioIcon.className = 'fa-solid fa-volume-high';
      if (els.mBtnSlideSpeak) els.mBtnSlideSpeak.classList.remove('speaking');
      if (els.presentSpeakBtn) els.presentSpeakBtn.classList.remove('speaking');
      if (els.presentSpeakIcon) els.presentSpeakIcon.className = 'fa-solid fa-volume-high';
      if (els.presentSpeakText) els.presentSpeakText.textContent = '朗讀講稿';

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
      if (els.mAudioIcon) els.mAudioIcon.className = 'fa-solid fa-volume-high';
      if (els.mBtnSlideSpeak) els.mBtnSlideSpeak.classList.remove('speaking');
      if (els.presentSpeakBtn) els.presentSpeakBtn.classList.remove('speaking');
      if (els.presentSpeakIcon) els.presentSpeakIcon.className = 'fa-solid fa-volume-high';
      if (els.presentSpeakText) els.presentSpeakText.textContent = '朗讀講稿';
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
    if (els.presentAutoplayBtn) els.presentAutoplayBtn.classList.add('playing');
    if (els.presentAutoplayIcon) els.presentAutoplayIcon.className = 'fa-solid fa-pause';
    if (els.presentAutoplayText) els.presentAutoplayText.textContent = '暫停放映';

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
    if (els.presentAutoplayBtn) els.presentAutoplayBtn.classList.remove('playing');
    if (els.presentAutoplayIcon) els.presentAutoplayIcon.className = 'fa-solid fa-play';
    if (els.presentAutoplayText) els.presentAutoplayText.textContent = '自動播放';
    if (els.slideAutoplayProgress) {
      els.slideAutoplayProgress.style.transition = 'none';
      els.slideAutoplayProgress.style.width = '0%';
    }
  }

  // Presenter Fullscreen Cockpit
  function openPresentationMode() {
    if (!isPptUnlocked()) {
      openPptAuthModal('請先輸入通行密碼 WOLSS 以啟動大螢幕放映', openPresentationMode);
      return;
    }
    const l = state.currentLesson;
    if (!l) return;
    const slides = getCurrentLessonSlides();
    if (!slides.length) return;

    const pptInfo = getPptFileInfo(l.quarter, l.lesson_num);
    if (els.presentQuarterBadge) els.presentQuarterBadge.textContent = l.quarter;
    if (els.presentLessonBadge) els.presentLessonBadge.textContent = `第 ${l.lesson_num} 課`;
    if (els.presenterFileName) els.presenterFileName.textContent = pptInfo.displayPath;
    if (els.presenterDlBtn) {
      els.presenterDlBtn.href = pptInfo.downloadUrl;
      els.presenterDlBtn.setAttribute('download', pptInfo.fileName);
    }
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
        els.presenterImg.onerror = () => {
          els.presenterImg.style.display = 'none';
          if (els.presenterTextFallback) {
            els.presenterTextFallback.style.display = 'block';
            if (els.presenterFallbackTitle) els.presenterFallbackTitle.textContent = slide.title || `投影片 #${idx}`;
            if (els.presenterFallbackText) els.presenterFallbackText.textContent = slide.rawText || '投影片圖片讀取中，此處為重點經文與課堂要點';
          }
        };
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
      const appItem = (l.life_apps && l.life_apps.length) ? l.life_apps[0] : null;
      const appTitle = appItem ? appItem.title : '把真理活出來';
      const appPoints = (appItem && appItem.points && appItem.points.length)
        ? appItem.points.slice(0, 2).map(p => `<li>${p}</li>`).join('')
        : '<li>在學校和家中以愛心與誠實待人，做耶穌喜悅的小門徒</li>';

      els.printContainer.innerHTML = `
        <div class="print-page">
          <div class="print-header-banner">
            <div>
              <h1>【主日學學生學習單】${l.title}</h1>
              <p>2026 ${l.quarter} 第${l.lesson_num}課 · 經文進度：${l.scripture || ''}</p>
            </div>
            <div>
              <p>學生姓名：___________ 日期：___________</p>
            </div>
          </div>

          <div class="print-section">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h3 style="margin-top:0;">📖 本週核心背誦金句</h3>
                <p style="font-size: 13pt; font-weight: bold; margin: 6px 0 10px 0; line-height: 1.5; color: #111;">${l.verse}</p>
                <div style="font-size: 10pt; color: #444; display: flex; gap: 14px;">
                  <span>□ 我已熟讀經文</span>
                  <span>□ 我能正確說出出處</span>
                  <span>□ 我已通過背誦驗收</span>
                </div>
              </div>
              <div style="border: 2px dashed #444; border-radius: 8px; width: 140px; min-height: 64px; text-align: center; padding: 6px; font-size: 9.5pt; flex-shrink: 0; margin-left: 12px;">
                <div style="color: #666;">🎖️ 金句驗收戳章</div>
                <div style="margin-top: 14px; font-weight: bold; border-top: 1px solid #ccc; padding-top: 4px;">老師/家長簽章</div>
              </div>
            </div>
          </div>

          <div class="print-section">
            <h3>🎯 故事大冒險複習題（低年級挑戰）</h3>
            ${(l.quiz_lower || []).map((q, idx) => `
              <div style="margin-bottom: 12px;">
                <p><strong>${idx + 1}. ${q.question}</strong></p>
                <p style="margin-left: 16px; color: #333;">${q.options.join('   ')}</p>
              </div>
            `).join('')}
          </div>

          <div class="print-section">
            <h3>💬 心靈小問答（高年級深思與討論）</h3>
            ${(l.quiz_upper || []).slice(0, 3).map((q, idx) => `
              <div style="margin-bottom: 12px;">
                <p><strong>問 ${idx + 1}：${q}</strong></p>
                <div style="border-bottom: 1px dashed #888; height: 28px; margin-top: 4px;"></div>
              </div>
            `).join('')}
          </div>

          <div class="print-section">
            <h3>🌱 本週生活實踐挑戰：${appTitle}</h3>
            <ul style="margin: 6px 0 10px 22px; font-size: 10.5pt; color: #222; line-height: 1.6;">
              ${appPoints}
            </ul>
            <p style="font-size: 10pt; color: #555; margin: 8px 0 4px 0;">✍️ 本週我在家庭/學校要實踐的具體愛心行動：</p>
            <div style="border-bottom: 1px dashed #888; height: 26px; margin-top: 4px;"></div>
            <div style="border-bottom: 1px dashed #888; height: 26px; margin-top: 6px;"></div>
          </div>

          <div class="print-section" style="display: flex; justify-content: space-between; align-items: center; font-size: 9.5pt; color: #444; background: #fafafa; border: 1px solid #ccc; padding: 8px 14px;">
            <div>
              <strong>👨‍👩‍👧‍👦 家長溫馨叮嚀：</strong>歡迎家長每週撥出 5 分鐘陪伴孩子溫習經文，聆聽孩子分享本課心得，一同為校園生活祝福禱告！
            </div>
            <div style="white-space: nowrap; margin-left: 16px; border-left: 1px solid #ccc; padding-left: 12px; font-weight: bold;">
              家長簽名：___________
            </div>
          </div>
        </div>
      `;
    } else {
      // Teacher Prep
      const exp = l.expert_insights || {};
      const pacing = (exp.principal && exp.principal.pacing) ? exp.principal.pacing : [];
      const quickPrep = (exp.principal && exp.principal.quick_prep) ? exp.principal.quick_prep : [];
      const pastorFocus = (exp.pastor && exp.pastor.theological_focus) ? exp.pastor.theological_focus : (l.subtitle || '');
      const christLens = (exp.pastor && exp.pastor.christ_lens) ? exp.pastor.christ_lens : '';
      const hook = (exp.preacher && exp.preacher.storytelling_hook) ? exp.preacher.storytelling_hook : '';

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
            <h3>⏱️ 50分鐘課堂節奏配比（校長經驗指引）</h3>
            <ul>
              ${pacing.map(item => `<li><strong>${item.time} (${item.phase})：</strong>${item.focus}</li>`).join('')}
            </ul>
          </div>

          <div class="print-section">
            <h3>📋 課前 5 分鐘快速檢核與物資清單</h3>
            <ul>
              ${quickPrep.map(item => `<li>[  ] ${item}</li>`).join('')}
            </ul>
          </div>

          <div class="print-section">
            <h3>✝️ 神學核心與基督透鏡</h3>
            <p><strong>神學焦點：</strong>${pastorFocus}</p>
            ${christLens ? `<p><strong>福音連結：</strong>${christLens}</p>` : ''}
          </div>

          ${hook ? `
          <div class="print-section">
            <h3>🎣 課堂生動破題與開場白 (Hook)</h3>
            <p>${hook}</p>
          </div>` : ''}

          <div class="print-section">
            <h3>📖 聖經故事三大幕大綱</h3>
            ${(l.story || []).map((act, idx) => `<p><strong>第${idx+1}幕 (${act.title})：</strong>${act.paragraphs ? act.paragraphs[0] : ''}</p>`).join('')}
          </div>

          <div class="print-section">
            <h3>🙏 課堂同心結束禱告文</h3>
            <p>${l.prayer || '感謝主帶領今天的課堂，奉耶穌的名求，阿們！'}</p>
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

      if (lesson.title.toLowerCase().includes(q)) { score += 12; matchedIn = '課名'; }
      else if (lesson.subtitle.toLowerCase().includes(q)) { score += 9; matchedIn = '主題焦點'; }
      else if (lesson.scripture.toLowerCase().includes(q)) { score += 8; matchedIn = '聖經經文'; }
      else if (lesson.verse.toLowerCase().includes(q)) { score += 7; matchedIn = '背誦金句'; }
      else if (lesson.hymn && lesson.hymn.title.toLowerCase().includes(q)) { score += 6; matchedIn = '詩歌敬拜'; }
      else if (JSON.stringify(lesson.life_apps || []).toLowerCase().includes(q) || JSON.stringify(lesson.life_lessons || []).toLowerCase().includes(q)) { score += 5; matchedIn = '生活實踐挑戰'; }
      else if (JSON.stringify(lesson.games || []).toLowerCase().includes(q)) { score += 5; matchedIn = '破冰遊戲'; }
      else if (JSON.stringify(lesson.crafts || []).toLowerCase().includes(q)) { score += 5; matchedIn = '手工 DIY'; }
      else if (JSON.stringify(lesson.story || []).toLowerCase().includes(q)) { score += 3; matchedIn = '聖經故事內容'; }

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
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
