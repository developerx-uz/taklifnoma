/**
 * Farrux & Marjona - Romantic Wedding Audio Module (js/audio.js)
 * Features:
 * - Procedural Romantic Synthesizer (Web Audio API)
 * - MP3 Audio Element Fallback
 * - Vinyl disc spinning animation
 */

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
  [293.66, 369.99, 440.00, 587.33], // D Major
  [277.18, 329.63, 440.00, 659.25], // A Major
  [246.94, 293.66, 369.99, 493.88], // B Minor
  [220.00, 277.18, 369.99, 554.37], // F# Minor
  [196.00, 246.94, 293.66, 392.00], // G Major
  [185.00, 220.00, 293.66, 440.00], // D Major
  [196.00, 246.94, 293.66, 493.88], // G Major
  [220.00, 277.18, 329.63, 440.00]  // A Major
];

function initAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
}

// Procedural gentle harp note generator
function playHarpNote(freq, delaySeconds, durationSeconds = 3.2) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime + delaySeconds;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
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

  const disc = document.getElementById('vinyl-disc');
  const soundTop = document.getElementById('sound-toggle-top');
  const tooltip = document.getElementById('music-tooltip');
  const audioEl = document.getElementById('wedding-audio');

  if (isAudioPlaying) {
    // Stop audio
    isAudioPlaying = false;
    if (audioEl) audioEl.pause();
    stopProceduralMusic();
    if (disc) disc.classList.remove('spinning');
    if (soundTop) soundTop.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    if (typeof showToast === 'function') {
      showToast(currentLang === 'ru' ? 'Музыка выключена' : currentLang === 'en' ? 'Music paused' : 'Musiqa to‘xtatildi');
    }
  } else {
    // Start audio
    isAudioPlaying = true;
    if (disc) disc.classList.add('spinning');
    if (soundTop) soundTop.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    if (tooltip) tooltip.classList.remove('show');

    if (audioEl) {
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // MP3 plays successfully
        }).catch(() => {
          // Fallback to procedural acoustic harp synth
          startProceduralMusic();
        });
      } else {
        startProceduralMusic();
      }
    } else {
      startProceduralMusic();
    }

    if (typeof showToast === 'function') {
      showToast(currentLang === 'ru' ? 'Приятного прослушивания 🎵' : currentLang === 'en' ? 'Playing wedding melody 🎵' : 'Musiqa yangramoqda 🎵');
    }
  }
}

// Connect listeners
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
});
