/**
 * Farrux & Marjona - Countdown Timer & Wedding State Switcher (js/countdown.js)
 * Target Date: 30-Oktyabr 2026, 18:00 (Tashkent Time, UTC+5)
 *
 * 2 ta holat (States):
 * 1. TO'Y BOSHLANISHIDAN OLDIN: Ortga hisoblash (Kun, Soat, Daqiqa, Soniya) va Taqvim
 * 2. TO'Y VAQTIDA: To'y boshlanganda chiquvchi hashamatli tabrik kartasi
 */

const weddingTargetDate = new Date('2026-10-30T18:00:00+05:00').getTime();

function updateCountdown() {
  const vaqtBefore = document.getElementById('vaqt-before');
  const vaqtStarted = document.getElementById('vaqt-started');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  // Sinov uchun parametr (?toy=boshlandi yoki ?state=started)
  const urlParams = new URLSearchParams(window.location.search);
  const forceStarted = urlParams.get('toy') === 'boshlandi' || urlParams.get('state') === 'started' || window.__forceWeddingStarted;

  const now = new Date().getTime();
  const diff = weddingTargetDate - now;

  if (diff <= 0 || forceStarted) {
    // 2-HOLAT: TO'Y VAQTIDA (TO'Y BOSHLANDI)
    if (vaqtBefore) vaqtBefore.style.display = 'none';
    if (vaqtStarted) vaqtStarted.style.display = 'block';
    return;
  }

  // 1-HOLAT: TO'Y BOSHLANISHIDAN OLDIN
  if (vaqtBefore) vaqtBefore.style.display = 'block';
  if (vaqtStarted) vaqtStarted.style.display = 'none';

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');
}

// Oson sinab ko'rish uchun yordamchi funksiya:
window.setWeddingState = function(state) {
  if (state === 'started' || state === 'boshlandi') {
    window.__forceWeddingStarted = true;
  } else {
    window.__forceWeddingStarted = false;
  }
  updateCountdown();
};

function addToCalendar() {
  const title = encodeURIComponent("Farruxjon & Marjonaxon Nikoh To'yi");
  const details = encodeURIComponent("Farruxjon & Marjonaxonning nikoh to'yi tantanasi va 'Visol oqshomi' dasturxoni. Xarita: https://maps.app.goo.gl/5P1n1ZXuFCtsWy3Z6");
  const location = encodeURIComponent("Sohil tantanalar saroyi, Termiz, Fidokor ko'chasi 90G");
  const start = "20261030T130000Z"; // 18:00 Tashkent time (UTC 13:00)
  const end = "20261030T180000Z";

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  window.open(googleUrl, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();
  setInterval(updateCountdown, 1000);

  const calBtn = document.getElementById('calendar-btn');
  if (calBtn) {
    calBtn.addEventListener('click', addToCalendar);
  }
});
