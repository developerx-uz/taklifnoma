/**
 * Farrux & Marjona - Main Application Interactions (js/app.js)
 * Features:
 * - Toast notification system
 * - Confetti celebration particle canvas
 * - RSVP form submission with LocalStorage persistence
 * - Guestbook wishes system with LocalStorage persistence
 * - Lightbox photo gallery viewer
 * - Location copy & Web Share API
 */

// =============================================================================
// 1. TOAST NOTIFICATION UTILITY
// =============================================================================
let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// =============================================================================
// 2. CONFETTI CELEBRATION CANVAS
// =============================================================================
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiPieces = [];
  const colors = ['#d4af37', '#f3e5ab', '#ffffff', '#60a5fa', '#93c5fd', '#e2e8f0'];

  for (let i = 0; i < 90; i++) {
    confettiPieces.push({
      x: canvas.width / 2,
      y: canvas.height * 0.65,
      r: Math.random() * 5 + 3,
      dx: (Math.random() - 0.5) * 12,
      dy: (Math.random() - 0.9) * 14,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10,
      tiltSpeed: Math.random() * 0.1 + 0.05,
      opacity: 1
    });
  }

  let animationFrame;
  const startTime = Date.now();

  function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elapsed = Date.now() - startTime;

    confettiPieces.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      p.dy += 0.22; // gravity
      p.tilt += p.tiltSpeed;
      if (elapsed > 1800) {
        p.opacity -= 0.02;
      }

      ctx.beginPath();
      ctx.lineWidth = p.r / 2;
      ctx.strokeStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.moveTo(p.x + p.tilt + p.r, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
      ctx.stroke();
    });

    if (elapsed < 3500) {
      animationFrame = requestAnimationFrame(renderConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  renderConfetti();
}

// =============================================================================
// 3. RSVP FORM SUBMISSION
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpSuccess = document.getElementById('rsvp-success');

  // Restore previous submission state if exists
  try {
    const savedRSVP = localStorage.getItem('wedding_rsvp');
    if (savedRSVP && rsvpForm && rsvpSuccess) {
      rsvpForm.style.display = 'none';
      rsvpSuccess.style.display = 'block';
    }
  } catch (_) {}

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('guest-name').value.trim();
      const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'yes';
      const guestSide = document.getElementById('guest-side').value;

      const rsvpData = {
        name: guestName,
        attendance: attendance,
        side: guestSide,
        submittedAt: new Date().toISOString()
      };

      try {
        localStorage.setItem('wedding_rsvp', JSON.stringify(rsvpData));
      } catch (_) {}

      let guestsCount = 1;
      if (attendance.includes('Mehmon bilan') || attendance.includes('mehmon')) {
        guestsCount = 2;
      } else if (attendance.includes('Kela olmayman') || attendance.includes('kela olmayman')) {
        guestsCount = 0;
      }

      // 1. Send RSVP to Server API
      fetch(`${getWeddingApiBase()}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: guestName || 'Hurmatli Mehmon',
          side: guestSide,
          attendance: attendance,
          guests: guestsCount
        })
      }).catch(() => {});

      // 2. Hide form, show celebration
      rsvpForm.style.display = 'none';
      if (rsvpSuccess) rsvpSuccess.style.display = 'block';
      launchConfetti();

      showToast(currentLang === 'ru' ? 'Ваш ответ успешно принят!' : currentLang === 'en' ? 'RSVP received with thanks!' : 'Javobingiz muvaffaqiyatli qabul qilindi!');
    });
  }
});

// =============================================================================
// 4. GUESTBOOK / MEHMONLAR KITOBI (SERVER BILAN BOG'LANGAN)
// =============================================================================
function getWeddingApiBase() {
  const host = window.location.hostname;
  if (host === 'developerx.uz' || host === 'www.developerx.uz') {
    return '/farrux-marjona-nikoh-toyi/api';
  } else if (host === 'localhost' || host === '127.0.0.1') {
    return window.location.port === '8097' ? '/api' : 'https://developerx.uz/farrux-marjona-nikoh-toyi/api';
  } else {
    return 'https://developerx.uz/farrux-marjona-nikoh-toyi/api';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

async function loadWishes() {
  const wishesList = document.getElementById('wishes-list');
  if (!wishesList) return;

  let wishes = [];
  try {
    const res = await fetch(`${getWeddingApiBase()}/wishes`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.wishes) && data.wishes.length > 0) {
        wishes = data.wishes;
      }
    }
  } catch (_) {}

  // Agar server bo'sh bo'lsa yoki oflayn bo'lsa, localStorage'dan tekshirish
  if (wishes.length === 0) {
    try {
      wishes = JSON.parse(localStorage.getItem('wedding_wishes')) || [];
    } catch (_) {
      wishes = [];
    }
  }

  wishesList.innerHTML = '';

  if (wishes.length === 0) {
    const emptyEl = document.createElement('div');
    emptyEl.className = 'empty-wishes-state';
    const lang = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'uz';
    const emptyMsg = (typeof translations !== 'undefined' && translations[lang]?.no_wishes_yet)
      ? translations[lang].no_wishes_yet
      : "Hozircha tilaklar yo‘q. Birinchi bo‘lib samimiy tilagingizni qoldiring! 💌";
    emptyEl.innerHTML = `
      <div class="empty-icon"><i class="fa-regular fa-envelope-open"></i></div>
      <p class="empty-text" data-key="no_wishes_yet">${emptyMsg}</p>
    `;
    wishesList.appendChild(emptyEl);
    return;
  }

  wishes.forEach(item => {
    const wishEl = document.createElement('div');
    wishEl.className = 'wish-item';
    const authorName = item.author || 'Mehmon';
    const wishTime = item.created_at ? item.created_at.slice(5, 16) : (item.time || 'Yangi');
    wishEl.innerHTML = `
      <div class="wish-header">
        <span class="wish-name"><i class="fa-regular fa-user" style="margin-right: 5px; opacity: 0.7;"></i>${escapeHtml(authorName)}</span>
        <span class="wish-date">${escapeHtml(wishTime)}</span>
      </div>
      <p class="wish-body">${escapeHtml(item.text)}</p>
    `;
    wishesList.appendChild(wishEl);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadWishes();

  const wishForm = document.getElementById('wish-form');
  if (wishForm) {
    wishForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const authorInput = document.getElementById('wish-author');
      const textInput = document.getElementById('wish-text');
      const author = authorInput ? authorInput.value.trim() : '';
      const text = textInput ? textInput.value.trim() : '';

      if (!author || !text) return;

      // 1. Maydonlarni darhol tozalash
      if (authorInput) authorInput.value = '';
      if (textInput) textInput.value = '';

      // 2. Lokal saqlash (tezkor UI javobi uchun)
      let stored = [];
      try {
        stored = JSON.parse(localStorage.getItem('wedding_wishes')) || [];
      } catch (_) { stored = []; }
      stored.unshift({ author: author, text: text, time: "Hozirgina" });
      try { localStorage.setItem('wedding_wishes', JSON.stringify(stored)); } catch (_) {}

      // 3. Markaziy Serverga yuborish
      try {
        await fetch(`${getWeddingApiBase()}/wish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ author: author, text: text })
        });
      } catch (_) {}

      // 4. Ro'yxatni yangilash va animatsiya
      loadWishes();
      launchConfetti();
      showToast(currentLang === 'ru' ? 'Пожелание добавлено!' : currentLang === 'en' ? 'Wish sent successfully!' : 'Tilagingiz qabul qilindi! Rahmat!');
    });
  }
});

// =============================================================================
// 5. LIGHTBOX GALLERY
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  const galleryItems = [
    {
      src: 'assets/images/galereya_full_1.jpg',
      caption: 'Nikoh uzuklari va baxt gullari',
      caption_ru: 'Обручальные кольца и цветы счастья',
      caption_en: 'Wedding rings & flowers of happiness'
    },
    {
      src: 'assets/images/galereya_full_2.jpg',
      caption: 'Orzular sari ilk qadam',
      caption_ru: 'Первый шаг к заветной мечте',
      caption_en: 'First step towards dreams'
    },
    {
      src: 'assets/images/galereya_full_3.jpg',
      caption: 'Farruxjon & Marjonaxon — Abadiy muhabbat',
      caption_ru: 'Фаррухджон и Маржонахон — Вечная любовь',
      caption_en: 'Farruxjon & Marjonaxon — Eternal Love'
    }
  ];

  const venueItems = [
    {
      src: 'assets/images/toyxona_full_1.jpg',
      caption: 'Sohil Tantanalar Saroyi — Tashqi fasad va tantanali kirish',
      caption_ru: 'Дворец торжеств «Сохил» — Фасад и парадный вход',
      caption_en: 'Sohil Celebration Palace — Exterior facade & grand entrance'
    },
    {
      src: 'assets/images/toyxona_full_2.jpg',
      caption: 'Sohil Saroyi — Shohona zal va billur qandillar',
      caption_ru: 'Дворец «Сохил» — Роскошный зал и хрустальные люстры',
      caption_en: 'Sohil Palace — Luxurious ballroom & crystal chandeliers'
    },
    {
      src: 'assets/images/toyxona_full_3.jpg',
      caption: 'Kelin-kuyov shohsupasi va tantanali yo‘lak',
      caption_ru: 'Подиум жениха и невесты и торжественная дорожка',
      caption_en: 'Bride & Groom royal dais and celebration walkway'
    },
    {
      src: 'assets/images/toyxona_full_4.jpg',
      caption: 'Tantanali bayram dasturxoni va shou sahnasi',
      caption_ru: 'Праздничный свадебный стол и сцена для торжеств',
      caption_en: 'Festive wedding banquet tables & show stage'
    }
  ];

  let currentItems = galleryItems;
  let currentIndex = 0;

  function showLightboxIndex(items, idx) {
    if (Array.isArray(items)) {
      currentItems = items;
    } else if (typeof items === 'number') {
      idx = items;
    }
    if (!currentItems || currentItems.length === 0) currentItems = galleryItems;

    if (idx < 0) idx = currentItems.length - 1;
    if (idx >= currentItems.length) idx = 0;
    currentIndex = idx;

    const item = currentItems[idx];
    if (lightboxImg && item) {
      lightboxImg.style.opacity = '0.5';
      lightboxImg.src = item.src;
      lightboxImg.onload = () => {
        lightboxImg.style.opacity = '1';
      };
    }
    if (lightboxCaption && item) {
      let cap = item.caption;
      if (typeof currentLang !== 'undefined') {
        if (currentLang === 'ru' && item.caption_ru) cap = item.caption_ru;
        else if (currentLang === 'en' && item.caption_en) cap = item.caption_en;
      }
      lightboxCaption.textContent = cap;
    }
  }

  // 1. Connect click on .gallery-hitbox (New 1080x2200 card hitboxes)
  document.querySelectorAll('.gallery-hitbox').forEach((hitbox) => {
    hitbox.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(hitbox.getAttribute('data-index') || '0', 10);
      showLightboxIndex(galleryItems, idx);
      lightboxModal?.classList.add('active');
    });

    hitbox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const idx = parseInt(hitbox.getAttribute('data-index') || '0', 10);
        showLightboxIndex(galleryItems, idx);
        lightboxModal?.classList.add('active');
      }
    });
  });

  // 2. Connect click on .venue-hitbox (New 1080x2200 To'yxona card hitboxes)
  document.querySelectorAll('.venue-hitbox').forEach((hitbox) => {
    hitbox.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(hitbox.getAttribute('data-index') || '0', 10);
      showLightboxIndex(venueItems, idx);
      lightboxModal?.classList.add('active');
    });

    hitbox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const idx = parseInt(hitbox.getAttribute('data-index') || '0', 10);
        showLightboxIndex(venueItems, idx);
        lightboxModal?.classList.add('active');
      }
    });
  });

  // 3. Also support old .gallery-card / .venue-card if any exist
  document.querySelectorAll('.gallery-card').forEach((card, i) => {
    card.addEventListener('click', () => {
      showLightboxIndex(galleryItems, i % galleryItems.length);
      lightboxModal?.classList.add('active');
    });
  });

  // 4. Close button
  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal?.classList.remove('active');
    });
  }

  // 5. Prev & Next buttons
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightboxIndex(currentItems, currentIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightboxIndex(currentItems, currentIndex + 1);
    });
  }

  // 6. Click outside image to close
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  // 7. Keyboard navigation (Esc, ArrowLeft, ArrowRight)
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal?.classList.contains('active')) return;
    if (e.key === 'Escape') {
      lightboxModal.classList.remove('active');
    } else if (e.key === 'ArrowLeft') {
      showLightboxIndex(currentItems, currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showLightboxIndex(currentItems, currentIndex + 1);
    }
  });

  // 8. Mobile Touch Swipe gesture
  let touchStartX = 0;
  lightboxModal?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightboxModal?.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        showLightboxIndex(currentItems, currentIndex - 1); // Swipe right -> prev
      } else {
        showLightboxIndex(currentItems, currentIndex + 1); // Swipe left -> next
      }
    }
  }, { passive: true });
});

// =============================================================================
// 6. COPY ADDRESS & SHARE INVITATION
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  const copyAddressBtn = document.getElementById('copy-address-btn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const address = "Termiz shahri, Fidokor ko'chasi 90G, Sohil to'yxonasi";
      if (navigator.clipboard) {
        navigator.clipboard.writeText(address).then(() => {
          showToast(currentLang === 'ru' ? 'Адрес скопирован в буфер!' : currentLang === 'en' ? 'Address copied to clipboard!' : 'Manzil nusxalandi!');
        }).catch(() => {
          showToast(address);
        });
      } else {
        showToast(address);
      }
    });
  }

  function shareInvitation() {
    const shareData = {
      title: "Farruxjon & Marjonaxon | To'y Taklifnomasi",
      text: "Farruxjon va Marjonaxonning nikoh to'yi munosabati bilan 'Visol oqshomi' dasturxoniga lutfan taklif etamiz! 30-Oktyabr, 2026",
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast(currentLang === 'ru' ? 'Ссылка скопирована в буфер!' : currentLang === 'en' ? 'Invitation link copied!' : 'Taklifnoma havolasi nusxalandi!');
      });
    }
  }

  document.getElementById('share-btn')?.addEventListener('click', shareInvitation);
  document.getElementById('footer-share-btn')?.addEventListener('click', shareInvitation);
});
