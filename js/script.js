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