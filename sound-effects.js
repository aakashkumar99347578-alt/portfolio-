/**
 * Web Audio API Procedural Sound Synthesizer
 * Generates futuristic UI micro-tones without requiring external sound files.
 */

(function () {
  'use strict';

  let audioCtx = null;
  let isSoundEnabled = false;

  const soundToggleBtn = document.getElementById('sound-toggle');
  const audioStatusDisplay = document.getElementById('audio-status');
  const soundOnIcon = document.querySelector('.sound-on');
  const soundOffIcon = document.querySelector('.sound-off');

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  const soundFX = {
    // Subtle tick on button/card hover
    playHover: function () {
      if (!isSoundEnabled) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    },

    // Futuristic click pulse
    playClick: function () {
      if (!isSoundEnabled) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    },

    // 3D Geometry Shift whoosh
    playCyberShift: function () {
      if (!isSoundEnabled) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    },

    // Terminal keystroke
    playKeystroke: function () {
      if (!isSoundEnabled) return;
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(500 + Math.random() * 300, ctx.currentTime);

      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    }
  };

  window.soundFX = soundFX;

  // Toggle button handler
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      if (isSoundEnabled) {
        getAudioContext();
        soundFX.playClick();
        if (soundOnIcon) soundOnIcon.classList.remove('hidden');
        if (soundOffIcon) soundOffIcon.classList.add('hidden');
        if (audioStatusDisplay) audioStatusDisplay.textContent = 'ACTIVE';
      } else {
        if (soundOnIcon) soundOnIcon.classList.add('hidden');
        if (soundOffIcon) soundOffIcon.classList.remove('hidden');
        if (audioStatusDisplay) audioStatusDisplay.textContent = 'MUTED';
      }
    });
  }

  // Attach hover sounds to interactive elements
  document.addEventListener('DOMContentLoaded', () => {
    const interactives = document.querySelectorAll('.btn, .nav-link, .stat-card, .skill-card, .project-card, .award-card, .control-btn');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        soundFX.playHover();
      });
      el.addEventListener('click', () => {
        soundFX.playClick();
      });
    });
  });
})();
