/**
 * Farrux & Marjona - Wedding Invitation Interactive Script
 * Features:
 * - Multi-language translation (UZ, RU, EN)
 * - Romantic Wedding Audio (Procedural Synthesizer + MP3 fallback)
 * - Real-time Countdown Timer (30-Oktyabr, 2026 18:00)
 * - Google Calendar Integration
 * - RSVP Form with Confetti Celebration
 * - Guestbook (LocalStorage persistence)
 * - Lightbox Gallery Viewer
 * - Location Copy & Share
 */

// =============================================================================
// 1. MULTI-LANGUAGE TRANSLATION DICTIONARY
// =============================================================================
const translations = {
  uz: {
    nav_home: `Bosh sahifa`,
    nav_biz: `Biz`,
    nav_invite: `Taklifnoma`,
    nav_countdown: `Sana`,
    nav_schedule: `Dastur`,
    nav_gallery: `Galereya`,
    nav_venue: `To'yxona`,
    nav_location: `Manzil`,
    nav_rsvp: `RSVP`,
    nav_guestbook: `Tilaklar`,
    hero_incoming: `SIZGA TAKLIFNOMA KELDI`,
    hero_quote: `"Va U ularning qalblarini sevgi ila birlashtirdi"`,
    hero_source: `Anfol surasi, 63`,
    btn_unlock: `SURIB OCHISH`,
    wedding_tag: `NIKOH TO'YI`,
    open_btn: `Taklifnomani ochish`,
    biz_title: `Biz`,
    biz_text: `AZIZ VA QADRLI INSONLAR!<br>SIZNI TO‘YIMIZGA TAKLIF QILISHDAN MAMNUNMIZ`,
    card_title: `AZIZ MEHMONLAR`,
    card_message: `Sizni aziz farzandlarimiz ning nikoh to'yi munosabati bilan yoziladigan <strong class="highlight-visol">"Visol oqshomi"</strong> dasturxoniga lutfan taklif etamiz.`,
    card_parents: `Hurmat bilan: Ota-onalar`,
    sana_label: `SANA`,
    countdown_title: `TO‘YIMIZGA QOLGAN VAQT`,
    timer_days: `Kun`,
    timer_hours: `Soat`,
    timer_minutes: `Daqiqa`,
    timer_seconds: `Soniya`,
    cal_month: `OKTYABR 2026`,
    cal_start_time: `BOSHLANISHI 18:00`,
    add_calendar: `Taqvimga qo‘shish`,
    schedule_title: `KUN TARTIBI`,
    schedule_subtitle: `Marosim va bayram vaqtlari`,
    sch_1: `MEHMONLARNI KUTIB OLISH`,
    sch_1_desc: `Yorqin tabassumlar va yoqimli musiqa ostida uchrashuv`,
    sch_2: `NIKOH MAROSIMI`,
    sch_2_desc: `Kelin va kuyovning qutlug' qadamlari va nikoh tantanasi`,
    sch_3: `ZIYOFAT VA TABRIKLAR`,
    sch_3_desc: `Shohona dasturxon, qutlovlar va unutilmas shou`,
    sch_4: `KECHANING YAKUNI`,
    sch_4_desc: `Kelin-kuyovga samimiy oq yo'l va bayram xotimasi`,
    gallery_sub: `BIZNING XOTIRALARIMIZ`,
    gallery_title: `Xotira Galereyasi`,
    venue_sub: `TANTANALI MANZIL`,
    venue_title: `To'yxona`,
    venue_type: `Tantanalar Saroyi`,
    venue_detail: `Har bir lahza unutilmas bo‘ladigan go‘zal saroy`,
    loc_title: `Joylashuv`,
    loc_subtitle: `Sevgi va baxt uchrashadigan manzil`,
    address_text: `Toshkent viloyati, Yangiyo'l tumani`,
    btn_google_map: `Google Xaritada ochish`,
    btn_copy_address: `Manzilni nusxalash`,
    rsvp_title: `Iltimos, ishtirokingizni tasdiqlang`,
    rsvp_subtitle: `BIZ BILAN BO‘LING`,
    label_name: `Mehmon ismi:`,
    ph_name: `To‘liq ismingizni kiriting`,
    label_attend: `Qatnashasizmi?`,
    opt_attend_yes: `Ha, albatta boraman! ✨`,
    opt_attend_plus: `Ha, mehmon bilan boraman 👥`,
    opt_attend_no: `Afsus, kela olmayman 💌`,
    opt_attend_maybe: `Hali aniq emas 🤔`,
    label_side: `Kim tomondan mehmonsiz?`,
    side_groom: `Kuyov tomondan`,
    side_bride: `Kelin tomondan`,
    side_friends: `Qadrdon do‘stlar`,
    side_colleagues: `Hamkasblar / Boshqa`,
    btn_rsvp_send: `Javob yuborish`,
    rsvp_thanks: `Rahmat, javobingiz qabul qilindi!`,
    rsvp_welcome: `Sizni to'yimizda ko'rishdan bag'oyat mamnunmiz!`,
    gb_title: `Mehmonlar Kitobi`,
    gb_subtitle: `Kelin va kuyovga samimiy tilaklaringiz`,
    ph_wish: `Xabaringizni yozing...`,
    btn_send_wish: `Tilak yuborish`,
    footer_sub: `SIZNING ISHTIROKINGIZ...`,
    footer_quote: `biz uchun eng qimmatli sovg'a`,
    share_invite: `Taklifnomani ulashish`,
    music_tooltip: `Musiqani yoqish 🎵`
  },
  ru: {
    nav_home: `Главная`,
    nav_biz: `Мы`,
    nav_invite: `Приглашение`,
    nav_countdown: `Дата`,
    nav_schedule: `Программа`,
    nav_gallery: `Галерея`,
    nav_venue: `Банкетный зал`,
    nav_location: `Локация`,
    nav_rsvp: `RSVP`,
    nav_guestbook: `Пожелания`,
    hero_incoming: `ВАМ ПРИШЛО ПРИГЛАШЕНИЕ`,
    hero_quote: `"И Он соединил их сердца любовью"`,
    hero_source: `Сура Аль-Анфаль, 63`,
    btn_unlock: `ПРОВЕДИТЕ ДЛЯ ОТКРЫТИЯ`,
    wedding_tag: `СВАДЕБНОЕ ТОРЖЕСТВО`,
    open_btn: `Открыть приглашение`,
    biz_title: `Мы`,
    biz_text: `ДОРОГИЕ И УВАЖАЕМЫЕ ГОСТИ!<br>МЫ СЧАСТЛИВЫ ПРИГЛАСИТЬ ВАС НА НАШУ СВАДЬБУ`,
    card_title: `ДОРОГИЕ ГОСТИ`,
    card_message: `С огромной радостью приглашаем вас разделить наше счастье по случаю бракосочетания наших дорогих детей на торжественном вечере <strong class="highlight-visol">"Висол окшоми"</strong>.`,
    card_parents: `С уважением: Родители`,
    sana_label: `ДАТА`,
    countdown_title: `ДО НАШЕЙ СВАДЬБЫ ОСТАЛОСЬ`,
    timer_days: `Дней`,
    timer_hours: `Часов`,
    timer_minutes: `Минут`,
    timer_seconds: `Секунд`,
    cal_month: `ОКТЯБРЬ 2026`,
    cal_start_time: `НАЧАЛО В 18:00`,
    add_calendar: `Добавить в календарь`,
    schedule_title: `ПРОГРАММА ДНЯ`,
    schedule_subtitle: `Расписание свадебного дня`,
    sch_1: `ВСТРЕЧА ГОСТЕЙ`,
    sch_1_desc: `Теплые улыбки, приветственный фуршет и живая музыка`,
    sch_2: `ЦЕРЕМОНИЯ БРАКОСОЧЕТАНИЯ`,
    sch_2_desc: `Торжественный выход молодоженов и регистрация`,
    sch_3: `СВАДЕБНЫЙ БАНКЕТ`,
    sch_3_desc: `Праздничный ужин, поздравления и шоу-программа`,
    sch_4: `ЗАВЕРШЕНИЕ ВЕЧЕРА`,
    sch_4_desc: `Искренние пожелания и завершение прекрасного вечера`,
    gallery_sub: `НАШИ ВОСПОМИНАНИЯ`,
    gallery_title: `Галерея воспоминаний`,
    venue_sub: `МЕСТО ПРОВЕДЕНИЯ`,
    venue_title: `Банкетный Зал`,
    venue_type: `Дворец Торжеств`,
    venue_detail: `Роскошный дворец, где каждое мгновение незабываемо`,
    loc_title: `Локация`,
    loc_subtitle: `Место встречи любви и счастья`,
    address_text: `Ташкентская область, Янгиюльский район`,
    btn_google_map: `Открыть в Google Картах`,
    btn_copy_address: `Скопировать адрес`,
    rsvp_title: `Пожалуйста, подтвердите присутствие`,
    rsvp_subtitle: `РАЗДЕЛИТЕ С НАМИ НАШ ПРАЗДНИК`,
    label_name: `Имя гостя:`,
    ph_name: `Введите ваше полное имя`,
    label_attend: `Сможете ли вы прийти?`,
    opt_attend_yes: `Да, обязательно буду! ✨`,
    opt_attend_plus: `Да, буду с гостем 👥`,
    opt_attend_no: `К сожалению, не смогу 💌`,
    opt_attend_maybe: `Пока точно не знаю 🤔`,
    label_side: `С чьей стороны гость?`,
    side_groom: `Со стороны жениха`,
    side_bride: `Со стороны невесты`,
    side_friends: `Близкие друзья`,
    side_colleagues: `Коллеги / Другое`,
    btn_rsvp_send: `Отправить ответ`,
    rsvp_thanks: `Спасибо, ваш ответ принят!`,
    rsvp_welcome: `Будем очень рады видеть вас на нашем празднике!`,
    gb_title: `Книга пожеланий`,
    gb_subtitle: `Ваши теплые пожелания молодоженам`,
    ph_wish: `Напишите ваше пожелание...`,
    btn_send_wish: `Отправить пожелание`,
    footer_sub: `ВАШЕ ПРИСУТСТВИЕ...`,
    footer_quote: `для нас самый ценный подарок`,
    share_invite: `Поделиться приглашением`,
    music_tooltip: `Включить музыку 🎵`
  },
  en: {
    nav_home: `Home`,
    nav_biz: `Story`,
    nav_invite: `Invitation`,
    nav_countdown: `Date`,
    nav_schedule: `Schedule`,
    nav_gallery: `Gallery`,
    nav_venue: `Venue`,
    nav_location: `Location`,
    nav_rsvp: `RSVP`,
    nav_guestbook: `Wishes`,
    hero_incoming: `YOU RECEIVED AN INVITATION`,
    hero_quote: `"And He brought together their hearts with love"`,
    hero_source: `Surah Al-Anfal, 63`,
    btn_unlock: `SLIDE TO UNLOCK`,
    wedding_tag: `WEDDING CELEBRATION`,
    open_btn: `Open Invitation`,
    biz_title: `Us`,
    biz_text: `DEAR AND RESPECTED GUESTS!<br>WE ARE DELIGHTED TO INVITE YOU TO OUR WEDDING`,
    card_title: `HONORED GUESTS`,
    card_message: `We cordially invite you to celebrate the joyous union and wedding gala of our beloved children <strong class="highlight-visol">Farrux & Marjona</strong>.`,
    card_parents: `With love & respect: Parents`,
    sana_label: `DATE`,
    countdown_title: `COUNTDOWN TO OUR WEDDING`,
    timer_days: `Days`,
    timer_hours: `Hours`,
    timer_minutes: `Mins`,
    timer_seconds: `Secs`,
    cal_month: `OCTOBER 2026`,
    cal_start_time: `STARTING AT 18:00`,
    add_calendar: `Add to Calendar`,
    schedule_title: `EVENT SCHEDULE`,
    schedule_subtitle: `Timeline of our celebration`,
    sch_1: `GUEST WELCOME & ARRIVAL`,
    sch_1_desc: `Warm greetings, champagne reception and pleasant melody`,
    sch_2: `WEDDING CEREMONY`,
    sch_2_desc: `Grand entrance of bride & groom and marriage vows`,
    sch_3: `FESTIVE BANQUET & TOASTS`,
    sch_3_desc: `Royal dinner, congratulations, music and dancing`,
    sch_4: `CELEBRATION FINALE`,
    sch_4_desc: `Heartfelt farewell wishes to the newly-weds`,
    gallery_sub: `OUR CHERISHED MOMENTS`,
    gallery_title: `Memory Gallery`,
    venue_sub: `WEDDING VENUE`,
    venue_title: `Banquet Palace`,
    venue_type: `Grand Celebrations Palace`,
    venue_detail: `A breathtaking palace where magical memories are made`,
    loc_title: `Location`,
    loc_subtitle: `Where love and happiness meet`,
    address_text: `Tashkent Region, Yangiyul District`,
    btn_google_map: `Open in Google Maps`,
    btn_copy_address: `Copy Address`,
    rsvp_title: `Please confirm your attendance`,
    rsvp_subtitle: `BE WITH US ON OUR SPECIAL DAY`,
    label_name: `Guest Name:`,
    ph_name: `Enter your full name`,
    label_attend: `Will you attend?`,
    opt_attend_yes: `Yes, I will attend! ✨`,
    opt_attend_plus: `Yes, attending with a guest 👥`,
    opt_attend_no: `Sadly cannot attend 💌`,
    opt_attend_maybe: `Not sure yet 🤔`,
    label_side: `Which side are you from?`,
    side_groom: `Groom's Side`,
    side_bride: `Bride's Side`,
    side_friends: `Close Friends`,
    side_colleagues: `Colleagues / Other`,
    btn_rsvp_send: `Submit Response`,
    rsvp_thanks: `Thank you, response received!`,
    rsvp_welcome: `We truly look forward to seeing you at our wedding!`,
    gb_title: `Guestbook`,
    gb_subtitle: `Warm wishes for bride & groom`,
    ph_wish: `Write your heartfelt message...`,
    btn_send_wish: `Send Wish`,
    footer_sub: `YOUR PRESENCE...`,
    footer_quote: `is the greatest gift of all`,
    share_invite: `Share Invitation`,
    music_tooltip: `Play Music 🎵`
  }
};

let currentLang = 'uz';

function switchLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  
  // Update button active states
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  const t = translations[lang];

  // Update elements with data-key
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.dataset.key;
    if (t[key] !== undefined) {
      if (key === 'card_message' || key === 'biz_text') {
        el.innerHTML = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-key-ph]').forEach(el => {
    const key = el.dataset.keyPh;
    if (t[key] !== undefined) {
      el.placeholder = t[key];
    }
  });

  localStorage.setItem('wedding_lang', lang);
}


// =============================================================================
// 2. PROCEDURAL ROMANTIC WEDDING AUDIO SYNTHESIZER & MP3 AUDIO PLAYER
// =============================================================================
let audioCtx = null;
let isAudioPlaying = false;
let synthInterval = null;

const audioElement = document.getElementById('wedding-audio');
const vinylDisc = document.getElementById('vinyl-disc');
const floatingMusic = document.getElementById('floating-music');
const soundToggleTop = document.getElementById('sound-toggle-top');
const musicTooltip = document.getElementById('music-tooltip');

// Gentle Romantic Wedding Harmony Chords (D - A - Bm - F#m - G - D - G - A)
const romanticFrequencies = [
  // Chord 1: D Major (D4, F#4, A4, D5)
  [293.66, 369.99, 440.00, 587.33],
  // Chord 2: A Major (C#4, E4, A4, E5)
  [277.18, 329.63, 440.00, 659.25],
  // Chord 3: B Minor (B3, D4, F#4, B4)
  [246.94, 293.66, 369.99, 493.88],
  // Chord 4: F# Minor (A3, C#4, F#4, C#5)
  [220.00, 277.18, 369.99, 554.37],
  // Chord 5: G Major (G3, B3, D4, G4)
  [196.00, 246.94, 293.66, 392.00],
  // Chord 6: D Major (F#3, A3, D4, A4)
  [185.00, 220.00, 293.66, 440.00],
  // Chord 7: G Major (G3, B3, D4, B4)
  [196.00, 246.94, 293.66, 493.88],
  // Chord 8: A Major (A3, C#4, E4, A4)
  [220.00, 277.18, 329.63, 440.00]
];

function initAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
}

// Procedural gentle harp/piano note generator
function playHarpNote(freq, delaySeconds, durationSeconds = 3.2) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime + delaySeconds;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  // Sine + triangle mix for soft acoustic warmth
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, now);
  
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSeconds);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(now);
  osc.stop(now + durationSeconds);
}

let chordIndex = 0;
function playNextArpeggio() {
  if (!isAudioPlaying) return;
  const chord = romanticFrequencies[chordIndex];
  chordIndex = (chordIndex + 1) % romanticFrequencies.length;
  
  // Play soft arpeggios
  chord.forEach((freq, i) => {
    playHarpNote(freq, i * 0.45, 3.5);
  });
}

function startProceduralMusic() {
  initAudioContext();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  chordIndex = 0;
  playNextArpeggio();
  if (synthInterval) clearInterval(synthInterval);
  synthInterval = setInterval(playNextArpeggio, 2200);
}

function stopProceduralMusic() {
  if (synthInterval) {
    clearInterval(synthInterval);
    synthInterval = null;
  }
}

function toggleAudio() {
  initAudioContext();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (isAudioPlaying) {
    // Stop audio
    isAudioPlaying = false;
    audioElement.pause();
    stopProceduralMusic();
    vinylDisc.classList.remove('spinning');
    soundToggleTop.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    showToast(currentLang === 'ru' ? 'Музыка выключена' : currentLang === 'en' ? 'Music paused' : 'Musiqa to‘xtatildi');
  } else {
    // Start audio
    isAudioPlaying = true;
    vinylDisc.classList.add('spinning');
    soundToggleTop.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    musicTooltip.classList.remove('show');

    // Try playing MP3 element first
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // MP3 plays successfully
      }).catch(() => {
        // Fallback to procedural soothing harp synth
        startProceduralMusic();
      });
    } else {
      startProceduralMusic();
    }
    showToast(currentLang === 'ru' ? 'Приятного прослушивания 🎵' : currentLang === 'en' ? 'Playing wedding melody 🎵' : 'Musiqa yangramoqda 🎵');
  }
}

// First click anywhere on the page starts music softly if not started
let userInteracted = false;
function handleInitialUserGesture() {
  if (!userInteracted && !isAudioPlaying) {
    userInteracted = true;
    // Auto-prompt or play
    toggleAudio();
  }
}

// =============================================================================
// 3. COUNTDOWN TIMER (30-Oktyabr 2026, 18:00 Tashkent Time)
// =============================================================================
const weddingTargetDate = new Date('2026-10-30T18:00:00+05:00').getTime();

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

function updateCountdown() {
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

  daysEl.textContent = days < 10 ? '0' + days : days;
  hoursEl.textContent = hours < 10 ? '0' + hours : hours;
  minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
  secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
}

// =============================================================================
// 4. ADD TO GOOGLE CALENDAR
// =============================================================================
const calendarBtn = document.getElementById('calendar-btn');
if (calendarBtn) {
  calendarBtn.addEventListener('click', () => {
    const title = encodeURIComponent("Farrux & Marjona Nikoh To'yi");
    const details = encodeURIComponent("Farrux va Marjonaning 'Visol oqshomi' to'y tantanasi. Sizni kutamiz!");
    const location = encodeURIComponent("Sohil Tantanalar Saroyi, Yangiyo'l");
    // Start: 2026-10-30 18:00:00 (13:00 UTC) -> 23:00 (18:00 UTC)
    const dates = "20261030T130000Z/20261030T180000Z";
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, '_blank');
  });
}

// =============================================================================
// 5. LIGHTBOX MODAL FOR GALLERY
// =============================================================================
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

document.querySelectorAll('.gallery-card').forEach(card => {
  card.addEventListener('click', () => {
    const src = card.getAttribute('data-src');
    if (src) {
      lightboxImg.src = src;
      lightboxModal.classList.add('active');
    }
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

// =============================================================================
// 6. CONFETTI ANIMATION ON RSVP SUBMIT
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
  let startTime = Date.now();

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
// 7. RSVP FORM SUBMISSION
// =============================================================================
const rsvpForm = document.getElementById('rsvp-form');
const rsvpSuccess = document.getElementById('rsvp-success');

if (rsvpForm) {
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const guestName = document.getElementById('guest-name').value.trim();
    const attendance = document.querySelector('input[name="attendance"]:checked').value;
    const guestSide = document.getElementById('guest-side').value;

    const rsvpData = {
      name: guestName,
      attendance: attendance,
      side: guestSide,
      submittedAt: new Date().toISOString()
    };

    localStorage.setItem('wedding_rsvp', JSON.stringify(rsvpData));

    // Hide form, show celebration
    rsvpForm.style.display = 'none';
    rsvpSuccess.style.display = 'block';
    launchConfetti();

    showToast(currentLang === 'ru' ? 'Ваш ответ успешно принят!' : currentLang === 'en' ? 'RSVP received with thanks!' : 'Javobingiz muvaffaqiyatli qabul qilindi!');
  });
}

// =============================================================================
// 8. GUESTBOOK / MEHMONLAR KITOBI
// =============================================================================
const wishForm = document.getElementById('wish-form');
const wishesList = document.getElementById('wishes-list');

// Default initial blessings
const initialWishes = [
  {
    author: "Elnur & Jasmina",
    text: "Farrux & Marjona, baxtingizga aslo ko'z tegmasin! Ilohim qo'sha qaringlar, xonadoningizdan fayz arimasin! 🎉",
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

function loadWishes() {
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

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

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
    localStorage.setItem('wedding_wishes', JSON.stringify(stored));

    document.getElementById('wish-author').value = '';
    document.getElementById('wish-text').value = '';

    loadWishes();
    launchConfetti();
    showToast(currentLang === 'ru' ? 'Пожелание добавлено!' : currentLang === 'en' ? 'Wish sent successfully!' : 'Tilagingiz qabul qilindi! Rahmat!');
  });
}

// =============================================================================
// 9. COPY ADDRESS & SHARE INVITATION
// =============================================================================
const copyAddressBtn = document.getElementById('copy-address-btn');
if (copyAddressBtn) {
  copyAddressBtn.addEventListener('click', () => {
    const address = "Sohil Tantanalar Saroyi, Toshkent viloyati, Yangiyo'l tumani";
    navigator.clipboard.writeText(address).then(() => {
      showToast(currentLang === 'ru' ? 'Адрес скопирован в буфер!' : currentLang === 'en' ? 'Address copied to clipboard!' : 'Manzil nusxalandi!');
    }).catch(() => {
      showToast(address);
    });
  });
}

function shareInvitation() {
  const shareData = {
    title: "Farrux & Marjona | To'y Taklifnomasi",
    text: "Farrux va Marjonaning nikoh to'yi munosabati bilan 'Visol oqshomi' dasturxoniga lutfan taklif etamiz! 30-Oktyabr, 2026",
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast(currentLang === 'ru' ? 'Ссылка скопирована в буфер!' : currentLang === 'en' ? 'Invitation link copied!' : 'Taklifnoma havolasi nusxalandi!');
    });
  }
}

document.getElementById('share-btn')?.addEventListener('click', shareInvitation);
document.getElementById('footer-share-btn')?.addEventListener('click', shareInvitation);

// =============================================================================
// 10. TOAST NOTIFICATION UTILITY
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
// 11. INITIALIZATION & EVENT LISTENERS
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchLanguage(btn.dataset.lang);
    });
  });

  const savedLang = localStorage.getItem('wedding_lang') || 'uz';
  switchLanguage(savedLang);

  // 2. Countdown timer
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 3. Audio controls
  floatingMusic?.addEventListener('click', toggleAudio);
  soundToggleTop?.addEventListener('click', toggleAudio);

  // 4. Load Guestbook
  loadWishes();

  // 5. Restore previous RSVP state if already submitted
  const savedRSVP = localStorage.getItem('wedding_rsvp');
  if (savedRSVP) {
    if (rsvpForm) rsvpForm.style.display = 'none';
    if (rsvpSuccess) rsvpSuccess.style.display = 'block';
  }

  // 6. Intersection Observer for smooth reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section').forEach(sec => {
    observer.observe(sec);
  });

  // 7. Interactive Slide to Unlock (Left-to-Right Drag/Swipe)
  const unlockSlider = document.getElementById('unlock-slider');
  const unlockHandle = document.getElementById('unlock-slider-handle');
  const unlockFill = document.getElementById('unlock-slider-fill');
  const unlockLabel = document.getElementById('unlock-slider-label');
  const lockIcon = document.getElementById('lock-icon');

  if (unlockSlider && unlockHandle) {
    let unlocked = false;
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let maxSlide = 0;
    let hasMoved = false;

    // Helper to play a soft golden chime tone on unlock
    function playUnlockChime() {
      try {
        initAudioContext();
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const now = audioCtx.currentTime;
        // Dual golden bell notes: 587.33Hz (D5) -> 880Hz (A5)
        [587.33, 880].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0, now + idx * 0.12);
          gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.12 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.2);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 1.2);
        });
      } catch (_) {}
    }

    function calculateMaxSlide() {
      // 4px padding on each side
      return Math.max(0, unlockSlider.clientWidth - unlockHandle.offsetWidth - 8);
    }

    function triggerUnlock() {
      if (unlocked) {
        document.getElementById('biz')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      unlocked = true;

      // Unlock body to reveal all invitation sections and enable scrolling
      document.body.classList.remove('is-locked');
      document.body.classList.add('is-unlocked');

      // Update ARIA
      unlockSlider.setAttribute('aria-valuenow', '100');
      unlockSlider.setAttribute('aria-label', 'Taklifnoma ochildi');

      // Visual classes & state
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

      // Haptic vibration feedback for mobile devices
      if ('vibrate' in navigator) {
        try { navigator.vibrate([40, 50, 40]); } catch (_) {}
      }

      // Play soft chime
      playUnlockChime();

      // Reveal music player widgets only after unlocking
      floatingMusic?.classList.add('visible');
      soundToggleTop?.classList.add('visible');

      // Automatically start romantic wedding music upon unlocking
      if (!isAudioPlaying) {
        toggleAudio();
      }

      // Show gentle guide tooltip on the music widget
      setTimeout(() => {
        musicTooltip?.classList.add('show');
        setTimeout(() => {
          musicTooltip?.classList.remove('show');
        }, 3500);
      }, 700);

      // Confetti celebration burst
      if (typeof launchConfetti === 'function') {
        launchConfetti();
      }

      // Smooth scroll to next section (#biz)
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

    function getEventClientX(e) {
      if (e.touches && e.touches.length > 0) return e.touches[0].clientX;
      if (e.changedTouches && e.changedTouches.length > 0) return e.changedTouches[0].clientX;
      return e.clientX;
    }

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

      // Restrict strictly from left (0) to right (maxSlide)
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

      // If user slides past 88%, trigger unlock smoothly
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
          // If clicked near the right end, treat as open tap
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

    // Touch events for mobile devices
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

    // Pointer & Mouse events for desktop & laptops
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

    // Keyboard accessibility: Right Arrow, Space, or Enter triggers slide to unlock
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

    // Re-calculate slider max distance on window resize
    window.addEventListener('resize', () => {
      if (unlocked) {
        maxSlide = calculateMaxSlide();
        unlockHandle.style.transform = `translateX(${maxSlide}px)`;
      }
    });
  }
});

