document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────
     COUNTDOWN — persists across page refresh
  ────────────────────────────────────── */
  function getOrCreateDeadline() {
    const KEY = 'azuria_deadline';
    const stored = sessionStorage.getItem(KEY);
    if (stored) {
      const ts = parseInt(stored, 10);
      if (!isNaN(ts) && ts > Date.now()) return ts;
    }
    const deadline = Date.now() + 72 * 60 * 60 * 1000;
    sessionStorage.setItem(KEY, deadline.toString());
    return deadline;
  }

  const deadline = getOrCreateDeadline();

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    const dist = deadline - Date.now();
    if (dist <= 0) {
      clearInterval(timerInterval);
      ['days', 'hours', 'minutes', 'seconds'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      return;
    }
    const d = Math.floor(dist / 86400000);
    const h = Math.floor((dist % 86400000) / 3600000);
    const m = Math.floor((dist % 3600000) / 60000);
    const s = Math.floor((dist % 60000) / 1000);
    document.getElementById('days').textContent    = pad(d);
    document.getElementById('hours').textContent   = pad(h);
    document.getElementById('minutes').textContent = pad(m);
    document.getElementById('seconds').textContent = pad(s);
  }

  const timerInterval = setInterval(updateCountdown, 1000);
  updateCountdown();

  /* ──────────────────────────────────────
     GAGNER BUTTON → DROP FORM
  ────────────────────────────────────── */
  const showFormBtn  = document.getElementById('showFormBtn');
  const formDrop     = document.getElementById('captureForm');

  if (showFormBtn && formDrop) {
    showFormBtn.addEventListener('click', () => {
      formDrop.classList.add('open');
      formDrop.removeAttribute('aria-hidden');
      showFormBtn.setAttribute('aria-expanded', 'true');
      // Smooth scroll into view then focus first input
      setTimeout(() => {
        formDrop.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        const firstInput = formDrop.querySelector('.luxury-input');
        if (firstInput) firstInput.focus();
      }, 100);
    });
  }

  /* ──────────────────────────────────────
     FORM VALIDATION + SUBMIT
  ────────────────────────────────────── */
  const leadForm = document.getElementById('leadForm');

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const firstNameInput = leadForm.querySelector('#firstName');
      const emailInput     = leadForm.querySelector('#email');
      const firstNameError = leadForm.querySelector('#firstNameError');
      const emailError     = leadForm.querySelector('#emailError');

      [firstNameInput, emailInput].forEach(el => el.classList.remove('error'));
      firstNameError.textContent = '';
      emailError.textContent = '';

      const firstName = firstNameInput.value.trim();
      const email     = emailInput.value.trim();
      let valid = true;

      if (firstName.length < 2) {
        firstNameInput.classList.add('error');
        firstNameError.textContent = 'Prénom requis (min. 2 caractères)';
        valid = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailInput.classList.add('error');
        emailError.textContent = 'Adresse e-mail invalide';
        valid = false;
      }

      if (!valid) return;

      const btn     = leadForm.querySelector('.submit-btn');
      const label   = btn.querySelector('.btn-label');
      const spinner = btn.querySelector('.btn-spinner');
      label.textContent = 'Validation…';
      spinner.classList.remove('hidden');
      btn.disabled = true;

      setTimeout(() => {
        const wrapper = document.createElement('div');
        wrapper.className = 'success-message';

        const title = document.createElement('p');
        title.className = 'success-title';
        title.textContent = 'Félicitations.';

        const body = document.createElement('p');
        body.className = 'success-body';
        body.textContent = 'Vous êtes sur la liste privée.';
        const br = document.createElement('br');
        const line2 = document.createTextNode('Nous vous contacterons bientôt.');
        body.appendChild(br);
        body.appendChild(line2);

        wrapper.appendChild(title);
        wrapper.appendChild(body);
        leadForm.replaceChildren(wrapper);
      }, 1500);
    });
  }

  /* ──────────────────────────────────────
     ANIMATED COUNTER — stats bar
  ────────────────────────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(eased * target).toLocaleString('fr-FR');
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsBar);
  }

  /* ──────────────────────────────────────
     SLOTS GRID — 100 dots, 88 taken / 12 remaining
  ────────────────────────────────────── */
  const slotsGrid = document.getElementById('slotsGrid');
  if (slotsGrid) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 100; i++) {
      const dot = document.createElement('div');
      dot.className = 'slot-dot ' + (i < 88 ? 'taken' : 'remaining');
      fragment.appendChild(dot);
    }
    slotsGrid.appendChild(fragment);
  }

  /* ──────────────────────────────────────
     SCROLL REVEAL
  ────────────────────────────────────── */
  const revealTargets = document.querySelectorAll('.scroll-reveal');
  if (revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(el => revealObserver.observe(el));
  }

});
