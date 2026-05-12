

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

// ── GREETING ───────────────────────────────────────────
function setGreeting() {
  const h = new Date().getHours();
  const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('greetingText').textContent = `${greet}, John! 👋`;
}
setGreeting();

// ── STREAK ─────────────────────────────────────────────
let streak = parseInt(localStorage.getItem('sp-streak') || '7');
document.getElementById('streakCount').textContent = streak;

// ── DAILY QUOTES ───────────────────────────────────────
const quotes = [
  "Consistency today brings success tomorrow.",
  "Small steps every day lead to big results.",
  "You are one study session away from your goal.",
  "Focus, discipline, and dedication. You've got this!",
  "Every expert was once a beginner. Keep going.",
  "Your future self is proud of you for studying today.",
  "Hard work beats talent when talent doesn't work hard.",
];
const quoteEl = document.getElementById('dailyQuote');
const todayIndex = new Date().getDay();
quoteEl.textContent = quotes[todayIndex % quotes.length];

// ── SIDEBAR TOGGLE ─────────────────────────────────────
const sidebar   = document.getElementById('sidebar');
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
document.addEventListener('click', e => {
  if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

// ── NAV ITEMS ──────────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
  });
});


// ── TASKS ──────────────────────────────────────────────
let tasks = JSON.parse(localStorage.getItem('sp-tasks') || 'null') || [
  { id: 1, subject: 'Mathematics', desc: 'Practice calculus problems',   time: '9:00 AM – 10:30 AM', priority: 'High',   done: true  },
  { id: 2, subject: 'Physics',     desc: 'Read chapter 6: Work and Energy', time: '11:00 AM – 12:00 PM', priority: 'Medium', done: true  },
  { id: 3, subject: 'Chemistry',   desc: 'Watch lecture on Chemical Bonding', time: '1:00 PM – 2:00 PM', priority: 'Medium', done: false },
  { id: 4, subject: 'Biology',     desc: 'Complete cell structure worksheet', time: '2:30 PM – 3:30 PM', priority: 'Low',    done: true  },
  { id: 5, subject: 'English',     desc: 'Essay writing practice',        time: '4:00 PM – 5:00 PM', priority: 'Low',    done: false },
  { id: 6, subject: 'ICT',         desc: 'HTML & CSS practice',           time: '5:30 PM – 6:30 PM', priority: 'Low',    done: false },
];

const subjectColors = {
  Mathematics: '#7C3AED', Physics: '#3B82F6', Chemistry: '#10B981',
  Biology: '#F59E0B', English: '#EC4899', ICT: '#14B8A6',
};

function saveTasks() { localStorage.setItem('sp-tasks', JSON.stringify(tasks)); }

function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  tasks.forEach(task => {
    const color = subjectColors[task.subject] || '#7C3AED';
    const div = document.createElement('div');
    div.className = `task-item${task.done ? ' done' : ''}`;
    div.dataset.id = task.id;
    div.innerHTML = `
      <div class="task-check">${task.done ? '<i class="fas fa-check"></i>' : ''}</div>
      <div>
        <div class="task-subject" style="color:${color}">${task.subject}</div>
        <div class="task-desc">${task.desc}</div>
      </div>
      <div class="task-time">${task.time}</div>
      <span class="priority-tag ${task.priority}">${task.priority}</span>
      <button class="task-menu" title="Options"><i class="fas fa-ellipsis"></i></button>
    `;
    div.querySelector('.task-check').addEventListener('click', () => toggleTask(task.id));
    list.appendChild(div);
  });
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  saveTasks(); renderTasks();
}

// ── ADD TASK MODAL ─────────────────────────────────────
const overlay    = document.getElementById('modalOverlay');
const addTaskBtn = document.getElementById('addTaskBtn');
const modalClose = document.getElementById('modalClose');
const cancelTask = document.getElementById('cancelTask');
const saveTask   = document.getElementById('saveTask');

function openModal()  { overlay.classList.add('open'); }
function closeModal() { overlay.classList.remove('open'); clearModalInputs(); }

addTaskBtn.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
cancelTask.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

function clearModalInputs() {
  document.getElementById('taskSubject').value = '';
  document.getElementById('taskDesc').value    = '';
  document.getElementById('taskTime').value    = '';
  document.getElementById('taskPriority').value = 'High';
}

saveTask.addEventListener('click', () => {
  const subject  = document.getElementById('taskSubject').value.trim();
  const desc     = document.getElementById('taskDesc').value.trim();
  const timeVal  = document.getElementById('taskTime').value;
  const priority = document.getElementById('taskPriority').value;
  if (!subject || !desc) { alert('Please fill in subject and description.'); return; }
  const newTask = {
    id: Date.now(), subject, desc,
    time: timeVal || 'All day', priority, done: false,
  };
  tasks.push(newTask);
  saveTasks(); renderTasks(); closeModal();
});

// ── CALENDAR ───────────────────────────────────────────
let calDate = new Date();

function renderCalendar() {
  const year  = calDate.getFullYear();
  const month = calDate.getMonth();
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('calMonthLabel').textContent = `${months[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Mon-based
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays    = new Date(year, month, 0).getDate();
  const today       = new Date();

  const container = document.getElementById('calDays');
  container.innerHTML = '';

  for (let i = startOffset - 1; i >= 0; i--) {
    const d = document.createElement('div');
    d.className = 'cal-day other-month';
    d.textContent = prevDays - i;
    container.appendChild(d);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const el = document.createElement('div');
    el.className = 'cal-day';
    el.textContent = d;
    if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      el.classList.add('today');
    }
    container.appendChild(el);
  }
  const filled = startOffset + daysInMonth;
  const remaining = Math.ceil(filled / 7) * 7 - filled;
  for (let i = 1; i <= remaining; i++) {
    const d = document.createElement('div');
    d.className = 'cal-day other-month';
    d.textContent = i;
    container.appendChild(d);
  }
}

document.getElementById('calPrev').addEventListener('click', () => {
  calDate.setMonth(calDate.getMonth() - 1); renderCalendar();
});
document.getElementById('calNext').addEventListener('click', () => {
  calDate.setMonth(calDate.getMonth() + 1); renderCalendar();
});

// ── WEEKLY OVERVIEW ────────────────────────────────────
const weekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const weekDates = [];
const now = new Date();
const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1; // 0=Mon
for (let i = 0; i < 7; i++) {
  const d = new Date(now);
  d.setDate(now.getDate() - dayOfWeek + i);
  weekDates.push(d);
}

const weekTasks = [
  ['Math Revision','Physics Problems','English Essay'],
  ['Chemistry','ICT Practical','Past Questions'],
  ['Biology Notes','Math Worksheet','Reading'],
  ['Physics Quiz','Chemistry Lab','Essay Outline'],
  ['ICT Project','Math Problems','Mock Test'],
  ['Revision','Practice Test'],
  [],
];

function renderWeekly() {
  const grid = document.getElementById('weeklyGrid');
  grid.innerHTML = '';
  weekDays.forEach((day, i) => {
    const date  = weekDates[i];
    const isToday = date.toDateString() === now.toDateString();
    const div = document.createElement('div');
    div.className = `weekly-day${isToday ? ' today' : ''}`;
    div.innerHTML = `
      <div class="weekly-day-header">
        <span class="weekly-day-name">${day}</span>
        <span class="weekly-day-date">${date.getDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][date.getMonth()]}</span>
      </div>
      ${weekTasks[i].map(t => `<div class="weekly-task-item">${t}</div>`).join('')}
      ${i < 6 ? `<button class="add-weekly-btn">+ Add Task</button>` : `<div style="font-size:22px;margin-top:8px">😊</div>`}
    `;
    grid.appendChild(div);
  });
}

// ── REMINDERS ──────────────────────────────────────────
const reminders = [
  { icon: '📐', color: 'var(--purple-light)', title: 'Math Quiz',           time: 'Tomorrow, 9:00 AM'   },
  { icon: '📅', color: 'var(--blue-light)',   title: 'Physics Assignment',  time: '22 May, 11:59 PM'    },
  { icon: '📗', color: 'var(--green-light)',  title: 'Biology Test',        time: '24 May, 10:00 AM'    },
  { icon: '🧪', color: 'var(--orange-light)', title: 'Chemistry Lab',       time: '25 May, 2:00 PM'     },
];

function renderReminders() {
  const list = document.getElementById('reminderList');
  list.innerHTML = '';
  reminders.forEach(r => {
    const div = document.createElement('div');
    div.className = 'reminder-item';
    div.innerHTML = `
      <div class="reminder-icon" style="background:${r.color}">${r.icon}</div>
      <div class="reminder-info">
        <div class="reminder-title">${r.title}</div>
        <div class="reminder-time">${r.time}</div>
      </div>
      <button class="reminder-menu"><i class="fas fa-ellipsis-vertical"></i></button>
    `;
    list.appendChild(div);
  });
}

// ── FILE UPLOAD ────────────────────────────────────────
const uploadZone    = document.getElementById('uploadZone');
const fileInput     = document.getElementById('fileInput');
const uploadBtn     = document.getElementById('uploadBtn');
const uploadedFiles = document.getElementById('uploadedFiles');

const fileIcons = {
  pdf: '📄', doc: '📝', docx: '📝', ppt: '📊', pptx: '📊',
  mp3: '🎵', mp4: '🎬', png: '🖼️', jpg: '🖼️', jpeg: '🖼️',
};

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function addFile(file) {
  const ext  = file.name.split('.').pop().toLowerCase();
  const icon = fileIcons[ext] || '📎';
  const div  = document.createElement('div');
  div.className = 'uploaded-file';
  div.innerHTML = `
    <span class="file-icon">${icon}</span>
    <div class="file-info">
      <div class="file-name">${file.name}</div>
      <div class="file-size">${formatSize(file.size)}</div>
    </div>
    <button class="file-remove" title="Remove"><i class="fas fa-xmark"></i></button>
  `;
  div.querySelector('.file-remove').addEventListener('click', () => div.remove());
  uploadedFiles.appendChild(div);
}

uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
  Array.from(fileInput.files).forEach(addFile);
  fileInput.value = '';
});

['dragover', 'dragenter'].forEach(ev => {
  uploadZone.addEventListener(ev, e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
});
['dragleave','dragend','drop'].forEach(ev => {
  uploadZone.addEventListener(ev, e => { e.preventDefault(); uploadZone.classList.remove('drag-over'); });
});
uploadZone.addEventListener('drop', e => {
  Array.from(e.dataTransfer.files).forEach(addFile);
});

// ── SEARCH ─────────────────────────────────────────────
document.getElementById('searchInput').addEventListener('input', function () {
  const q = this.value.toLowerCase();
  document.querySelectorAll('.task-item').forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(q) ? '' : 'none';
  });
});

// ── INIT ───────────────────────────────────────────────
renderTasks();
renderCalendar();
renderWeekly();
renderReminders();


/* StudyPro Settings — settings.js */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Tab Switching ── */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById('tab-' + target).classList.add('active');
    });
  });

  /* ── Theme Selector ── */
  document.querySelectorAll('.theme-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.theme-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  /* ── Accent Color Dots ── */
  document.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      document.querySelectorAll('.color-dot').forEach(d => {
        d.classList.remove('active');
        d.innerHTML = '';
      });
      dot.classList.add('active');
      dot.innerHTML = '<i class="ti ti-check"></i>';
    });
  });

  /* ── Toggle Chips (study focus areas, days off) ── */
  document.querySelectorAll('.chip[data-toggle]').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('active'));
  });

  /* ── Single-select Chips (font size) ── */
  document.querySelectorAll('.chip[data-group]').forEach(chip => {
    chip.addEventListener('click', () => {
      const group = chip.dataset.group;
      document.querySelectorAll(`.chip[data-group="${group}"]`).forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  /* ── Quiet Hours Toggle ── */
  const qhToggle = document.getElementById('qh-toggle');
  const qhFields = document.getElementById('qh-fields');

  if (qhToggle && qhFields) {
    qhToggle.addEventListener('change', () => {
      qhFields.style.opacity = qhToggle.checked ? '1' : '0.4';
      qhFields.style.pointerEvents = qhToggle.checked ? 'auto' : 'none';
    });
  }

  /* ── Study Hours Slider ── */
  const studySlider = document.getElementById('study-hours');
  const studyVal = document.getElementById('study-h-val');

  if (studySlider && studyVal) {
    studySlider.addEventListener('input', () => {
      studyVal.textContent = studySlider.value + 'h';
    });
  }

  /* ── Password Strength Checker ── */
  const newPwInput = document.getElementById('new-password');
  if (newPwInput) {
    newPwInput.addEventListener('input', () => {
      const val = newPwInput.value;

      const badges = {
        'pw-length':    val.length >= 8,
        'pw-uppercase': /[A-Z]/.test(val),
        'pw-number':    /[0-9]/.test(val),
        'pw-symbol':    /[^A-Za-z0-9]/.test(val),
      };

      Object.entries(badges).forEach(([id, met]) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.toggle('met', met);
        el.classList.toggle('unmet', !met);
      });
    });
  }

  /* ── Revoke Session Buttons ── */
  document.querySelectorAll('.session-revoke').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.session-item');
      if (row && confirm('Revoke this session?')) {
        row.style.transition = 'opacity 0.3s';
        row.style.opacity = '0';
        setTimeout(() => row.remove(), 300);
      }
    });
  });

  /* ── Save / Discard Buttons (Profile) ── */
  const saveProfile = document.getElementById('save-profile');
  if (saveProfile) {
    saveProfile.addEventListener('click', () => {
      showToast('Profile saved successfully!', 'success');
    });
  }

  const discardProfile = document.getElementById('discard-profile');
  if (discardProfile) {
    discardProfile.addEventListener('click', () => {
      showToast('Changes discarded.', 'info');
    });
  }

  /* ── Update Password Button ── */
  const updatePw = document.getElementById('update-password');
  if (updatePw) {
    updatePw.addEventListener('click', () => {
      const current = document.getElementById('current-password').value;
      const newPw   = document.getElementById('new-password').value;
      const confirm = document.getElementById('confirm-password').value;

      if (!current || !newPw || !confirm) {
        showToast('Please fill in all password fields.', 'error'); return;
      }
      if (newPw !== confirm) {
        showToast('New passwords do not match.', 'error'); return;
      }
      if (newPw.length < 8) {
        showToast('Password must be at least 8 characters.', 'error'); return;
      }
      showToast('Password updated successfully!', 'success');
    });
  }

  /* ── Save Study Prefs ── */
  const saveStudy = document.getElementById('save-study');
  if (saveStudy) {
    saveStudy.addEventListener('click', () => {
      showToast('Study preferences saved!', 'success');
    });
  }

  /* ── Reset Pomodoro Defaults ── */
  const resetPomodoro = document.getElementById('reset-pomodoro');
  if (resetPomodoro) {
    resetPomodoro.addEventListener('click', () => {
      document.getElementById('pomodoro-focus').value  = 25;
      document.getElementById('pomodoro-short').value  = 5;
      document.getElementById('pomodoro-long').value   = 15;
      showToast('Pomodoro timer reset to defaults.', 'info');
    });
  }

  /* ── Enable 2FA ── */
  const enable2fa = document.getElementById('enable-2fa');
  if (enable2fa) {
    enable2fa.addEventListener('click', () => {
      showToast('2FA setup coming soon!', 'info');
    });
  }

  /* ── Upgrade Plan ── */
  const upgradePlan = document.getElementById('upgrade-plan');
  if (upgradePlan) {
    upgradePlan.addEventListener('click', () => {
      showToast('Redirecting to upgrade page…', 'info');
    });
  }

  /* ── Toast Helper ── */
  function showToast(message, type = 'info') {
    const existing = document.querySelector('.sp-toast');
    if (existing) existing.remove();

    const colors = {
      success: { bg: '#dcfce7', color: '#166534', icon: 'ti-circle-check' },
      error:   { bg: '#fef2f2', color: '#dc2626', icon: 'ti-alert-circle'  },
      info:    { bg: '#eff6ff', color: '#1d4ed8', icon: 'ti-info-circle'   },
    };
    const c = colors[type] || colors.info;

    const toast = document.createElement('div');
    toast.className = 'sp-toast';
    toast.innerHTML = `<i class="ti ${c.icon}" style="font-size:16px"></i> ${message}`;
    Object.assign(toast.style, {
      position: 'fixed', bottom: '1.5rem', right: '1.5rem',
      background: c.bg, color: c.color,
      padding: '10px 16px', borderRadius: '8px',
      fontSize: '13px', fontWeight: '500',
      display: 'flex', alignItems: 'center', gap: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      zIndex: '9999', opacity: '0',
      transition: 'opacity 0.25s',
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; });
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

});

// ─────────────────────────────────────
// 🔐 AUTH GUARD (PROTECT DASHBOARD)
// ─────────────────────────────────────
const isLoggedIn = localStorage.getItem("isLoggedIn");

if (!isLoggedIn) {
  window.location.href = "index.html"; // redirect if not logged in
}

// ─────────────────────────────────────
// 👤 LOAD USER DATA
// ─────────────────────────────────────
const user = JSON.parse(localStorage.getItem("user"));
const userName = user ? user.name : "Student";

// ─────────────────────────────────────
// 🌤️ GREETING SYSTEM
// ─────────────────────────────────────
const greetingText = document.getElementById("greetingText");

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

if (greetingText) {
  greetingText.textContent = `${getGreeting()}, ${userName}! 👋`;
}

// ─────────────────────────────────────
// 📅 DATE DISPLAY
// ─────────────────────────────────────
const dateText = document.getElementById("dateText");

if (dateText) {
  const today = new Date();
  dateText.textContent = today.toDateString();
}

// ─────────────────────────────────────
// ✅ TASK MANAGER
// ─────────────────────────────────────
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  if (!taskList) return;

  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task;

    // delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.style.marginLeft = "10px";

    delBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    });

    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

if (addTaskBtn) {
  addTaskBtn.addEventListener("click", () => {
    const task = taskInput.value.trim();

    if (task !== "") {
      tasks.push(task);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      taskInput.value = "";
      renderTasks();
    }
  });
}

// Initial render
renderTasks();

// ─────────────────────────────────────
// 📂 FILE UPLOAD (UI ONLY)
// ─────────────────────────────────────
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

if (fileInput) {
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];

    if (file && fileList) {
      const li = document.createElement("li");
      li.textContent = file.name;
      fileList.appendChild(li);
    }
  });
}

// ─────────────────────────────────────
// ⚙️ SETTINGS (DARK MODE)
// ─────────────────────────────────────
const toggleTheme = document.getElementById("toggleTheme");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

if (toggleTheme) {
  toggleTheme.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const theme = document.body.classList.contains("dark")
      ? "dark"
      : "light";

    localStorage.setItem("theme", theme);
  });
}

// ─────────────────────────────────────
// 🚪 LOGOUT SYSTEM
// ─────────────────────────────────────
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "index.html";
  });
}