/**
 * Farrux & Marjona Nikoh To'yi - Mehmonlarni hisoblash va statistika skripti (js/tracker.js)
 * Tashrifchilarni, qurilma turini va harakatlarni avtomatik qayd etadi.
 */

(function () {
  'use strict';

  // API bazaviy manzilini aniqlash
  function getApiBase() {
    const host = window.location.hostname;
    if (host === 'developerx.uz' || host === 'www.developerx.uz') {
      return '/farrux-marjona-nikoh-toyi/api';
    } else if (host === 'localhost' || host === '127.0.0.1') {
      // Mahalliy sinov paytida server.js yoki to'g'ridan-to'g'ri developerx.uz API
      return window.location.port === '8097' ? '/api' : 'https://developerx.uz/farrux-marjona-nikoh-toyi/api';
    } else {
      // GitHub Pages yoki boshqa xostinglarda jonli developerx.uz API ga ulanadi
      return 'https://developerx.uz/farrux-marjona-nikoh-toyi/api';
    }
  }

  const API_BASE = getApiBase();

  function sendEvent(action, extraData) {
    try {
      const payload = {
        action: action || 'pageview',
        user_agent: navigator.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`,
        lang: document.documentElement.lang || navigator.language || 'uz',
        referrer: document.referrer || '',
        ...extraData
      };

      const url = `${API_BASE}/track`;

      // navigator.sendBeacon or fetch
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
      } else {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(() => {});
      }
    } catch (_) {}
  }

  // 1. Sahifaga kirganda bir marta "pageview" yuborish
  window.addEventListener('DOMContentLoaded', () => {
    // Session ichida har sekund spam bo'lmasligi uchun
    const sessionKey = 'taklifnoma_session_tracked';
    if (!sessionStorage.getItem(sessionKey)) {
      sendEvent('pageview');
      sessionStorage.setItem(sessionKey, '1');
    }

    // 2. Taklifnoma qulfi surilganda (ochilganda) "unlock" yuborish
    const unlockKey = 'taklifnoma_unlock_tracked';
    const checkUnlockInterval = setInterval(() => {
      if (!document.body.classList.contains('is-locked')) {
        clearInterval(checkUnlockInterval);
        if (!sessionStorage.getItem(unlockKey)) {
          sendEvent('unlock');
          sessionStorage.setItem(unlockKey, '1');
        }
      }
    }, 400);

    // 3. Musiqa birinchi bor yangraganda "music_play" yuborish
    const audioEl = document.getElementById('wedding-audio');
    if (audioEl) {
      const musicTrackedKey = 'taklifnoma_music_tracked';
      audioEl.addEventListener('play', () => {
        if (!sessionStorage.getItem(musicTrackedKey)) {
          sendEvent('music_play');
          sessionStorage.setItem(musicTrackedKey, '1');
        }
      }, { once: true });
    }

    // 4. RSVP Formasini kuzatish va serverga yuborish
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
      rsvpForm.addEventListener('submit', (e) => {
        try {
          const nameInput = document.getElementById('rsvp-name');
          const attendSelect = document.getElementById('rsvp-attendance');
          const countInput = document.getElementById('rsvp-count');
          const wishInput = document.getElementById('rsvp-wishes');

          const rsvpPayload = {
            name: nameInput ? nameInput.value : 'Nomaʼlum mehmon',
            attendance: attendSelect ? attendSelect.value : 'yes',
            guests: countInput ? parseInt(countInput.value) || 1 : 1,
            wishes: wishInput ? wishInput.value : ''
          };

          fetch(`${API_BASE}/rsvp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rsvpPayload)
          }).catch(() => {});
        } catch (_) {}
      });
    }
  });

  // Global ob'ekt sifatida eksport qilish
  window.TaklifnomaTracker = {
    sendEvent: sendEvent,
    getApiBase: getApiBase
  };
})();
