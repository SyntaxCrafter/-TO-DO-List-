// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  themeToggle.textContent = document.body.classList.contains("dark-theme") ? "☀️" : "🌙";
});

// Add Task
const taskInput = document.getElementById("task-input");
const dueDate = document.getElementById("due-date");
const category = document.getElementById("category");
const priority = document.getElementById("priority");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

addTaskBtn.addEventListener("click", () => {
  if (taskInput.value.trim() === "") return;

  const task = {
    id: Date.now(),
    text: taskInput.value,
    date: dueDate.value,
    category: category.value,
    priority: priority.value,
    completed: false
  };

  tasks.push(task);
  saveAndRender();
  clearInputs();
});

function clearInputs() {
  taskInput.value = "";
  dueDate.value = "";
  category.value = "Work";
  priority.value = "Low";
}

function renderTasks(filtered = tasks) {
  taskList.innerHTML = "";
  if (filtered.length === 0) {
    taskList.innerHTML = "<p style='text-align:center;'>No tasks found.</p>";
  }

  filtered.forEach(task => {
    const card = document.createElement("div");
    card.className = `task-card ${task.priority.toLowerCase()}`;

    const info = document.createElement("div");
    info.className = "task-info";
    info.innerHTML = `
      <strong>${task.text}</strong>
      <small>Due: ${task.date || "N/A"} | ${task.category} | Priority: ${task.priority}</small>
    `;

    const actions = document.createElement("div");
    actions.className = "task-actions";
    actions.innerHTML = `
      <button onclick="toggleComplete(${task.id})">${task.completed ? "✅" : "✔️"}</button>
      <button onclick="deleteTask(${task.id})">🗑️</button>
    `;

    if (task.completed) card.style.textDecoration = "line-through";

    card.appendChild(info);
    card.appendChild(actions);
    taskList.appendChild(card);
  });

  updateProgress();
}

function toggleComplete(id) {
  tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
  saveAndRender();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Search Tasks
const search = document.getElementById("search");
search.addEventListener("input", () => {
  const query = search.value.toLowerCase();
  const filtered = tasks.filter(t => t.text.toLowerCase().includes(query));
  renderTasks(filtered);
});

// Progress Bar
function updateProgress() {
  const completed = tasks.filter(t => t.completed).length;
  const progress = tasks.length === 0 ? 0 : (completed / tasks.length) * 100;
  document.getElementById("progress-bar").style.width = `${progress}%`;
}

// Voice Input (optional enhancement)
const voiceBtn = document.getElementById("voice-btn");
voiceBtn.addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-IN";
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    taskInput.value = transcript;
  };
});
