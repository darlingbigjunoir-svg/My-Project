/* ===== STUDYPRO — app.js ===== */

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
  item.addEventListener('click', e => {
    e.preventDefault();
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