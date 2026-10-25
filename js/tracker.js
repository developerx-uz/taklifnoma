/**
 * Farrux & Marjona Nikoh To'yi - Mehmonlarni hisoblash, Jonli Onlayn va Tilaklar skripti (js/tracker.js)
 */

(function () {
  'use strict';

  function getApiBase() {
    const host = window.location.hostname;
    if (host === 'developerx.uz' || host === 'www.developerx.uz') {
      return '/farrux-marjona-nikoh-toyi/api';
    } else if (host === 'localhost' || host === '127.0.0.1') {
      return window.location.port === '8097' ? '/api' : 'https://developerx.uz/farrux-marjona-nikoh-toyi/api';
    } else {
      return 'https://developerx.uz/farrux-marjona-nikoh-toyi/api';
    }
  }

  const API_BASE = getApiBase();

  // Har bir mehmon uchun yagona sessiya ID yaratish
  let sessionId = sessionStorage.getItem('taklifnoma_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    sessionStorage.setItem('taklifnoma_session_id', sessionId);
  }

  function sendEvent(action, extraData) {
    try {
      const payload = {
        action: action || 'pageview',
        session_id: sessionId,
        user_agent: navigator.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`,
        lang: document.documentElement.lang || navigator.language || 'uz',
        referrer: document.referrer || '',
        ...extraData
      };

      const url = `${API_BASE}/track`;

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {});
    } catch (_) {}
  }


  // ===========================================================================
  // 1. TILAKLARNI SERVERDAN YUKLASH VA CHIQARISH
  // ===========================================================================
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async function fetchAndRenderWishes() {
    const wishesList = document.getElementById('wishes-list');
    if (!wishesList) return;

    try {
      const res = await fetch(`${API_BASE}/wishes`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.wishes && data.wishes.length > 0) {
          wishesList.innerHTML = '';
          data.wishes.forEach(item => {
            const wishEl = document.createElement('div');
            wishEl.className = 'wish-item';
            wishEl.innerHTML = `
              <div class="wish-header">
                <span class="wish-name"><i class="fa-regular fa-user" style="margin-right: 5px; opacity: 0.7;"></i>${escapeHtml(item.author)}</span>
                <span class="wish-date">${escapeHtml(item.created_at ? item.created_at.slice(5, 16) : 'Hozirgina')}</span>
              </div>
              <p class="wish-body">${escapeHtml(item.text)}</p>
            `;
            wishesList.appendChild(wishEl);
          });
          return;
        }
      }
    } catch (_) {}
  }

  // ===========================================================================
  // 2. DOM YUKLANGANDAGI TINGLOVCHILAR
  // ===========================================================================
  window.addEventListener('DOMContentLoaded', () => {
    // A) Birinchi marta kirganda Pageview
    sendEvent('pageview');

    // B) Jonli Onlayn kuzatuvchilar uchun Heartbeat (har 20 soniyada)
    setInterval(() => {
      sendEvent('heartbeat');
    }, 20000);

    // C) Tilaklarni serverdan yuklash
    fetchAndRenderWishes();

    // D) Qulf ochilganda
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

    // E) Musiqa tinglanganda
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

    // F) RSVP FORMASI — Ishtirokni to'liq serverga yozish
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
      rsvpForm.addEventListener('submit', (e) => {
        try {
          const guestName = document.getElementById('guest-name')?.value.trim();
          const guestSide = document.getElementById('guest-side')?.value || 'Kuyov tomondan';
          const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'Ha, albatta boraman!';

          let guestsCount = 1;
          if (attendance.includes('Mehmon bilan') || attendance.includes('mehmon')) {
            guestsCount = 2;
          } else if (attendance.includes('Kela olmayman') || attendance.includes('kela olmayman')) {
            guestsCount = 0;
          }

          const rsvpPayload = {
            name: guestName || 'Hurmatli Mehmon',
            side: guestSide,
            attendance: attendance,
            guests: guestsCount
          };

          fetch(`${API_BASE}/rsvp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rsvpPayload)
          }).catch(() => {});
        } catch (_) {}
      });
    }

    // G) TILAKLAR FORMASI — Serverga yozish va darhol ro'yxatga qo'shish
    const wishForm = document.getElementById('wish-form');
    if (wishForm) {
      wishForm.addEventListener('submit', (e) => {
        try {
          const authorInput = document.getElementById('wish-author');
          const textInput = document.getElementById('wish-text');
          const author = authorInput ? authorInput.value.trim() : '';
          const text = textInput ? textInput.value.trim() : '';

          if (!author || !text) return;

          fetch(`${API_BASE}/wish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author: author, text: text })
          })
          .then(res => res.json())
          .then(saved => {
            fetchAndRenderWishes();
          })
          .catch(() => {});
        } catch (_) {}
      });
    }
  });

  window.TaklifnomaTracker = {
    sendEvent: sendEvent,
    fetchAndRenderWishes: fetchAndRenderWishes,
    getApiBase: getApiBase
  };
})();
