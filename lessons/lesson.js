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

  // ==========================================================================
  // BlessEq-Inspired Interactive Slide Stage Player (Dedicated Lesson Pages)
  // ==========================================================================

  initSlidePlayer();

  function initSlidePlayer() {
    const cockpitContainer = document.querySelector('.slide-cockpit-container');
    if (!cockpitContainer) return;

    const cards = Array.from(cockpitContainer.querySelectorAll('.slide-item-card'));
    if (!cards.length) return;

    // Parse slide data from existing DOM cards
    const slides = cards.map((card, idx) => {
      const badgeEl = card.querySelector('.slide-number-badge');
      const imgEl = card.querySelector('.slide-img');
      const titleEl = card.querySelector('.slide-title-text');
      const timingEl = card.querySelector('.slide-timing-badge');
      const rawEl = card.querySelector('.slide-raw-summary');
      const teacherEl = card.querySelector('.teacher-script-box p');
      const promptEl = card.querySelector('.student-prompt-box p');

      return {
        slideIndex: idx + 1,
        badge: badgeEl ? badgeEl.textContent.trim() : `投影片 #${idx + 1}`,
        image: imgEl ? imgEl.getAttribute('src') : '',
        alt: imgEl ? imgEl.getAttribute('alt') : '',
        title: titleEl ? titleEl.textContent.trim() : '',
        timing: timingEl ? timingEl.textContent.trim() : '⏱️ 建議停留：2-3 分鐘',
        rawText: rawEl ? rawEl.textContent.trim() : '',
        teacherScript: teacherEl ? teacherEl.textContent.trim() : '',
        studentPrompt: promptEl ? promptEl.textContent.trim() : ''
      };
    });

    // Slide Player State
    const pState = {
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
      presenterTimerSec: 0,
      presenterTimerInterval: null,
      presenterTimerRunning: false,
      showNotesHud: true
    };

    // Detect PPT File Information from URL
    const filename = window.location.pathname.split('/').pop() || '';
    const match = filename.match(/(2026-q[34])-(\d+)/i);
    let pptInfo = {
      folder: '2026-Q3 PPT',
      fileName: '繁2026-Q3-第1課.pptx',
      displayPath: '2026-Q3 PPT / 繁2026-Q3-第1課.pptx',
      downloadUrl: '../2026-Q3%20PPT/%E7%B9%812026-Q3-%E7%AC%AC1%E8%AA%B2.pptx'
    };
    if (match) {
      const q = match[1].toUpperCase();
      const num = parseInt(match[2], 10);
      const folder = `${q} PPT`;
      const fileName = `繁${q}-第${num}課.pptx`;
      const downloadUrl = `../${encodeURIComponent(folder)}/${encodeURIComponent(fileName)}`;
      pptInfo = { folder, fileName, displayPath: `${folder} / ${fileName}`, downloadUrl };
    }

    // 1. Build Mode Switcher Bar
    const modeBar = document.createElement('div');
    modeBar.className = 'slide-view-mode-bar';
    modeBar.innerHTML = `
      <div class="player-toolbar-group">
        <span class="player-toolbar-title"><i class="fa-solid fa-play-circle text-gold"></i> PPT 投影片深探駕駛艙</span>
        <span class="ppt-file-badge" title="簡報來源檔案"><i class="fa-solid fa-file-powerpoint text-danger"></i> ${pptInfo.displayPath}</span>
        <span class="p-timing-badge">全套共 ${slides.length} 頁高畫質投影片</span>
      </div>
      <div class="mode-toggle-group">
        <a class="download-pptx-btn" href="${pptInfo.downloadUrl}" download title="下載本課 PPTX 檔案"><i class="fa-solid fa-download"></i> 下載 PPTX</a>
        <button class="mode-btn active" id="btnModePlayer" type="button"><i class="fa-solid fa-gamepad"></i> 投影片播放模式</button>
        <button class="mode-btn" id="btnModeList" type="button"><i class="fa-solid fa-list-ul"></i> 卡片對照清單</button>
      </div>
    `;

    // 2. Build Interactive Slide Stage Player
    const playerContainer = document.createElement('div');
    playerContainer.className = 'slide-player-container';
    playerContainer.innerHTML = `
      <!-- Toolbar -->
      <div class="slide-player-toolbar">
        <div class="player-toolbar-group">
          <span class="player-counter">
            <i class="fa-regular fa-image text-gold"></i>
            <span>投影片 <strong id="pCurrentNum">1</strong> / <strong>${slides.length}</strong></span>
          </span>
          <select class="player-jump-select" id="pJumpSelect" title="跳轉投影片"></select>
        </div>

        <div class="player-audio-controls">
          <button class="player-btn-action narrate-btn" id="pAudioNarrateBtn" type="button" title="語音朗讀老師講稿">
            <i class="fa-solid fa-volume-high" id="pAudioIcon"></i>
            <span class="p-soundwave-bars" id="pSoundwaveBars" aria-hidden="true"><span></span><span></span><span></span><span></span></span>
            <span id="pAudioText">朗讀本頁講稿</span>
          </button>

          <button class="player-btn-action auto-btn" id="pAutoAdvanceBtn" type="button" title="朗讀後自動換頁">
            <i class="fa-solid fa-forward-step"></i>
            <span id="pAutoAdvanceText">自動連播：關</span>
          </button>

          <select class="player-speed-select" id="pSpeedSelect" title="語音速度">
            <option value="0.8">0.8x 緩速</option>
            <option value="1" selected>1.0x 標準</option>
            <option value="1.2">1.2x 稍快</option>
            <option value="1.5">1.5x 快速</option>
          </select>

          <button class="player-btn-action slideshow-btn" id="pSlideshowBtn" type="button" title="幻燈自動播放">
            <i class="fa-solid fa-play" id="pSlideshowIcon"></i>
            <span id="pSlideshowText">幻燈放映</span>
          </button>

          <select class="player-speed-select" id="pIntervalSelect" title="放映換頁間隔">
            <option value="3">3秒/頁</option>
            <option value="5" selected>5秒/頁</option>
            <option value="8">8秒/頁</option>
            <option value="12">12秒/頁</option>
          </select>
        </div>
      </div>

      <!-- Dual Pane Stage & Review -->
      <div class="player-dual-pane">
        <!-- Left: Stage Card -->
        <div class="player-stage-card">
          <div class="player-view-header">
            <div class="player-toolbar-group">
              <span style="font-weight:600;font-size:0.9rem;color:var(--text-muted);">
                <i class="fa-solid fa-tv text-gold"></i> 16:9 高畫質大螢幕
              </span>
            </div>
            <div class="player-header-actions">
              <button class="player-btn-icon" id="pBtnGrid" type="button" title="縮圖格線總覽 (G 鍵)"><i class="fa-solid fa-grip"></i></button>
              <button class="player-btn-icon" id="pBtnTheater" type="button" title="劇院巨幕模式 (T 鍵)"><i class="fa-solid fa-film"></i></button>
              <button class="player-btn-icon" id="pBtnPrev" type="button" title="上一張 (← 鍵)"><i class="fa-solid fa-chevron-left"></i></button>
              <button class="player-btn-icon" id="pBtnNext" type="button" title="下一張 (→ 鍵 或 空白鍵)"><i class="fa-solid fa-chevron-right"></i></button>
              <button class="player-btn-icon" id="pBtnFullscreen" type="button" title="全螢幕投影展示 (F 鍵)"><i class="fa-solid fa-expand"></i></button>
            </div>
          </div>

          <div class="player-stage-main" id="pStageMain">
            <img src="" alt="投影片" class="player-main-img" id="pMainImg">
            <div class="player-text-fallback" id="pTextFallback" style="display:none;">
              <span class="player-fallback-badge"><i class="fa-solid fa-feather-pointed"></i> 投文字重點頁</span>
              <h3 id="pFallbackTitle"></h3>
              <div class="player-fallback-body" id="pFallbackBody"></div>
            </div>

            <!-- Overlay Hover Buttons -->
            <button class="player-overlay-btn player-prev-overlay" id="pOverlayPrev" type="button" title="上一張 (←)"><i class="fa-solid fa-chevron-left"></i></button>
            <button class="player-overlay-btn player-next-overlay" id="pOverlayNext" type="button" title="下一張 (→)"><i class="fa-solid fa-chevron-right"></i></button>
          </div>

          <!-- Grid Gallery (Toggleable) -->
          <div class="player-grid-gallery" id="pGridGallery" hidden></div>

          <!-- Thumbnails Strip -->
          <div class="player-thumbnails-strip" id="pThumbnailsStrip"></div>
        </div>

        <!-- Right: Deep Review Pane -->
        <div class="player-deep-review">
          <div class="p-review-header">
            <div class="p-review-title-group">
              <span class="p-badge-idx" id="pBadgeIdx">投影片 #1</span>
              <h3 class="p-review-title" id="pReviewTitle"></h3>
            </div>
            <span class="p-timing-badge" id="pReviewTiming">⏱️ 建議停留：2-3 分鐘</span>
          </div>

          <div class="p-verbatim-card">
            <div class="p-verbatim-header">
              <span class="p-verbatim-tag"><i class="fa-solid fa-microphone-lines text-gold"></i> 老師口頭講述逐字稿（怎麼說）：</span>
              <div style="display:flex;gap:6px;">
                <button class="p-micro-btn" id="pBtnSpeakVerbatim" type="button"><i class="fa-solid fa-volume-high"></i> 朗讀此段</button>
                <button class="p-micro-btn" id="pBtnCopyVerbatim" type="button" title="複製此段逐字稿"><i class="fa-regular fa-copy"></i> 複製</button>
              </div>
            </div>
            <p class="p-verbatim-text" id="pTeacherScript"></p>
          </div>

          <div class="p-prompt-card">
            <span class="p-prompt-tag"><i class="fa-solid fa-circle-question text-gold"></i> 課堂即時提問（問孩子什麼）：</span>
            <p class="p-prompt-text" id="pStudentPrompt"></p>
          </div>

          <div class="p-raw-card">
            <span class="p-raw-tag"><i class="fa-solid fa-list-check text-gold"></i> 原文字稿與投影片重點提要：</span>
            <div class="p-raw-body" id="pRawBody"></div>
          </div>
        </div>
      </div>

      <!-- Mobile Thumb-Friendly Sticky Control Bar -->
      <div class="mobile-slide-bar" id="pMobileSlideBar">
        <button class="m-bar-btn" id="pMBtnPrev" type="button" aria-label="上一頁">
          <i class="fa-solid fa-chevron-left"></i>
          <span>上一頁</span>
        </button>
        <div class="m-bar-indicator" id="pMIndicator">
          <span id="pMCurrent">1</span> / <span>${slides.length}</span>
        </div>
        <button class="m-bar-btn m-bar-speak" id="pMBtnSpeak" type="button" aria-label="朗讀講稿">
          <i class="fa-solid fa-volume-high" id="pMAudioIcon"></i>
          <span>朗讀</span>
        </button>
        <button class="m-bar-btn" id="pMBtnNext" type="button" aria-label="下一頁">
          <i class="fa-solid fa-chevron-right"></i>
          <span>下一頁</span>
        </button>
        <button class="m-bar-btn" id="pMBtnFullscreen" type="button" aria-label="全螢幕展示">
          <i class="fa-solid fa-expand"></i>
          <span>全螢幕</span>
        </button>
      </div>
    `;

    // 3. Build Lesson Presenter Fullscreen Modal
    const lessonTitleText = document.querySelector('.lesson-title') ? document.querySelector('.lesson-title').textContent.trim() : '主日學投影片投影';
    const presenterModal = document.createElement('div');
    presenterModal.className = 'lesson-presenter-modal hidden';
    presenterModal.innerHTML = `
      <div class="l-present-header">
        <div class="l-present-meta">
          <span style="display:inline-flex;align-items:center;gap:6px;padding:3px 8px;background:rgba(255,255,255,0.1);border-radius:4px;font-size:0.8rem;color:#fca5a5;margin-bottom:4px;"><i class="fa-solid fa-file-powerpoint text-danger"></i> ${pptInfo.displayPath}</span>
          <h2>${lessonTitleText}</h2>
        </div>
        <div class="l-present-timer">
          <i class="fa-regular fa-clock text-gold"></i>
          <span id="lTimerDigits">00:00</span>
          <button id="lTimerToggleBtn" class="player-btn-icon" style="border:none;background:transparent;color:#fff;" title="開始/暫停"><i class="fa-solid fa-play" id="lTimerIcon"></i></button>
          <button id="lTimerResetBtn" class="player-btn-icon" style="border:none;background:transparent;color:#fff;" title="重設"><i class="fa-solid fa-rotate-right"></i></button>
        </div>
        <div class="l-present-controls">
          <a class="player-btn-action" href="${pptInfo.downloadUrl}" download style="background:rgba(239,68,68,0.25);color:#fca5a5;border-color:rgba(239,68,68,0.4);" title="下載本課 PPTX"><i class="fa-solid fa-download"></i> 下載 PPTX</a>
          <button class="player-btn-action" id="lToggleNotesBtn" style="background:rgba(255,255,255,0.15);color:#fff;border-color:rgba(255,255,255,0.2);"><i class="fa-regular fa-comment-dots"></i> 講員提詞卡 (N)</button>
          <span style="font-family:monospace;font-size:1.05rem;color:#fbbf24;font-weight:700;padding:0 0.5rem;" id="lSlideNumIndicator">1 / ${slides.length}</span>
          <button class="player-btn-action" id="lBtnPrev"><i class="fa-solid fa-chevron-left"></i> 上一張</button>
          <button class="player-btn-action" id="lBtnNext">下一張 <i class="fa-solid fa-chevron-right"></i></button>
          <button class="player-btn-action" id="lBtnExit" style="background:#dc2626;color:#fff;border-color:#dc2626;"><i class="fa-solid fa-xmark"></i> 退出投影</button>
        </div>
      </div>
      <div class="l-present-body">
        <img src="" alt="投影" class="l-present-img" id="lPresentImg">
        <div class="player-text-fallback" id="lPresentFallback" style="display:none;max-width:800px;padding:3rem;">
          <h2 id="lFallbackTitle" style="font-size:2rem;color:#fef08a;margin-bottom:1.5rem;"></h2>
          <div id="lFallbackBody" style="font-size:1.2rem;line-height:1.8;color:#e4e4e7;white-space:pre-line;"></div>
        </div>

        <div class="l-present-hud" id="lPresentHud">
          <div style="padding:8px 12px;background:rgba(0,0,0,0.5);border-bottom:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between;color:#fbbf24;font-weight:700;font-size:0.85rem;">
            <span><i class="fa-solid fa-microphone-lines text-gold"></i> 講員備忘提詞 (快捷鍵 N)</span>
            <span id="lHudTiming" style="font-size:0.75rem;background:rgba(245,158,11,0.25);padding:2px 6px;border-radius:4px;color:#fef08a;"></span>
          </div>
          <div style="padding:10px 12px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;font-size:0.9rem;color:#f1f5f9;">
            <div>
              <strong style="color:#fbbf24;font-size:0.82rem;">🎤 老師講述逐字稿：</strong>
              <p id="lHudScript" style="background:rgba(255,255,255,0.08);padding:6px 8px;border-radius:4px;margin-top:3px;"></p>
            </div>
            <div>
              <strong style="color:#34d399;font-size:0.82rem;">❓ 課堂立即提問：</strong>
              <p id="lHudPrompt" style="background:rgba(255,255,255,0.08);padding:6px 8px;border-radius:4px;margin-top:3px;"></p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Insert into DOM: modeBar and playerContainer above cards
    const introBar = cockpitContainer.querySelector('.cockpit-intro-bar');
    if (introBar) {
      introBar.after(playerContainer);
      introBar.after(modeBar);
    } else {
      cockpitContainer.prepend(playerContainer);
      cockpitContainer.prepend(modeBar);
    }
    document.body.appendChild(presenterModal);

    // Default: hide cards, show player
    cards.forEach(c => c.style.display = 'none');

    // DOM Elements inside player
    const pCurrentNum = document.getElementById('pCurrentNum');
    const pJumpSelect = document.getElementById('pJumpSelect');
    const pMainImg = document.getElementById('pMainImg');
    const pTextFallback = document.getElementById('pTextFallback');
    const pFallbackTitle = document.getElementById('pFallbackTitle');
    const pFallbackBody = document.getElementById('pFallbackBody');
    const pOverlayPrev = document.getElementById('pOverlayPrev');
    const pOverlayNext = document.getElementById('pOverlayNext');
    const pGridGallery = document.getElementById('pGridGallery');
    const pThumbnailsStrip = document.getElementById('pThumbnailsStrip');
    const pBadgeIdx = document.getElementById('pBadgeIdx');
    const pReviewTitle = document.getElementById('pReviewTitle');
    const pReviewTiming = document.getElementById('pReviewTiming');
    const pTeacherScript = document.getElementById('pTeacherScript');
    const pStudentPrompt = document.getElementById('pStudentPrompt');
    const pRawBody = document.getElementById('pRawBody');
    const pAudioNarrateBtn = document.getElementById('pAudioNarrateBtn');
    const pAudioIcon = document.getElementById('pAudioIcon');
    const pAudioText = document.getElementById('pAudioText');
    const pAutoAdvanceBtn = document.getElementById('pAutoAdvanceBtn');
    const pAutoAdvanceText = document.getElementById('pAutoAdvanceText');
    const pSpeedSelect = document.getElementById('pSpeedSelect');
    const pSlideshowBtn = document.getElementById('pSlideshowBtn');
    const pSlideshowIcon = document.getElementById('pSlideshowIcon');
    const pSlideshowText = document.getElementById('pSlideshowText');
    const pIntervalSelect = document.getElementById('pIntervalSelect');
    const pBtnPrev = document.getElementById('pBtnPrev');
    const pBtnNext = document.getElementById('pBtnNext');
    const pBtnGrid = document.getElementById('pBtnGrid');
    const pBtnTheater = document.getElementById('pBtnTheater');
    const pBtnFullscreen = document.getElementById('pBtnFullscreen');
    const pBtnSpeakVerbatim = document.getElementById('pBtnSpeakVerbatim');
    const pBtnCopyVerbatim = document.getElementById('pBtnCopyVerbatim');
    const btnModePlayer = document.getElementById('btnModePlayer');
    const btnModeList = document.getElementById('btnModeList');

    // Mobile slide thumb bar elements
    const pMBtnPrev = document.getElementById('pMBtnPrev');
    const pMBtnNext = document.getElementById('pMBtnNext');
    const pMBtnSpeak = document.getElementById('pMBtnSpeak');
    const pMBtnFullscreen = document.getElementById('pMBtnFullscreen');
    const pMCurrent = document.getElementById('pMCurrent');
    const pMAudioIcon = document.getElementById('pMAudioIcon');

    // Presenter Modal Elements
    const lTimerDigits = document.getElementById('lTimerDigits');
    const lTimerToggleBtn = document.getElementById('lTimerToggleBtn');
    const lTimerIcon = document.getElementById('lTimerIcon');
    const lTimerResetBtn = document.getElementById('lTimerResetBtn');
    const lToggleNotesBtn = document.getElementById('lToggleNotesBtn');
    const lSlideNumIndicator = document.getElementById('lSlideNumIndicator');
    const lBtnPrev = document.getElementById('lBtnPrev');
    const lBtnNext = document.getElementById('lBtnNext');
    const lBtnExit = document.getElementById('lBtnExit');
    const lPresentImg = document.getElementById('lPresentImg');
    const lPresentFallback = document.getElementById('lPresentFallback');
    const lFallbackTitle = document.getElementById('lFallbackTitle');
    const lFallbackBody = document.getElementById('lFallbackBody');
    const lPresentHud = document.getElementById('lPresentHud');
    const lHudTiming = document.getElementById('lHudTiming');
    const lHudScript = document.getElementById('lHudScript');
    const lHudPrompt = document.getElementById('lHudPrompt');

    // Populate Jump Select
    slides.forEach((s, idx) => {
      const opt = document.createElement('option');
      opt.value = idx + 1;
      opt.textContent = `${s.badge} · ${(s.title || '').slice(0, 14)}`;
      pJumpSelect.appendChild(opt);
    });

    // Populate Thumbnails
    slides.forEach((slide, idx) => {
      const sNum = idx + 1;
      const thumb = document.createElement('div');
      thumb.className = `player-thumb-item ${sNum === 1 ? 'active' : ''}`;
      thumb.dataset.idx = sNum;
      thumb.title = `第 ${sNum} 頁：${slide.title || ''}`;

      if (slide.image) {
        const img = document.createElement('img');
        img.src = slide.image;
        img.alt = '';
        img.loading = 'lazy';
        thumb.appendChild(img);
      } else {
        const span = document.createElement('div');
        span.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100%;font-size:0.65rem;color:#fbbf24;background:#27272a;';
        span.textContent = '重點頁';
        thumb.appendChild(span);
      }

      const idxBadge = document.createElement('span');
      idxBadge.className = 'p-thumb-idx';
      idxBadge.textContent = `#${sNum}`;
      thumb.appendChild(idxBadge);

      thumb.addEventListener('click', () => {
        const dir = sNum > pState.slideIndex ? 'next' : 'prev';
        setSlide(sNum, dir);
      });

      pThumbnailsStrip.appendChild(thumb);
    });

    // Populate Grid Gallery
    slides.forEach((slide, idx) => {
      const sNum = idx + 1;
      const thumb = document.createElement('div');
      thumb.className = `player-grid-thumb ${sNum === 1 ? 'active' : ''}`;
      thumb.dataset.idx = sNum;

      if (slide.image) {
        const img = document.createElement('img');
        img.src = slide.image;
        img.alt = '';
        img.loading = 'lazy';
        thumb.appendChild(img);
      } else {
        const span = document.createElement('div');
        span.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100%;font-size:0.8rem;color:#fef08a;background:#27272a;padding:4px;text-align:center;';
        span.textContent = slide.title || `第 ${sNum} 頁`;
        thumb.appendChild(span);
      }

      const badge = document.createElement('span');
      badge.className = 'grid-idx';
      badge.textContent = `#${sNum}`;
      thumb.appendChild(badge);

      thumb.addEventListener('click', () => {
        const dir = sNum > pState.slideIndex ? 'next' : 'prev';
        setSlide(sNum, dir);
        toggleGrid();
      });

      pGridGallery.appendChild(thumb);
    });

    // Set Slide
    function setSlide(newIdx, direction = 'none') {
      const idx = Math.max(1, Math.min(newIdx, slides.length));
      pState.slideIndex = idx;
      const slide = slides[idx - 1];
      if (!slide) return;

      pCurrentNum.textContent = idx;
      pJumpSelect.value = idx;

      // Image Transition
      pMainImg.classList.remove('enter-right', 'enter-left');
      void pMainImg.offsetWidth;
      if (direction === 'next') pMainImg.classList.add('enter-right');
      else if (direction === 'prev') pMainImg.classList.add('enter-left');

      if (slide.image) {
        pMainImg.style.display = 'block';
        if (pTextFallback) pTextFallback.style.display = 'none';
        pMainImg.onerror = () => {
          pMainImg.style.display = 'none';
          if (pTextFallback) {
            pTextFallback.style.display = 'block';
            if (pFallbackTitle) pFallbackTitle.textContent = slide.title || `投影片 #${idx}`;
            if (pFallbackBody) pFallbackBody.textContent = slide.rawText || '本頁為課堂重要真理提要';
          }
        };
        pMainImg.src = slide.image;
        pMainImg.alt = slide.alt || slide.title || `投影片 #${idx}`;
      } else {
        pMainImg.style.display = 'none';
        if (pTextFallback) {
          pTextFallback.style.display = 'block';
          if (pFallbackTitle) pFallbackTitle.textContent = slide.title || `投影片 #${idx}`;
          if (pFallbackBody) pFallbackBody.textContent = slide.rawText || '本頁為課堂重要真理提要';
        }
      }

      // Sync Thumbnails
      pThumbnailsStrip.querySelectorAll('.player-thumb-item').forEach(t => {
        const isActive = parseInt(t.dataset.idx, 10) === idx;
        t.classList.toggle('active', isActive);
        if (isActive) {
          requestAnimationFrame(() => {
            try {
              t.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            } catch(e) {}
          });
        }
      });

      // Sync Grid
      pGridGallery.querySelectorAll('.player-grid-thumb').forEach(t => {
        t.classList.toggle('active', parseInt(t.dataset.idx, 10) === idx);
      });

      // Populate Deep Review
      pBadgeIdx.textContent = slide.badge;
      pReviewTitle.textContent = slide.title || '投影片重點提要';
      pReviewTiming.textContent = slide.timing;
      pTeacherScript.textContent = slide.teacherScript ? slide.teacherScript.replace(/^[『「]|['』」]$/g, '') : '（口頭講述故事關鍵情節與屬靈真理）';
      pStudentPrompt.textContent = slide.studentPrompt || '（提問孩子們的看法）';
      pRawBody.textContent = slide.rawText || '無額外文字';

      // Update Presenter Modal
      if (!presenterModal.classList.contains('hidden')) {
        updatePresenter();
      }

      // Buttons disabled
      pBtnPrev.disabled = idx === 1;
      pBtnNext.disabled = idx === slides.length;
      if (pMBtnPrev) pMBtnPrev.disabled = idx === 1;
      if (pMBtnNext) pMBtnNext.disabled = idx === slides.length;
      if (pMCurrent) pMCurrent.textContent = idx;
      pOverlayPrev.style.display = idx === 1 ? 'none' : 'flex';
      pOverlayNext.style.display = idx === slides.length ? 'none' : 'flex';
    }

    function nextSlide() {
      if (pState.slideIndex < slides.length) setSlide(pState.slideIndex + 1, 'next');
    }
    function prevSlide() {
      if (pState.slideIndex > 1) setSlide(pState.slideIndex - 1, 'prev');
    }

    function toggleGrid() {
      pState.isGridOpen = !pState.isGridOpen;
      pGridGallery.hidden = !pState.isGridOpen;
      pBtnGrid.classList.toggle('active', pState.isGridOpen);
    }

    function togglePlayerTheater() {
      const dual = playerContainer.querySelector('.player-dual-pane');
      if (!dual) return;
      pState.isTheaterMode = !pState.isTheaterMode;
      dual.classList.toggle('theater-mode', pState.isTheaterMode);
      if (pBtnTheater) {
        pBtnTheater.classList.toggle('active', pState.isTheaterMode);
        pBtnTheater.title = pState.isTheaterMode ? '還原雙欄模式 (T 鍵)' : '劇院巨幕模式 (T 鍵)';
      }
      showLToast(pState.isTheaterMode ? '已開啟 16:9 劇院巨幕模式！' : '已還原標準雙欄模式', 'fa-film');
    }

    // Speech Narration
    function toggleSpeech() {
      if (!('speechSynthesis' in window)) {
        alert('您的瀏覽器不支援語音合成功能，建議使用 Chrome / Edge 瀏覽器。');
        return;
      }
      if (pState.isSpeaking) stopSpeech();
      else startSpeech();
    }

    function startSpeech(isAutoAdvance = false) {
      const slide = slides[pState.slideIndex - 1];
      if (!slide) return;

      stopSpeech(false);
      pState.isSpeaking = true;
      pAudioNarrateBtn.classList.add('speaking');
      pAudioIcon.className = 'fa-solid fa-pause';
      pAudioText.textContent = '暫停朗讀';
      if (pMAudioIcon) pMAudioIcon.className = 'fa-solid fa-pause';
      if (pMBtnSpeak) pMBtnSpeak.classList.add('speaking');

      let text = '';
      if (slide.teacherScript) text += slide.teacherScript.replace(/[『』「」]/g, '') + '。';
      if (slide.studentPrompt) text += ' 課堂提問：' + slide.studentPrompt;
      if (!text.trim()) text = slide.title + '。' + slide.rawText;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = pState.speechRate;

      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const v = voices.find(vo => vo.lang === 'zh-TW') || voices.find(vo => vo.lang && vo.lang.startsWith('zh'));
        if (v) utterance.voice = v;
      };
      if (window.speechSynthesis.getVoices().length > 0) setVoice();
      else window.speechSynthesis.addEventListener('voiceschanged', setVoice, { once: true });

      utterance.onend = () => {
        pState.isSpeaking = false;
        clearInterval(pState.speechKeepAlive);
        pAudioNarrateBtn.classList.remove('speaking');
        pAudioIcon.className = 'fa-solid fa-volume-high';
        pAudioText.textContent = '朗讀本頁講稿';
        if (pMAudioIcon) pMAudioIcon.className = 'fa-solid fa-volume-high';
        if (pMBtnSpeak) pMBtnSpeak.classList.remove('speaking');

        if (pState.autoAdvanceTTS && pState.slideIndex < slides.length) {
          setTimeout(() => {
            nextSlide();
            setTimeout(() => startSpeech(true), 600);
          }, 800);
        }
      };

      utterance.onerror = () => stopSpeech();

      clearInterval(pState.speechKeepAlive);
      pState.speechKeepAlive = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);

      window.speechSynthesis.speak(utterance);
    }

    function stopSpeech(reset = true) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      clearInterval(pState.speechKeepAlive);
      if (reset) {
        pState.isSpeaking = false;
        pAudioNarrateBtn.classList.remove('speaking');
        pAudioIcon.className = 'fa-solid fa-volume-high';
        pAudioText.textContent = '朗讀本頁講稿';
        if (pMAudioIcon) pMAudioIcon.className = 'fa-solid fa-volume-high';
        if (pMBtnSpeak) pMBtnSpeak.classList.remove('speaking');
      }
    }

    function toggleAutoAdvance() {
      pState.autoAdvanceTTS = !pState.autoAdvanceTTS;
      pAutoAdvanceBtn.classList.toggle('active', pState.autoAdvanceTTS);
      pAutoAdvanceText.textContent = pState.autoAdvanceTTS ? '自動連播：開' : '自動連播：關';
    }

    // Slideshow Autoplay
    function toggleSlideshow() {
      if (pState.isAutoPlaying) stopSlideshow();
      else startSlideshow();
    }

    function startSlideshow() {
      pState.isAutoPlaying = true;
      pSlideshowBtn.classList.add('playing');
      pSlideshowIcon.className = 'fa-solid fa-pause';
      pSlideshowText.textContent = '暫停放映';

      pState.autoPlayTimer = setInterval(() => {
        if (pState.slideIndex >= slides.length) setSlide(1, 'next');
        else nextSlide();
      }, pState.autoPlayIntervalSec * 1000);
    }

    function stopSlideshow() {
      pState.isAutoPlaying = false;
      clearInterval(pState.autoPlayTimer);
      pSlideshowBtn.classList.remove('playing');
      pSlideshowIcon.className = 'fa-solid fa-play';
      pSlideshowText.textContent = '幻燈放映';
    }

    // Presenter Modal
    function openPresenter() {
      presenterModal.classList.remove('hidden');
      updatePresenter();
      startPresenterTimer();
    }

    function closePresenter() {
      presenterModal.classList.add('hidden');
      stopPresenterTimer();
    }

    function updatePresenter() {
      const idx = pState.slideIndex;
      const slide = slides[idx - 1];
      if (!slide) return;

      lSlideNumIndicator.textContent = `${idx} / ${slides.length}`;
      if (slide.image) {
        lPresentImg.style.display = 'block';
        lPresentFallback.style.display = 'none';
        lPresentImg.onerror = () => {
          lPresentImg.style.display = 'none';
          lPresentFallback.style.display = 'block';
          lFallbackTitle.textContent = slide.title || `投影片 #${idx}`;
          lFallbackBody.textContent = slide.rawText || '';
        };
        lPresentImg.src = slide.image;
      } else {
        lPresentImg.style.display = 'none';
        lPresentFallback.style.display = 'block';
        lFallbackTitle.textContent = slide.title || `投影片 #${idx}`;
        lFallbackBody.textContent = slide.rawText || '';
      }

      lHudTiming.textContent = slide.timing;
      lHudScript.textContent = slide.teacherScript ? slide.teacherScript.replace(/^[『「]|['』」]$/g, '') : '（口頭發揮講述）';
      lHudPrompt.textContent = slide.studentPrompt || '（課堂互動提問）';

      lBtnPrev.disabled = idx === 1;
      lBtnNext.disabled = idx === slides.length;
    }

    function startPresenterTimer() {
      if (pState.presenterTimerRunning) return;
      pState.presenterTimerRunning = true;
      lTimerIcon.className = 'fa-solid fa-pause';
      pState.presenterTimerInterval = setInterval(() => {
        pState.presenterTimerSec++;
        const m = Math.floor(pState.presenterTimerSec / 60);
        const s = pState.presenterTimerSec % 60;
        lTimerDigits.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      }, 1000);
    }

    function stopPresenterTimer() {
      pState.presenterTimerRunning = false;
      clearInterval(pState.presenterTimerInterval);
      lTimerIcon.className = 'fa-solid fa-play';
    }

    function resetPresenterTimer() {
      stopPresenterTimer();
      pState.presenterTimerSec = 0;
      lTimerDigits.textContent = '00:00';
    }

    function togglePresenterNotes() {
      pState.showNotesHud = !pState.showNotesHud;
      lPresentHud.classList.toggle('minimized', !pState.showNotesHud);
      lToggleNotesBtn.classList.toggle('active', pState.showNotesHud);
    }

    // View Mode Toggle
    btnModePlayer.addEventListener('click', () => {
      btnModePlayer.classList.add('active');
      btnModeList.classList.remove('active');
      playerContainer.style.display = 'flex';
      cards.forEach(c => c.style.display = 'none');
    });

    btnModeList.addEventListener('click', () => {
      btnModeList.classList.add('active');
      btnModePlayer.classList.remove('active');
      playerContainer.style.display = 'none';
      cards.forEach(c => c.style.display = 'flex');
      stopSpeech();
      stopSlideshow();
    });

    // Bind Player Events
    pBtnPrev.addEventListener('click', prevSlide);
    pBtnNext.addEventListener('click', nextSlide);
    pOverlayPrev.addEventListener('click', prevSlide);
    pOverlayNext.addEventListener('click', nextSlide);
    pJumpSelect.addEventListener('change', (e) => setSlide(parseInt(e.target.value, 10), 'none'));
    pBtnGrid.addEventListener('click', toggleGrid);
    if (pBtnTheater) pBtnTheater.addEventListener('click', togglePlayerTheater);
    pBtnFullscreen.addEventListener('click', openPresenter);
    pAudioNarrateBtn.addEventListener('click', toggleSpeech);
    pBtnSpeakVerbatim.addEventListener('click', toggleSpeech);

    // Mobile Thumb Bar Buttons
    if (pMBtnPrev) pMBtnPrev.addEventListener('click', prevSlide);
    if (pMBtnNext) pMBtnNext.addEventListener('click', nextSlide);
    if (pMBtnSpeak) pMBtnSpeak.addEventListener('click', toggleSpeech);
    if (pMBtnFullscreen) pMBtnFullscreen.addEventListener('click', openPresenter);

    // Touch Swipe Gestures on Slide Stage
    const pStageMain = document.getElementById('pStageMain');
    let pTouchX = 0;
    let pTouchY = 0;
    if (pStageMain) {
      pStageMain.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length === 1) {
          pTouchX = e.touches[0].clientX;
          pTouchY = e.touches[0].clientY;
        }
      }, { passive: true });

      pStageMain.addEventListener('touchend', (e) => {
        if (e.changedTouches && e.changedTouches.length === 1) {
          const dx = e.changedTouches[0].clientX - pTouchX;
          const dy = e.changedTouches[0].clientY - pTouchY;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) nextSlide();
            else prevSlide();
          }
        }
      }, { passive: true });
    }

    // Floating Micro-Toast for dedicated lesson page
    const lToast = document.createElement('div');
    lToast.className = 'l-toast-notification';
    document.body.appendChild(lToast);

    let lToastTimer = null;
    function showLToast(msg, icon = 'fa-check') {
      lToast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${msg}</span>`;
      lToast.classList.add('show');
      clearTimeout(lToastTimer);
      lToastTimer = setTimeout(() => lToast.classList.remove('show'), 2400);
    }

    function fallbackCopyL(text) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showLToast('已複製到剪貼簿！', 'fa-copy');
      } catch (e) {
        showLToast('複製失敗，請手動選取複製', 'fa-circle-exclamation');
      }
      document.body.removeChild(ta);
    }

    if (pBtnCopyVerbatim) {
      pBtnCopyVerbatim.addEventListener('click', () => {
        const slide = slides[pState.slideIndex - 1];
        if (!slide || !slide.teacherScript) return;
        const text = slide.teacherScript.replace(/^[『「]|['』」]$/g, '');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            showLToast('老師講述逐字稿已複製！', 'fa-copy');
          }).catch(() => fallbackCopyL(text));
        } else {
          fallbackCopyL(text);
        }
      });
    }

    pAutoAdvanceBtn.addEventListener('click', toggleAutoAdvance);
    pSpeedSelect.addEventListener('change', (e) => { pState.speechRate = parseFloat(e.target.value); });
    pSlideshowBtn.addEventListener('click', toggleSlideshow);
    pIntervalSelect.addEventListener('change', (e) => {
      pState.autoPlayIntervalSec = parseInt(e.target.value, 10);
      if (pState.isAutoPlaying) { stopSlideshow(); startSlideshow(); }
    });

    // Bind Presenter Modal Events
    lBtnPrev.addEventListener('click', prevSlide);
    lBtnNext.addEventListener('click', nextSlide);
    lBtnExit.addEventListener('click', closePresenter);
    lTimerToggleBtn.addEventListener('click', () => {
      if (pState.presenterTimerRunning) stopPresenterTimer();
      else startPresenterTimer();
    });
    lTimerResetBtn.addEventListener('click', resetPresenterTimer);
    lToggleNotesBtn.addEventListener('click', togglePresenterNotes);

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

      const isModal = !presenterModal.classList.contains('hidden');
      const isPlayerActive = btnModePlayer.classList.contains('active');

      if (isModal) {
        if (e.key === 'ArrowRight' || e.key === 'Space') { e.preventDefault(); nextSlide(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
        else if (e.key === 'Escape') { closePresenter(); }
        else if (e.key === 'n' || e.key === 'N') { togglePresenterNotes(); }
      } else if (isPlayerActive) {
        if (e.key === 'ArrowRight' || e.key === 'Space') { e.preventDefault(); nextSlide(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
        else if (e.key === 'f' || e.key === 'F') { e.preventDefault(); openPresenter(); }
        else if (e.key === 't' || e.key === 'T') { e.preventDefault(); togglePlayerTheater(); }
        else if (e.key === 'g' || e.key === 'G') { e.preventDefault(); toggleGrid(); }
        else if (e.key === 'p' || e.key === 'P') { e.preventDefault(); toggleSlideshow(); }
        else if (e.key === 'Escape' && pState.isGridOpen) { toggleGrid(); }
      }
    });

    // Initialize first slide
    setSlide(1, 'none');
  }
})();
