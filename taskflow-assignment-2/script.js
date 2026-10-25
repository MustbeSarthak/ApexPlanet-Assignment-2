"use strict";

const STORAGE_KEY = "taskflow_tasks";

const state = {
  tasks: [],
  filter: "all"
};

const dom = {
  navToggle: document.getElementById("navToggle"),
  navMenu: document.getElementById("navMenu"),
  taskInput: document.getElementById("taskInput"),
  addTaskBtn: document.getElementById("addTaskBtn"),
  filterButtons: Array.from(document.querySelectorAll(".filter-btn")),
  taskList: document.getElementById("taskList"),
  emptyState: document.getElementById("emptyState"),
  totalCount: document.getElementById("totalCount"),
  activeCount: document.getElementById("activeCount"),
  completedCount: document.getElementById("completedCount"),
  contactForm: document.getElementById("contactForm"),
  clearFormBtn: document.getElementById("clearFormBtn"),
  formSuccess: document.getElementById("formSuccess")
};

const fields = {
  fullName: {
    input: document.getElementById("fullName"),
    error: document.getElementById("fullNameError"),
    validate: (value) => value.trim() ? "" : "Please enter your full name."
  },
  email: {
    input: document.getElementById("email"),
    error: document.getElementById("emailError"),
    validate: (value) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!value.trim()) {
        return "Please enter your email address.";
      }
      return emailPattern.test(value.trim()) ? "" : "Please enter a valid email address.";
    }
  },
  subject: {
    input: document.getElementById("subject"),
    error: document.getElementById("subjectError"),
    validate: (value) => value.trim() ? "" : "Please enter a subject."
  },
  message: {
    input: document.getElementById("message"),
    error: document.getElementById("messageError"),
    validate: (value) => value.trim().length >= 10 ? "" : "Message must be at least 10 characters long."
  }
};

function init() {
  setupNavigation();
  setupTasks();
  setupContactForm();
}

function setupNavigation() {
  dom.navToggle.addEventListener("click", () => {
    const isExpanded = dom.navToggle.getAttribute("aria-expanded") === "true";
    dom.navToggle.setAttribute("aria-expanded", String(!isExpanded));
    dom.navMenu.classList.toggle("is-open");
  });

  dom.navMenu.addEventListener("click", (event) => {
    if (event.target.tagName === "A" && window.matchMedia("(max-width: 760px)").matches) {
      dom.navToggle.setAttribute("aria-expanded", "false");
      dom.navMenu.classList.remove("is-open");
    }
  });
}

function setupTasks() {
  loadTasks();
  updateFilterButtons();
  renderTasks();

  dom.addTaskBtn.addEventListener("click", addTaskFromInput);
  dom.taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTaskFromInput();
    }
  });

  dom.filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      updateFilterButtons();
      renderTasks();
    });
  });

  dom.taskList.addEventListener("click", (event) => {
    const actionButton = event.target.closest("button[data-action]");
    if (!actionButton) {
      return;
    }

    const taskId = actionButton.dataset.id;
    const action = actionButton.dataset.action;

    if (action === "edit") {
      editTask(taskId);
    } else if (action === "delete") {
      deleteTask(taskId);
    }
  });

  dom.taskList.addEventListener("change", (event) => {
    const checkbox = event.target.closest("input[data-action='toggle']");
    if (!checkbox) {
      return;
    }
    toggleTaskCompletion(checkbox.dataset.id);
  });
}

function addTaskFromInput() {
  const title = dom.taskInput.value.trim();
  if (!title) {
    dom.taskInput.focus();
    return;
  }

  const newTask = {
    id: generateTaskId(),
    title,
    completed: false,
    createdAt: Date.now()
  };

  state.tasks.unshift(newTask);
  dom.taskInput.value = "";
  saveTasks();
  renderTasks();
}

function editTask(taskId) {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task) {
    return;
  }

  const nextTitle = window.prompt("Edit task:", task.title);
  if (nextTitle === null) {
    return;
  }

  const trimmedTitle = nextTitle.trim();
  if (!trimmedTitle) {
    window.alert("Task title cannot be empty.");
    return;
  }

  task.title = trimmedTitle;
  saveTasks();
  renderTasks();
}

function deleteTask(taskId) {
  state.tasks = state.tasks.filter((item) => item.id !== taskId);
  saveTasks();
  renderTasks();
}

function toggleTaskCompletion(taskId) {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task) {
    return;
  }
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function getFilteredTasks() {
  if (state.filter === "active") {
    return state.tasks.filter((task) => !task.completed);
  }
  if (state.filter === "completed") {
    return state.tasks.filter((task) => task.completed);
  }
  return state.tasks;
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();
  dom.taskList.innerHTML = "";

  filteredTasks.forEach((task) => {
    const listItem = document.createElement("li");
    listItem.className = `task-item${task.completed ? " completed" : ""}`;
    listItem.innerHTML = `
      <input
        type="checkbox"
        class="task-check"
        aria-label="Mark task as completed"
        data-action="toggle"
        data-id="${task.id}"
        ${task.completed ? "checked" : ""}
      >
      <span class="task-title">${escapeHtml(task.title)}</span>
      <div class="task-actions">
        <button type="button" class="icon-btn" data-action="edit" data-id="${task.id}" aria-label="Edit task">Edit</button>
        <button type="button" class="icon-btn danger" data-action="delete" data-id="${task.id}" aria-label="Delete task">Delete</button>
      </div>
    `;
    dom.taskList.appendChild(listItem);
  });

  if (filteredTasks.length === 0) {
    dom.emptyState.style.display = "block";
    dom.emptyState.querySelector("h3").textContent = state.tasks.length === 0 ? "No tasks yet" : "No tasks in this view";
    dom.emptyState.querySelector("p").textContent = state.tasks.length === 0
      ? "Create your first task to start organizing your day."
      : "Try a different filter or update existing tasks.";
  } else {
    dom.emptyState.style.display = "none";
  }
  updateTaskCounts();
}

function updateTaskCounts() {
  const total = state.tasks.length;
  const completed = state.tasks.filter((task) => task.completed).length;
  const active = total - completed;

  dom.totalCount.textContent = String(total);
  dom.activeCount.textContent = String(active);
  dom.completedCount.textContent = String(completed);
}

function updateFilterButtons() {
  dom.filterButtons.forEach((button) => {
    const isCurrent = button.dataset.filter === state.filter;
    button.classList.toggle("is-active", isCurrent);
    button.setAttribute("aria-pressed", String(isCurrent));
  });
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
}

function loadTasks() {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      state.tasks = [];
      return;
    }

    const parsed = JSON.parse(rawValue);
    state.tasks = Array.isArray(parsed)
      ? parsed.filter((item) => typeof item.id === "string" && typeof item.title === "string")
      : [];
  } catch (error) {
    console.error("Unable to load tasks from LocalStorage:", error);
    state.tasks = [];
  }
}

function setupContactForm() {
  Object.values(fields).forEach(({ input }) => {
    input.addEventListener("input", () => {
      validateField(input.name);
    });
  });

  dom.contactForm.addEventListener("reset", () => {
    window.setTimeout(() => {
      clearAllValidation();
    }, 0);
  });

  dom.clearFormBtn.addEventListener("click", () => {
    dom.formSuccess.textContent = "";
  });

  dom.contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    dom.formSuccess.textContent = "";

    const isFormValid = validateForm();
    if (!isFormValid) {
      return;
    }

    dom.contactForm.reset();
    clearAllValidation();
    dom.formSuccess.textContent = "Thanks! Your message passed frontend validation successfully.";
  });
}

function validateForm() {
  let isValid = true;

  Object.keys(fields).forEach((fieldName) => {
    const fieldValid = validateField(fieldName);
    if (!fieldValid) {
      isValid = false;
    }
  });

  return isValid;
}

function validateField(fieldName) {
  const field = fields[fieldName];
  if (!field) {
    return true;
  }

  const { input, error, validate } = field;
  const message = validate(input.value);

  if (message) {
    input.classList.add("input-error");
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", error.id);
    error.textContent = message;
    return false;
  }

  input.classList.remove("input-error");
  input.setAttribute("aria-invalid", "false");
  input.removeAttribute("aria-describedby");
  error.textContent = "";
  return true;
}

function clearAllValidation() {
  Object.values(fields).forEach(({ input, error }) => {
    input.classList.remove("input-error");
    input.setAttribute("aria-invalid", "false");
    input.removeAttribute("aria-describedby");
    error.textContent = "";
  });
}

function generateTaskId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function escapeHtml(value) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  };
  return value.replace(/[&<>"']/g, (char) => map[char]);
}

init();
