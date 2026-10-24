/**
 * Farrux & Marjona - Countdown Timer & Calendar Integration (js/countdown.js)
 * Target Date: 30-Oktyabr 2026, 18:00 (Tashkent Time, UTC+5)
 */

const weddingTargetDate = new Date('2026-10-30T18:00:00+05:00').getTime();

function updateCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const now = new Date().getTime();
  const diff = weddingTargetDate - now;

  if (diff <= 0) {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');
}

function addToCalendar() {
  const title = encodeURIComponent("Farrux & Marjona Nikoh To'yi");
  const details = encodeURIComponent("Farrux & Marjonaning nikoh to'yi tantanasi va 'Visol oqshomi' dasturxoni.");
  const location = encodeURIComponent("Sohil Tantanalar Saroyi, Yangiyo'l");
  const start = "20261030T130000Z"; // 18:00 Tashkent time
  const end = "20261030T180000Z";

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  window.open(googleUrl, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();
  setInterval(updateCountdown, 1000);

  const calBtn = document.getElementById('add-calendar-btn');
  if (calBtn) {
    calBtn.addEventListener('click', addToCalendar);
  }
});
