/* ===== STUDYPRO — auth.js ===== */

// ── THEME ──────────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  localStorage.setItem('sp-theme', theme);
}
themeToggle.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});
applyTheme(localStorage.getItem('sp-theme') || 'light');

// ── HELPERS ────────────────────────────────────────────
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearError(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
}
function setInputState(inputEl, state) {
  inputEl.classList.remove('error-input', 'success-input');
  if (state) inputEl.classList.add(state + '-input');
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function showMessage(id, msg, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = `form-message ${type}`;
}
function setLoading(btnId, textId, spinnerId, loading) {
  const btn     = document.getElementById(btnId);
  const text    = document.getElementById(textId);
  const spinner = document.getElementById(spinnerId);
  if (!btn) return;
  btn.disabled    = loading;
  text.textContent = loading ? 'Please wait...' : (btnId === 'loginBtn' ? 'Sign In' : 'Create Account');
  spinner.classList.toggle('hidden', !loading);
}

// ── PASSWORD TOGGLE ────────────────────────────────────
function setupToggle(btnId, inputId, iconId) {
  const btn   = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  const icon  = document.getElementById(iconId);
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    const isText = input.type === 'text';
    input.type   = isText ? 'password' : 'text';
    icon.className = isText ? 'fas fa-eye' : 'fas fa-eye-slash';
  });
}
setupToggle('togglePw',      'loginPassword',  'pwEyeIcon');
setupToggle('toggleRegPw',   'regPassword',    'regPwEyeIcon');
setupToggle('toggleConfirm', 'regConfirm',     'confirmEyeIcon');

// ── GOOGLE LOGIN SIMULATION ────────────────────────────
const googleBtns = [document.getElementById('googleLogin'), document.getElementById('googleRegister')];
googleBtns.forEach(btn => {
  if (!btn) return;
  btn.addEventListener('click', () => {
    btn.textContent = '⏳ Connecting to Google...';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = `<img src="https://www.svgrepo.com/show/475656/google-color.svg" class="google-icon" alt="G"/> Continue with Google`;
      btn.disabled = false;
      alert('Google login is not connected in this demo. Add Firebase/OAuth to enable it!');
    }, 1800);
  });
});

// ── LOGIN FORM ─────────────────────────────────────────
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  const emailInput = document.getElementById('loginEmail');
  const passInput  = document.getElementById('loginPassword');

  emailInput.addEventListener('input', () => {
    if (emailInput.value && !isValidEmail(emailInput.value)) {
      showError('emailError', 'Please enter a valid email address.');
      setInputState(emailInput, 'error');
    } else {
      clearError('emailError');
      setInputState(emailInput, emailInput.value ? 'success' : null);
    }
  });

  passInput.addEventListener('input', () => {
    if (passInput.value.length > 0 && passInput.value.length < 6) {
      showError('passwordError', 'Password must be at least 6 characters.');
      setInputState(passInput, 'error');
    } else {
      clearError('passwordError');
      setInputState(passInput, passInput.value ? 'success' : null);
    }
  });

  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    if (!emailInput.value || !isValidEmail(emailInput.value)) {
      showError('emailError', 'Please enter a valid email address.');
      setInputState(emailInput, 'error');
      valid = false;
    }
    if (!passInput.value || passInput.value.length < 6) {
      showError('passwordError', 'Password must be at least 6 characters.');
      setInputState(passInput, 'error');
      valid = false;
    }
    if (!valid) return;

    setLoading('loginBtn', 'loginBtnText', 'loginSpinner', true);

    setTimeout(() => {
      setLoading('loginBtn', 'loginBtnText', 'loginSpinner', false);
      // Demo: accept any valid credentials
      showMessage('loginMessage', '✅ Login successful! Redirecting to dashboard...', 'success');
      setTimeout(() => { window.location.href = 'index.html'; }, 1500);
    }, 1800);
  });
}

// ── REGISTER FORM ──────────────────────────────────────
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  const pwInput      = document.getElementById('regPassword');
  const confirmInput = document.getElementById('regConfirm');

  // Password strength
  function updateStrength(val) {
    const fill  = document.getElementById('pwFill');
    const label = document.getElementById('pwLabel');
    if (!fill || !label) return;
    let score = 0;
    if (val.length >= 8)          score++;
    if (/[A-Z]/.test(val))        score++;
    if (/[0-9]/.test(val))        score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const levels = [
      { pct: '0%',   color: 'var(--border)',  label: 'Strength' },
      { pct: '25%',  color: 'var(--red)',      label: 'Weak' },
      { pct: '50%',  color: 'var(--orange)',   label: 'Fair' },
      { pct: '75%',  color: 'var(--blue)',     label: 'Good' },
      { pct: '100%', color: 'var(--green)',    label: 'Strong' },
    ];
    const level = levels[score] || levels[0];
    fill.style.width      = val.length === 0 ? '0%' : level.pct;
    fill.style.background = level.color;
    label.textContent     = val.length === 0 ? 'Strength' : level.label;
    label.style.color     = val.length === 0 ? 'var(--text-3)' : level.color;
  }

  if (pwInput) pwInput.addEventListener('input', () => {
    updateStrength(pwInput.value);
    clearError('regPasswordError');
    setInputState(pwInput, pwInput.value.length >= 8 ? 'success' : 'error');
  });
  if (confirmInput) confirmInput.addEventListener('input', () => {
    if (confirmInput.value && confirmInput.value !== pwInput.value) {
      showError('confirmError', 'Passwords do not match.');
      setInputState(confirmInput, 'error');
    } else {
      clearError('confirmError');
      setInputState(confirmInput, confirmInput.value ? 'success' : null);
    }
  });

  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName  = document.getElementById('regLastName').value.trim();
    const email     = document.getElementById('regEmail').value.trim();
    const password  = pwInput ? pwInput.value : '';
    const confirm   = confirmInput ? confirmInput.value : '';
    const terms     = document.getElementById('agreeTerms').checked;

    if (!firstName) { showError('firstNameError', 'First name is required.'); setInputState(document.getElementById('regFirstName'), 'error'); valid = false; }
    else { clearError('firstNameError'); setInputState(document.getElementById('regFirstName'), 'success'); }

    if (!lastName) { showError('lastNameError', 'Last name is required.'); setInputState(document.getElementById('regLastName'), 'error'); valid = false; }
    else { clearError('lastNameError'); setInputState(document.getElementById('regLastName'), 'success'); }

    if (!email || !isValidEmail(email)) { showError('regEmailError', 'Please enter a valid email.'); setInputState(document.getElementById('regEmail'), 'error'); valid = false; }
    else { clearError('regEmailError'); setInputState(document.getElementById('regEmail'), 'success'); }

    if (!password || password.length < 8) { showError('regPasswordError', 'Password must be at least 8 characters.'); setInputState(pwInput, 'error'); valid = false; }
    else { clearError('regPasswordError'); }

    if (!confirm || confirm !== password) { showError('confirmError', 'Passwords do not match.'); setInputState(confirmInput, 'error'); valid = false; }
    else { clearError('confirmError'); }

    if (!terms) { showError('termsError', 'You must agree to the Terms of Service.'); valid = false; }
    else { clearError('termsError'); }

    if (!valid) return;

    setLoading('registerBtn', 'registerBtnText', 'registerSpinner', true);

    setTimeout(() => {
      setLoading('registerBtn', 'registerBtnText', 'registerSpinner', false);
      showMessage('registerMessage', `🎉 Account created! Welcome, ${firstName}! Redirecting...`, 'success');
      setTimeout(() => { window.location.href = 'index.html'; }, 2000);
    }, 2000);
  });
}