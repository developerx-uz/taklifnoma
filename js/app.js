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

      // Hide form, show celebration
      rsvpForm.style.display = 'none';
      if (rsvpSuccess) rsvpSuccess.style.display = 'block';
      launchConfetti();

      showToast(currentLang === 'ru' ? 'Ваш ответ успешно принят!' : currentLang === 'en' ? 'RSVP received with thanks!' : 'Javobingiz muvaffaqiyatli qabul qilindi!');
    });
  }
});

// =============================================================================
// 4. GUESTBOOK / MEHMONLAR KITOBI
// =============================================================================
const initialWishes = [
  {
    author: "Elnur & Jasmina",
    text: "Farruxjon & Marjonaxon, baxtingizga aslo ko'z tegmasin! Ilohim qo'sha qaringlar, xonadoningizdan fayz arimasin! 🎉",
    time: "20-Oktyabr"
  },
  {
    author: "Dilnoza opa",
    text: "Ikkala yoshga ham tuganmas muhabbat va quvonch tilayman! Mustahkam va totuv oila bo'linglar! ✨",
    time: "20-Oktyabr"
  },
  {
    author: "Sardor & Shahnoza",
    text: "Tantanangiz muborak bo'lsin, eng chiroyli juftlik! Baxtli onlar abadiy bo'lsin! 💍",
    time: "19-Oktyabr"
  }
];

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function loadWishes() {
  const wishesList = document.getElementById('wishes-list');
  if (!wishesList) return;

  let stored = [];
  try {
    stored = JSON.parse(localStorage.getItem('wedding_wishes')) || [];
  } catch (err) {
    stored = [];
  }

  const allWishes = [...stored, ...initialWishes];
  wishesList.innerHTML = '';

  allWishes.forEach(item => {
    const wishEl = document.createElement('div');
    wishEl.className = 'wish-item';
    wishEl.innerHTML = `
      <div class="wish-header">
        <span class="wish-name">${escapeHtml(item.author)}</span>
        <span class="wish-date">${escapeHtml(item.time || 'Yangi')}</span>
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
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = document.getElementById('wish-author').value.trim();
      const text = document.getElementById('wish-text').value.trim();

      if (!author || !text) return;

      let stored = [];
      try {
        stored = JSON.parse(localStorage.getItem('wedding_wishes')) || [];
      } catch (err) {
        stored = [];
      }

      const newWish = {
        author: author,
        text: text,
        time: "Hozirgina"
      };

      stored.unshift(newWish);
      try {
        localStorage.setItem('wedding_wishes', JSON.stringify(stored));
      } catch (_) {}

      document.getElementById('wish-author').value = '';
      document.getElementById('wish-text').value = '';

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
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightboxModal && lightboxImg) {
    document.querySelectorAll('.gallery-card img').forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxModal.classList.add('active');
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        lightboxModal.classList.remove('active');
      });
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        lightboxModal.classList.remove('active');
      }
    });
  }
});

// =============================================================================
// 6. COPY ADDRESS & SHARE INVITATION
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  const copyAddressBtn = document.getElementById('copy-address-btn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const address = "Sohil Tantanalar Saroyi, Toshkent viloyati, Yangiyo'l tumani";
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
