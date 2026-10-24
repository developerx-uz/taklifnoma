/**
 * Farrux & Marjona - Slide to Unlock & Scroll Lock Module (js/slider.js)
 * Features:
 * - 100% strict vertical scroll locking while locked (no mousewheel, no touchscroll, no keys, no nav links)
 * - Smooth luxury horizontal drag gesture (Left to Right)
 * - Instant automatic unlock upon reaching 88%
 * - On unlock: reveals full invitation, auto-plays music, launches celebration confetti, scrolls to #biz
 */

document.addEventListener('DOMContentLoaded', () => {
  const unlockSlider = document.getElementById('unlock-slider');
  const unlockHandle = document.getElementById('unlock-slider-handle');
  const unlockFill = document.getElementById('unlock-slider-fill');
  const unlockLabel = document.getElementById('unlock-slider-label');
  const lockIcon = document.getElementById('lock-icon');

  if (!unlockSlider || !unlockHandle) return;

  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let maxSlide = 0;
  let unlocked = false;
  let hasMoved = false;

  // =========================================================================
  // STRICT SCROLL LOCK GUARDS (Active while document.body has .is-locked)
  // =========================================================================

  // 1. Prevent mousewheel / trackpad scrolling while locked
  window.addEventListener('wheel', (e) => {
    if (document.body.classList.contains('is-locked')) {
      e.preventDefault();
      showHintAnimation();
    }
  }, { passive: false });

  // 2. Prevent touch scrolling gesture on mobile while locked
  window.addEventListener('touchmove', (e) => {
    if (document.body.classList.contains('is-locked') && !isDragging) {
      if (e.cancelable) e.preventDefault();
    }
  }, { passive: false });

  // 3. Prevent keyboard scrolling keys (Space, PageDown, ArrowDown, etc.)
  window.addEventListener('keydown', (e) => {
    if (document.body.classList.contains('is-locked')) {
      const scrollKeys = ['Space', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'End', 'Home'];
      if (scrollKeys.includes(e.code) || scrollKeys.includes(e.key)) {
        if (e.target !== unlockSlider) {
          e.preventDefault();
          showHintAnimation();
        }
      }
    }
  });

  // 4. Intercept anchor links while locked
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      if (document.body.classList.contains('is-locked')) {
        e.preventDefault();
        showHintAnimation();
      }
    });
  });

  // =========================================================================
  // AUDIO CHIME ON UNLOCK
  // =========================================================================
  function playUnlockChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = audioCtx || new AudioCtx();
      const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.2);
      });
    } catch (_) {}
  }

  function calculateMaxSlide() {
    // 4px padding on each side of the track
    return Math.max(0, unlockSlider.clientWidth - unlockHandle.offsetWidth - 8);
  }

  // =========================================================================
  // TRIGGER UNLOCK
  // =========================================================================
  function triggerUnlock() {
    if (unlocked) {
      document.getElementById('biz')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    unlocked = true;

    // 1. Remove scroll-lock classes from body to unlock full page
    document.body.classList.remove('is-locked');
    document.body.classList.add('is-unlocked');

    // 2. Update ARIA accessibility
    unlockSlider.setAttribute('aria-valuenow', '100');
    unlockSlider.setAttribute('aria-label', 'Taklifnoma ochildi');

    // 3. Visual slider state
    unlockSlider.classList.remove('is-dragging');
    unlockSlider.classList.add('unlocked');

    maxSlide = calculateMaxSlide();
    unlockHandle.style.transition = 'transform 0.28s cubic-bezier(0.2, 0.9, 0.3, 1)';
    unlockHandle.style.transform = `translateX(${maxSlide}px)`;
    if (unlockFill) {
      unlockFill.style.transition = 'width 0.28s cubic-bezier(0.2, 0.9, 0.3, 1)';
      unlockFill.style.width = '100%';
    }
    if (unlockLabel) {
      unlockLabel.style.transition = 'opacity 0.2s ease';
      unlockLabel.style.opacity = '0';
    }

    if (lockIcon) {
      lockIcon.classList.remove('fa-lock');
      lockIcon.classList.add('fa-lock-open');
    }

    // 4. Haptic vibration feedback for smartphones
    if ('vibrate' in navigator) {
      try { navigator.vibrate([40, 50, 40]); } catch (_) {}
    }

    // 5. Play soft crystal chime
    playUnlockChime();

    // 6. Reveal floating music widgets only now
    const floatingMusic = document.getElementById('floating-music');
    const soundToggleTop = document.getElementById('sound-toggle-top');
    floatingMusic?.classList.add('visible');
    soundToggleTop?.classList.add('visible');

    // 7. Automatically start romantic melody
    if (typeof toggleAudio === 'function' && !isAudioPlaying) {
      toggleAudio();
    }

    // 8. Tooltip prompt on the music disc
    const tooltip = document.getElementById('music-tooltip');
    setTimeout(() => {
      tooltip?.classList.add('show');
      setTimeout(() => {
        tooltip?.classList.remove('show');
      }, 3500);
    }, 700);

    // 9. Launch RSVP Confetti celebration
    if (typeof launchConfetti === 'function') {
      launchConfetti();
    }

    // 10. Smoothly scroll down to Section 2 (#biz)
    setTimeout(() => {
      const bizSection = document.getElementById('biz');
      if (bizSection) {
        bizSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 550);
  }

  function resetSlider() {
    unlockHandle.style.transition = 'transform 0.32s cubic-bezier(0.25, 0.8, 0.25, 1)';
    unlockHandle.style.transform = 'translateX(0px)';
    if (unlockFill) {
      unlockFill.style.transition = 'width 0.32s cubic-bezier(0.25, 0.8, 0.25, 1)';
      unlockFill.style.width = '0px';
    }
    if (unlockLabel) {
      unlockLabel.style.transition = 'opacity 0.32s ease';
      unlockLabel.style.opacity = '1';
    }
    unlockSlider.setAttribute('aria-valuenow', '0');

    setTimeout(() => {
      if (!isDragging && !unlocked) {
        unlockHandle.style.transition = '';
        if (unlockFill) unlockFill.style.transition = '';
        if (unlockLabel) unlockLabel.style.transition = '';
      }
    }, 350);
  }

  function showHintAnimation() {
    if (unlocked || unlockSlider.classList.contains('hinting')) return;
    unlockSlider.classList.add('hinting');
    setTimeout(() => {
      unlockSlider.classList.remove('hinting');
    }, 850);
  }

  // =========================================================================
  // GESTURE HANDLERS
  // =========================================================================
  function handleDragStart(clientX) {
    if (unlocked) return;
    isDragging = true;
    hasMoved = false;
    startX = clientX;
    maxSlide = calculateMaxSlide();

    unlockSlider.classList.add('is-dragging');
    unlockHandle.style.transition = 'none';
    if (unlockFill) unlockFill.style.transition = 'none';
    if (unlockLabel) unlockLabel.style.transition = 'none';
  }

  function handleDragMove(clientX) {
    if (!isDragging || unlocked) return;

    const deltaX = clientX - startX;
    if (Math.abs(deltaX) > 4) {
      hasMoved = true;
    }

    // Clamp strictly from 0 to maxSlide (Left to Right only)
    currentX = Math.max(0, Math.min(deltaX, maxSlide));
    const progress = maxSlide > 0 ? currentX / maxSlide : 0;

    unlockHandle.style.transform = `translateX(${currentX}px)`;
    if (unlockFill) {
      unlockFill.style.width = currentX > 0 ? `${currentX + 48 + 5}px` : '0px';
    }
    if (unlockLabel) {
      unlockLabel.style.opacity = `${Math.max(0, 1 - progress * 1.6)}`;
    }

    unlockSlider.setAttribute('aria-valuenow', String(Math.round(progress * 100)));

    // Instant unlock when reaching 88% of slide
    if (progress >= 0.88) {
      isDragging = false;
      triggerUnlock();
    }
  }

  function handleDragEnd(clientX) {
    if (!isDragging || unlocked) return;
    isDragging = false;
    unlockSlider.classList.remove('is-dragging');

    const progress = maxSlide > 0 ? currentX / maxSlide : 0;
    if (progress >= 0.65) {
      triggerUnlock();
    } else {
      if (!hasMoved) {
        // If clicked on the right 35% of the slider, trigger unlock
        const sliderRect = unlockSlider.getBoundingClientRect();
        if (clientX > sliderRect.left + sliderRect.width * 0.65) {
          triggerUnlock();
          return;
        }
        showHintAnimation();
      }
      resetSlider();
    }
    currentX = 0;
  }

  // Touch Events (Mobile)
  unlockSlider.addEventListener('touchstart', (e) => {
    if (unlocked) {
      triggerUnlock();
      return;
    }
    handleDragStart(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || unlocked) return;
    if (e.touches && e.touches.length > 0) {
      handleDragMove(e.touches[0].clientX);
      if (e.cancelable) e.preventDefault();
    }
  }, { passive: false });

  window.addEventListener('touchend', (e) => {
    if (!isDragging || unlocked) return;
    const clientX = e.changedTouches && e.changedTouches.length > 0
      ? e.changedTouches[0].clientX
      : startX + currentX;
    handleDragEnd(clientX);
  }, { passive: true });

  window.addEventListener('touchcancel', () => {
    if (!isDragging || unlocked) return;
    isDragging = false;
    unlockSlider.classList.remove('is-dragging');
    resetSlider();
    currentX = 0;
  }, { passive: true });

  // Mouse Events (Desktop)
  unlockSlider.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    if (unlocked) {
      triggerUnlock();
      return;
    }
    handleDragStart(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging || unlocked) return;
    handleDragMove(e.clientX);
  });

  window.addEventListener('mouseup', (e) => {
    if (!isDragging || unlocked) return;
    handleDragEnd(e.clientX);
  });

  // Keyboard Accessibility: ArrowRight, Enter, Space
  unlockSlider.addEventListener('keydown', (e) => {
    if (unlocked) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerUnlock();
      }
      return;
    }
    if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerUnlock();
    }
  });

  // Window resize handler
  window.addEventListener('resize', () => {
    if (unlocked) {
      maxSlide = calculateMaxSlide();
      unlockHandle.style.transform = `translateX(${maxSlide}px)`;
    }
  });
});
