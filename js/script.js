/* ── StudyPro Dashboard Script ── */

/* ── Greeting ── */
function setGreeting() {
  const h = new Date().getHours();
  const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const el = document.getElementById('greetingText');
  if (el) el.textContent = `${greet}, Student! 👋`;
}
setGreeting();

/* ── Theme Toggle ── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const html        = document.documentElement;

themeToggle?.addEventListener('click', () => {
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
});

/* ── Sidebar / Hamburger ── */
const sidebar   = document.getElementById('sidebar');
const hamburger = document.getElementById('hamburger');

hamburger?.addEventListener('click', () => sidebar?.classList.toggle('open'));

/* ── Tasks ── */
const tasks = [
  { subject: 'Mathematics', desc: 'Practice calculus problems',       time: '9:00 AM – 10:30 AM', priority: 'High',   done: true,  color: '#6C63FF' },
  { subject: 'Physics',     desc: 'Read chapter 6: Work and Energy',  time: '11:00 AM – 12:00 PM', priority: 'Medium', done: true,  color: '#3B82F6' },
  { subject: 'Chemistry',   desc: 'Watch lecture on Chemical Bonding', time: '1:00 PM – 2:00 PM',  priority: 'Medium', done: false, color: '#22C55E' },
  { subject: 'Biology',     desc: 'Complete cell structure worksheet', time: '2:30 PM – 3:30 PM',  priority: 'Low',    done: true,  color: '#14B8A6' },
  { subject: 'English',     desc: 'Essay writing practice',           time: '4:00 PM – 5:00 PM',  priority: 'Low',    done: false, color: '#F59E0B' },
  { subject: 'ICT',         desc: 'HTML & CSS practice',              time: '5:30 PM – 6:30 PM',  priority: 'Low',    done: false, color: '#A78BFA' },
];

function renderTasks() {
  const list = document.getElementById('taskList');
  if (!list) return;
  list.innerHTML = tasks.map((t, i) => `
    <div class="task-item">
      <div class="task-bar" style="background:${t.color}"></div>
      <div class="task-check ${t.done ? 'done' : ''}" data-idx="${i}">
        ${t.done ? '<i class="fas fa-check"></i>' : ''}
      </div>
      <div class="task-body">
        <div class="task-subject" style="color:${t.color}">${t.subject}</div>
        <div class="task-desc ${t.done ? 'done-text' : ''}">${t.desc}</div>
      </div>
      <div class="task-time">${t.time}</div>
      <span class="priority-badge ${t.priority.toLowerCase()}">${t.priority}</span>
      <button class="task-more"><i class="fas fa-ellipsis"></i></button>
    </div>
  `).join('');

  list.querySelectorAll('.task-check').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = +btn.dataset.idx;
      tasks[idx].done = !tasks[idx].done;
      renderTasks();
    });
  });
}
renderTasks();

/* ── Add Task Modal ── */
const addTaskBtn  = document.getElementById('addTaskBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose  = document.getElementById('modalClose');
const cancelTask  = document.getElementById('cancelTask');
const saveTask    = document.getElementById('saveTask');

function openModal() { modalOverlay?.classList.add('open'); }
function closeModal() { modalOverlay?.classList.remove('open'); }

addTaskBtn?.addEventListener('click', openModal);
modalClose?.addEventListener('click', closeModal);
cancelTask?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

saveTask?.addEventListener('click', () => {
  const subject  = document.getElementById('taskSubject')?.value.trim();
  const desc     = document.getElementById('taskDesc')?.value.trim();
  const time     = document.getElementById('taskTime')?.value;
  const priority = document.getElementById('taskPriority')?.value;
  if (!subject || !desc) return;
  tasks.push({ subject, desc, time: time || 'Anytime', priority, done: false, color: '#6C63FF' });
  renderTasks();
  closeModal();
  document.getElementById('taskSubject').value = '';
  document.getElementById('taskDesc').value = '';
});

/* ── Calendar ── */
let calDate = new Date(2024, 4, 1); // May 2024

function renderCalendar() {
  const label = document.getElementById('calMonthLabel');
  const days  = document.getElementById('calDays');
  if (!label || !days) return;

  const y = calDate.getFullYear(), m = calDate.getMonth();
  const today = new Date();

  label.textContent = calDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstDay = new Date(y, m, 1).getDay(); // 0=Sun
  // Adjust so week starts Monday
  const startOffset = (firstDay === 0 ? 6 : firstDay - 1);
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const prevDays    = new Date(y, m, 0).getDate();

  let html = '';

  // Previous month days
  for (let i = startOffset - 1; i >= 0; i--) {
    html += `<div class="cal-day other-month">${prevDays - i}</div>`;
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = (d === today.getDate() && m === today.getMonth() && y === today.getFullYear())
                 || (d === 20 && m === 4 && y === 2024); // pin "20" as today for demo
    html += `<div class="cal-day ${isToday ? 'today' : ''}">${d}</div>`;
  }

  // Next month fill
  const total = startOffset + daysInMonth;
  const remainder = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= remainder; d++) {
    html += `<div class="cal-day other-month">${d}</div>`;
  }

  days.innerHTML = html;
}

document.getElementById('calPrev')?.addEventListener('click', () => {
  calDate.setMonth(calDate.getMonth() - 1);
  renderCalendar();
});
document.getElementById('calNext')?.addEventListener('click', () => {
  calDate.setMonth(calDate.getMonth() + 1);
  renderCalendar();
});
renderCalendar();

/* ── Weekly Overview ── */
const weekData = [
  { day: 'Mon', date: '20 May', today: true,  tasks: [
    { label: 'Math Revision',   dot: 'dot-purple' },
    { label: 'Physics Problems',dot: 'dot-orange' },
    { label: 'English Essay',   dot: 'dot-teal'   },
  ]},
  { day: 'Tue', date: '21 May', today: false, tasks: [
    { label: 'Chemistry',       dot: 'dot-green'  },
    { label: 'ICT Practical',   dot: 'dot-blue'   },
    { label: 'Past Questions',  dot: 'dot-orange' },
  ]},
  { day: 'Wed', date: '22 May', today: false, tasks: [
    { label: 'Biology Notes',   dot: 'dot-teal'   },
    { label: 'Math Worksheet',  dot: 'dot-purple' },
    { label: 'Reading',         dot: 'dot-blue'   },
  ]},
  { day: 'Thu', date: '23 May', today: false, tasks: [
    { label: 'Physics Quiz',    dot: 'dot-orange' },
    { label: 'Chemistry Lab',   dot: 'dot-red'    },
    { label: 'Essay Outline',   dot: 'dot-teal'   },
  ]},
  { day: 'Fri', date: '24 May', today: false, tasks: [
    { label: 'ICT Project',     dot: 'dot-blue'   },
    { label: 'Math Problems',   dot: 'dot-purple' },
    { label: 'Mock Test',       dot: 'dot-red'    },
  ]},
  { day: 'Sat', date: '25 May', today: false, tasks: [
    { label: 'Revision',        dot: 'dot-orange' },
    { label: 'Practice Test',   dot: 'dot-green'  },
  ]},
  { day: 'Sun', date: '26 May', today: false, tasks: [], rest: true },
];

function renderWeekly() {
  const grid = document.getElementById('weeklyGrid');
  if (!grid) return;
  grid.innerHTML = weekData.map(w => `
    <div class="week-day-col">
      <div class="week-day-header ${w.today ? 'today-col' : ''}">
        <span class="week-day-name">${w.day}</span>
        <span class="week-day-date">${w.date}</span>
      </div>
      <div class="week-tasks">
        ${w.rest ? '<div class="week-rest">Rest Day 😊</div>' : w.tasks.map(t =>
          `<div class="week-task-tag ${t.dot}">${t.label}</div>`
        ).join('')}
        ${!w.rest ? `<button class="week-add-btn"><i class="fas fa-plus"></i> Add Task</button>` : ''}
      </div>
    </div>
  `).join('');
}
renderWeekly();

/* ── Reminders ── */
const reminders = [
  { icon: 'fas fa-gamepad',   iconClass: 'purple', name: 'Math Quiz',          time: 'Tomorrow, 9:00 AM'   },
  { icon: 'fas fa-calendar',  iconClass: 'blue',   name: 'Physics Assignment',  time: '22 May, 11:59 PM'   },
  { icon: 'fas fa-book-open', iconClass: 'green',  name: 'Biology Test',        time: '24 May, 10:00 AM'   },
  { icon: 'fas fa-flask',     iconClass: 'orange', name: 'Chemistry Lab',       time: '25 May, 2:00 PM'    },
];

function renderReminders() {
  const list = document.getElementById('reminderList');
  if (!list) return;
  list.innerHTML = reminders.map(r => `
    <div class="reminder-item">
      <div class="reminder-icon ${r.iconClass}"><i class="${r.icon}"></i></div>
      <div class="reminder-body">
        <div class="reminder-name">${r.name}</div>
        <div class="reminder-time">${r.time}</div>
      </div>
      <button class="reminder-more"><i class="fas fa-ellipsis-vertical"></i></button>
    </div>
  `).join('');
}
renderReminders();

/* ── File Upload ── */
const uploadZone   = document.getElementById('uploadZone');
const fileInput    = document.getElementById('fileInput');
const uploadBtn    = document.getElementById('uploadBtn');
const uploadedFiles = document.getElementById('uploadedFiles');

uploadBtn?.addEventListener('click', () => fileInput?.click());

fileInput?.addEventListener('change', () => handleFiles(fileInput.files));

uploadZone?.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone?.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone?.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  handleFiles(e.dataTransfer.files);
});

function handleFiles(files) {
  [...files].forEach(f => {
    const chip = document.createElement('div');
    chip.className = 'uploaded-file-chip';
    chip.innerHTML = `<i class="fas fa-file"></i> ${f.name}`;
    uploadedFiles?.appendChild(chip);
  });
}

/* ── Daily Quote Rotation ── */
const quotes = [
  'Consistency today brings success tomorrow.',
  'Small steps every day lead to big results.',
  'Discipline is the bridge between goals and achievement.',
  'Focus on progress, not perfection.',
];
const quoteEl = document.getElementById('dailyQuote');
if (quoteEl) quoteEl.textContent = quotes[new Date().getDay() % quotes.length];