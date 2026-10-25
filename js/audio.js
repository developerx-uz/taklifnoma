/**
 * Farrux & Marjona - Wedding Audio Controller (js/audio.js)
 * Plays exclusively the studio track of Benom guruhi - "Yoningdaman"
 */

let isAudioPlaying = false;
let wasPlayingBeforeHidden = false;

function getAudioElement() {
  return document.getElementById('wedding-audio');
}

function updateMusicUI(playing) {
  const disc = document.getElementById('vinyl-disc');
  const soundTop = document.getElementById('sound-toggle-top');
  const tooltip = document.getElementById('music-tooltip');

  if (playing) {
    disc?.classList.add('spinning');
    if (soundTop) soundTop.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    tooltip?.classList.remove('show');
  } else {
    disc?.classList.remove('spinning');
    if (soundTop) soundTop.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
  }
}

function playAudioTrack() {
  const audioEl = getAudioElement();
  if (!audioEl) return;

  audioEl.volume = 1.0;
  const playPromise = audioEl.play();

  if (playPromise !== undefined) {
    playPromise.then(() => {
      isAudioPlaying = true;
      updateMusicUI(true);
    }).catch((err) => {
      // Browser autoplay restriction before user interaction
      console.log('Autoplay blocked, waiting for touch/click:', err);
      isAudioPlaying = false;
      updateMusicUI(false);
      
      // Auto-play on first user touch/click anywhere
      const unlockListener = () => {
        if (!isAudioPlaying) {
          audioEl.play().then(() => {
            isAudioPlaying = true;
            updateMusicUI(true);
          }).catch(() => {});
        }
        window.removeEventListener('pointerdown', unlockListener);
        window.removeEventListener('touchstart', unlockListener);
        window.removeEventListener('click', unlockListener);
      };
      window.addEventListener('pointerdown', unlockListener, { once: true });
      window.addEventListener('touchstart', unlockListener, { once: true });
      window.addEventListener('click', unlockListener, { once: true });
    });
  }
}

function pauseAudioTrack() {
  const audioEl = getAudioElement();
  if (audioEl) {
    audioEl.pause();
  }
  isAudioPlaying = false;
  updateMusicUI(false);
}

function toggleAudio() {
  const audioEl = getAudioElement();
  if (!audioEl) return;

  if (isAudioPlaying && !audioEl.paused) {
    pauseAudioTrack();
    if (typeof showToast === 'function') {
      showToast('Musiqa to‘xtatildi');
    }
  } else {
    playAudioTrack();
    if (typeof showToast === 'function') {
      showToast('Benom guruhi — Yoningdaman 🎵');
    }
  }
}

// ============================================================================
// BACKGROUND VISIBILITY HANDLER
// Ilovadan (brauzerdan) chiqib ketganda avtomatik to'xtatish, qaytganda davom ettirish
// ============================================================================
function pauseAudioBackground() {
  const audioEl = getAudioElement();
  if (audioEl && !audioEl.paused) {
    audioEl.pause();
  }
  const disc = document.getElementById('vinyl-disc');
  disc?.classList.remove('spinning');
}

function resumeAudioBackground() {
  if (!isAudioPlaying) return;
  const audioEl = getAudioElement();
  if (audioEl && isAudioPlaying) {
    audioEl.play().then(() => {
      updateMusicUI(true);
    }).catch(() => {});
  }
}

// 1. Page Visibility API (Ekran o'chganda, boshqa ilovaga yoki tabga o'tganda)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (isAudioPlaying) {
      wasPlayingBeforeHidden = true;
      pauseAudioBackground();
    }
  } else {
    if (wasPlayingBeforeHidden && isAudioPlaying) {
      resumeAudioBackground();
      wasPlayingBeforeHidden = false;
    }
  }
});

// 2. Window Blur / PageHide / Freeze (Ilova orqa fonga o'tganda)
window.addEventListener('pagehide', () => {
  if (isAudioPlaying) {
    wasPlayingBeforeHidden = true;
    pauseAudioBackground();
  }
});

window.addEventListener('pageshow', () => {
  if (wasPlayingBeforeHidden && isAudioPlaying) {
    resumeAudioBackground();
    wasPlayingBeforeHidden = false;
  }
});

document.addEventListener('freeze', () => {
  if (isAudioPlaying) {
    wasPlayingBeforeHidden = true;
    pauseAudioBackground();
  }
});

// Initialize listeners on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const musicWidget = document.getElementById('floating-music');
  if (musicWidget) {
    musicWidget.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAudio();
    });
  }

  const topSound = document.getElementById('sound-toggle-top');
  if (topSound) {
    topSound.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAudio();
    });
  }

  // Preload audio and ensure ready
  const audioEl = getAudioElement();
  if (audioEl) {
    audioEl.load();
  }
});
