const STORAGE_KEY = "focusCeroDataV1";

const defaultData = {

  tasks: [

    {
      id: crypto.randomUUID(),
      title: "Colegio",
      subject: "Clases",
      time: "08:00",
      duration: 360,
      priority: "medium",
      done: true
    },

    {
      id: crypto.randomUUID(),
      title: "Comida y descanso",
      subject: "Descanso",
      time: "15:30",
      duration: 30,
      priority: "low",
      done: true
    },

    {
      id: crypto.randomUUID(),
      title: "Física",
      subject: "Estudio profundo",
      time: "16:40",
      duration: 80,
      priority: "high",
      done: false
    },

    {
      id: crypto.randomUUID(),
      title: "PAES Historia",
      subject: "Repaso y ejercicios",
      time: "18:20",
      duration: 60,
      priority: "medium",
      done: false
    },

    {
      id: crypto.randomUUID(),
      title: "Matemática PAES",
      subject: "Práctica",
      time: "19:30",
      duration: 60,
      priority: "high",
      done: false
    },

    {
      id: crypto.randomUUID(),
      title: "Ejercicio",
      subject: "Entrenamiento",
      time: "21:00",
      duration: 45,
      priority: "low",
      done: false
    }

  ],

  sessions: [],

  studyMinutes: 0,

  habits: [

    {
      id: 1,
      name: "Dormí 8 horas",
      done: false
    },

    {
      id: 2,
      name: "Hice ejercicio",
      done: false
    },

    {
      id: 3,
      name: "Estudié una materia profunda",
      done: false
    },

    {
      id: 4,
      name: "Dejé el celular lejos",
      done: false
    }

  ]

};

const weekTemplate = {

  "Lun": [

    [
      "08:00",
      "Colegio",
      "Clases"
    ],

    [
      "17:00",
      "Comida y descanso",
      "Recuperación"
    ],

    [
      "18:00",
      "Lenguaje",
      "Tarea ligera"
    ],

    [
      "19:30",
      "Matemática NS",
      "Bloque profundo"
    ],

    [
      "22:30",
      "Dormir",
      "8 horas"
    ]

  ],

  "Mar": [

    [
      "08:00",
      "Colegio",
      "Clases"
    ],

    [
      "15:30",
      "Comida y descanso",
      "Descanso"
    ],

    [
      "16:40",
      "Física",
      "Estudio profundo"
    ],

    [
      "18:20",
      "PAES Historia",
      "Repaso y ejercicios"
    ],

    [
      "19:30",
      "Matemática PAES",
      "Práctica"
    ]

  ],

  "Mié": [

    [
      "08:00",
      "Colegio",
      "Clases"
    ],

    [
      "15:30",
      "Repaso escolar",
      "20–30 minutos"
    ],

    [
      "16:30",
      "Economía NS",
      "Trabajo principal"
    ],

    [
      "18:00",
      "Inglés",
      "Reading y vocabulario"
    ],

    [
      "19:30",
      "Física",
      "Ejercicios"
    ]

  ],

  "Jue": [

    [
      "08:00",
      "Colegio",
      "Clases"
    ],

    [
      "15:30",
      "Repaso escolar",
      "20–30 minutos"
    ],

    [
      "16:30",
      "Matemática NS",
      "Bloque profundo"
    ],

    [
      "18:15",
      "Lenguaje PAES",
      "Comprensión lectora"
    ],

    [
      "19:30",
      "Física o Matemática",
      "Refuerzo"
    ]

  ],

  "Vie": [

    [
      "08:00",
      "Colegio",
      "Clases"
    ],

    [
      "15:30",
      "Repaso escolar",
      "Cierre semanal"
    ],

    [
      "16:30",
      "Economía",
      "Trabajo urgente"
    ],

    [
      "18:00",
      "TOK / Teatro / CAS",
      "Bloque ligero"
    ],

    [
      "19:30",
      "Corrección semanal",
      "Errores y pendientes"
    ]

  ],

  "Sáb": [

    [
      "10:00",
      "Simulacro PAES",
      "Prueba completa"
    ],

    [
      "12:30",
      "Corrección",
      "Registro de errores"
    ],

    [
      "16:00",
      "Física o Matemática",
      "Refuerzo"
    ],

    [
      "18:00",
      "CAS o negocio",
      "Proyecto personal"
    ]

  ],

  "Dom": [

    [
      "10:30",
      "Repaso de errores",
      "Repetición espaciada"
    ],

    [
      "12:00",
      "Inglés",
      "Práctica ligera"
    ],

    [
      "16:00",
      "CAS o negocio",
      "Proyecto personal"
    ],

    [
      "19:00",
      "Planificación semanal",
      "Preparar la semana"
    ]

  ]

};

let data = loadData();

let activeFilter = "all";

let selectedDay = "Mar";

let timerSeconds = 45 * 60;

let timerInitialSeconds = timerSeconds;

let timerInterval = null;

let timerRunning = false;

let currentZeroStep = "C";

function loadData() {

  try {

    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );

    return saved
      ? {
          ...defaultData,
          ...saved
        }
      : structuredClone(defaultData);

  } catch {

    return structuredClone(defaultData);

  }

}

function saveData() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );

  renderAll();

}

function priorityColor(priority) {

  if (priority === "high") {
    return "#ff2b49";
  }

  if (priority === "medium") {
    return "#9b5cff";
  }

  return "#00d77f";

}

function formatDuration(minutes) {

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  const remainingMinutes =
    minutes % 60;

  if (remainingMinutes) {

    return `${hours}h ${remainingMinutes}m`;

  }

  return `${hours}h`;

}

function endTime(start, duration) {

  const [hour, minute] =
    start
      .split(":")
      .map(Number);

  const totalMinutes =
    hour * 60 +
    minute +
    Number(duration);

  const endHour =
    Math.floor(totalMinutes / 60) % 24;

  const endMinute =
    totalMinutes % 60;

  return (
    `${String(endHour).padStart(2, "0")}:` +
    `${String(endMinute).padStart(2, "0")}`
  );

}

function showToast(message) {

  const toast =
    document.getElementById("toast");

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(
    function () {

      toast.classList.remove("show");

    },
    2600
  );

}

function renderDate() {

  const date = new Date();

  const formattedDate =
    new Intl.DateTimeFormat(
      "es-CL",
      {
        weekday: "long",
        day: "numeric",
        month: "long"
      }
    ).format(date);

  document.getElementById(
    "todayDate"
  ).textContent = formattedDate;

}

function renderToday() {

  const container =
    document.getElementById(
      "todayActivities"
    );

  const tasks =
    [...data.tasks].sort(
      function (a, b) {

        return a.time.localeCompare(
          b.time
        );

      }
    );

  container.innerHTML =
    tasks.map(
      function (task) {

        return `

          <article
            class="activity ${task.done ? "done" : ""}"
            style="--accent:${priorityColor(task.priority)}"
          >

            <div class="activity-time">
              ${task.time}
            </div>

            <div>

              <h4>
                ${escapeHtml(task.title)}
              </h4>

              <p>
                ${escapeHtml(task.subject)}
                ·
                ${formatDuration(task.duration)}
              </p>

            </div>

            <button
              onclick="toggleTask('${task.id}')"
              aria-label="Completar"
            >
              ${task.done ? "✓" : "○"}
            </button>

          </article>

        `;

      }
    ).join("");

  const done =
    tasks.filter(
      function (task) {

        return task.done;

      }
    ).length;

  const total =
    tasks.length;

  const percent =
    total
      ? Math.round(
          done / total * 100
        )
      : 0;

  document.getElementById(
    "activityCount"
  ).textContent =
    `${done} de ${total}`;

  document.getElementById(
    "progressPercent"
  ).textContent =
    `${percent}%`;

  document.getElementById(
    "progressRing"
  ).style.setProperty(
    "--progress",
    `${percent * 3.6}deg`
  );

  const next =
    tasks.find(
      function (task) {

        return !task.done;

      }
    );

  document.getElementById(
    "nextTitle"
  ).textContent =
    next
      ? next.title
      : "Día completado";

  document.getElementById(
    "nextSubtitle"
  ).textContent =
    next
      ? `${next.subject} · ${next.time}–${endTime(next.time, next.duration)}`
      : "Excelente trabajo. Descansa.";

}

function renderTasks() {

  const list =
    document.getElementById(
      "taskList"
    );

  const tasks =
    data.tasks.filter(
      function (task) {

        if (activeFilter === "pending") {

          return !task.done;

        }

        if (activeFilter === "done") {

          return task.done;

        }

        return true;

      }
    );

  if (!tasks.length) {

    list.innerHTML = `

      <p class="muted">
        No hay tareas en esta categoría.
      </p>

    `;

    return;

  }

  list.innerHTML =
    tasks.map(
      function (task) {

        const priorityName =
          task.priority === "high"
            ? "Alta"
            : task.priority === "medium"
            ? "Media"
            : "Baja";

        return `

          <article
            class="task-item"
            style="--accent:${priorityColor(task.priority)}"
          >

            <div>

              <h4>
                ${escapeHtml(task.title)}
              </h4>

              <p>
                ${escapeHtml(task.subject)}
              </p>

              <div class="task-meta">

                <span class="tag">
                  ${task.time}
                </span>

                <span class="tag">
                  ${formatDuration(task.duration)}
                </span>

                <span class="tag">
                  ${priorityName}
                </span>

              </div>

            </div>

            <div class="task-actions">

              <button
                onclick="toggleTask('${task.id}')"
                title="Completar"
              >
                ${task.done ? "↶" : "✓"}
              </button>

              <button
                onclick="deleteTask('${task.id}')"
                title="Eliminar"
              >
                ⌫
              </button>

            </div>

          </article>

        `;

      }
    ).join("");

}

function renderWeekTabs() {

  const tabs =
    document.getElementById(
      "weekTabs"
    );

  tabs.innerHTML =
    Object.keys(
      weekTemplate
    ).map(
      function (day) {

        return `

          <button
            class="chip day-chip ${day === selectedDay ? "active" : ""}"
            onclick="selectDay('${day}')"
          >

            <strong>
              ${day}
            </strong>

            <small>
              ${day === "Mar" ? "Hoy" : ""}
            </small>

          </button>

        `;

      }
    ).join("");

}

function renderWeekPlan() {

  const container =
    document.getElementById(
      "weekPlan"
    );

  container.innerHTML =
    weekTemplate[selectedDay].map(
      function (item) {

        return `

          <article class="plan-row">

            <time>
              ${item[0]}
            </time>

            <div>

              <h4>
                ${item[1]}
              </h4>

              <p>
                ${item[2]}
              </p>

            </div>

          </article>

        `;

      }
    ).join("");

}

function renderProgress() {

  document.getElementById(
    "studyTimeStat"
  ).textContent =
    formatDuration(
      data.studyMinutes
    );

  document.getElementById(
    "completedStat"
  ).textContent =
    data.tasks.filter(
      function (task) {

        return task.done;

      }
    ).length;

  document.getElementById(
    "sessionsStat"
  ).textContent =
    data.sessions.length;

  const list =
    document.getElementById(
      "habitList"
    );

  list.innerHTML =
    data.habits.map(
      function (habit) {

        return `

          <label class="habit">

            <input
              type="checkbox"
              ${habit.done ? "checked" : ""}
              onchange="toggleHabit(${habit.id})"
            >

            <span>
              ${escapeHtml(habit.name)}
            </span>

            <b>
              ${habit.done ? "✓" : "—"}
            </b>

          </label>

        `;

      }
    ).join("");

}

function renderAll() {

  renderDate();

  renderToday();

  renderTasks();

  renderWeekTabs();

  renderWeekPlan();

  renderProgress();

}

window.toggleTask =
  function (id) {

    const task =
      data.tasks.find(
        function (taskItem) {

          return taskItem.id === id;

        }
      );

    if (!task) {
      return;
    }

    task.done = !task.done;

    saveData();

  };

window.deleteTask =
  function (id) {

    data.tasks =
      data.tasks.filter(
        function (task) {

          return task.id !== id;

        }
      );

    saveData();

    showToast(
      "Tarea eliminada"
    );

  };

window.selectDay =
  function (day) {

    selectedDay = day;

    renderWeekTabs();

    renderWeekPlan();

  };

window.toggleHabit =
  function (id) {

    const habit =
      data.habits.find(
        function (habitItem) {

          return habitItem.id === id;

        }
      );

    if (!habit) {
      return;
    }

    habit.done =
      !habit.done;

    saveData();

  };

function escapeHtml(value) {

  return String(value).replace(
    /[&<>"']/g,
    function (character) {

      const characters = {

        "&": "&amp;",

        "<": "&lt;",

        ">": "&gt;",

        '"': "&quot;",

        "'": "&#039;"

      };

      return characters[character];

    }
  );

}

document.querySelectorAll(
  ".nav-item"
).forEach(
  function (button) {

    button.addEventListener(
      "click",
      function () {

        document.querySelectorAll(
          ".nav-item"
        ).forEach(
          function (navButton) {

            navButton.classList.remove(
              "active"
            );

          }
        );

        button.classList.add(
          "active"
        );

        const screen =
          button.dataset.screen;

        document.querySelectorAll(
          ".screen"
        ).forEach(
          function (screenElement) {

            screenElement.classList.remove(
              "active"
            );

          }
        );

        document.getElementById(
          `screen-${screen}`
        ).classList.add(
          "active"
        );

        const pageTitles = {

          hoy: "Hoy",

          plan: "Plan semanal",

          tareas: "Tareas",

          estudiar: "Estudiar",

          progreso: "Progreso"

        };

        document.getElementById(
          "pageTitle"
        ).textContent =
          pageTitles[screen];

        window.scrollTo({

          top: 0,

          behavior: "smooth"

        });

      }
    );

  }
);

document.querySelectorAll(
  "[data-filter]"
).forEach(
  function (button) {

    button.addEventListener(
      "click",
      function () {

        document.querySelectorAll(
          "[data-filter]"
        ).forEach(
          function (filterButton) {

            filterButton.classList.remove(
              "active"
            );

          }
        );

        button.classList.add(
          "active"
        );

        activeFilter =
          button.dataset.filter;

        renderTasks();

      }
    );

  }
);

const modal =
  document.getElementById(
    "taskModal"
  );

function openModal() {

  modal.classList.add(
    "open"
  );

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

}

function closeModal() {

  modal.classList.remove(
    "open"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

}

document.getElementById(
  "openTaskModalBtn"
).addEventListener(
  "click",
  openModal
);

document.getElementById(
  "openTaskModalBtn2"
).addEventListener(
  "click",
  openModal
);

document.getElementById(
  "closeTaskModalBtn"
).addEventListener(
  "click",
  closeModal
);

modal.addEventListener(
  "click",
  function (event) {

    if (event.target === modal) {

      closeModal();

    }

  }
);

document.getElementById(
  "taskForm"
).addEventListener(
  "submit",
  function (event) {

    event.preventDefault();

    const title =
      document.getElementById(
        "taskTitle"
      ).value.trim();

    const subject =
      document.getElementById(
        "taskSubject"
      ).value;

    const time =
      document.getElementById(
        "taskTime"
      ).value || "16:00";

    const duration =
      Number(
        document.getElementById(
          "taskDuration"
        ).value
      ) || 45;

    const priority =
      document.getElementById(
        "taskPriority"
      ).value;

    data.tasks.push({

      id: crypto.randomUUID(),

      title: title,

      subject: subject,

      time: time,

      duration: duration,

      priority: priority,

      done: false

    });

    event.target.reset();

    document.getElementById(
      "taskTime"
    ).value = "16:00";

    document.getElementById(
      "taskDuration"
    ).value = 45;

    closeModal();

    saveData();

    showToast(
      "Tarea guardada"
    );

  }
);

document.querySelectorAll(
  ".quick-action"
).forEach(
  function (button) {

    button.addEventListener(
      "click",
      function () {

        const action =
          button.dataset.action;

        if (action === "late") {

          showToast(
            "Plan de emergencia: prioridad alta primero y protege tu sueño."
          );

        }

        if (action === "tired") {

          showToast(
            "Hoy: una sesión profunda y un repaso ligero."
          );

        }

        if (action === "notime") {

          showToast(
            "Plan mínimo: 20 min prioridad + 10 min repaso + 10 min corrección."
          );

        }

      }
    );

  }
);

document.getElementById(
  "themeBtn"
).addEventListener(
  "click",
  function () {

    document.body.classList.toggle(
      "light"
    );

  }
);

document.getElementById(
  "startNextBtn"
).addEventListener(
  "click",
  function () {

    document.querySelector(
      '[data-screen="estudiar"]'
    ).click();

    startTimer();

  }
);

document.querySelectorAll(
  ".duration"
).forEach(
  function (button) {

    button.addEventListener(
      "click",
      function () {

        if (timerRunning) {

          showToast(
            "Pausa o reinicia antes de cambiar la duración."
          );

          return;

        }

        document.querySelectorAll(
          ".duration"
        ).forEach(
          function (durationButton) {

            durationButton.classList.remove(
              "active"
            );

          }
        );

        button.classList.add(
          "active"
        );

        timerSeconds =
          Number(
            button.dataset.minutes
          ) * 60;

        timerInitialSeconds =
          timerSeconds;

        updateTimer();

      }
    );

  }
);

function updateTimer() {

  const minutes =
    Math.floor(
      timerSeconds / 60
    );

  const seconds =
    timerSeconds % 60;

  document.getElementById(
    "timerDisplay"
  ).textContent =
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;

  const progress =
    timerInitialSeconds
      ? timerSeconds /
        timerInitialSeconds *
        100
      : 0;

  document.getElementById(
    "timerRing"
  ).style.setProperty(
    "--timer-progress",
    `${progress}%`
  );

}

function startTimer() {

  if (timerRunning) {

    clearInterval(
      timerInterval
    );

    timerRunning = false;

    document.getElementById(
      "timerStartBtn"
    ).textContent =
      "▶ Continuar";

    return;

  }

  timerRunning = true;

  document.getElementById(
    "timerStartBtn"
  ).textContent =
    "Ⅱ Pausar";

  timerInterval =
    setInterval(
      function () {

        timerSeconds--;

        updateTimer();

        if (timerSeconds <= 0) {

          clearInterval(
            timerInterval
          );

          timerRunning = false;

          document.getElementById(
            "timerStartBtn"
          ).textContent =
            "▶ Iniciar";

          data.studyMinutes +=
            Math.round(
              timerInitialSeconds / 60
            );

          saveData();

          showToast(
            "Sesión completada. Gran trabajo 🔥"
          );

        }

      },
      1000
    );

}

document.getElementById(
  "timerStartBtn"
).addEventListener(
  "click",
  startTimer
);

document.getElementById(
  "timerResetBtn"
).addEventListener(
  "click",
  function () {

    clearInterval(
      timerInterval
    );

    timerRunning = false;

    timerSeconds =
      timerInitialSeconds;

    updateTimer();

    document.getElementById(
      "timerStartBtn"
    ).textContent =
      "▶ Iniciar";

  }
);

document.querySelectorAll(
  ".zero-step"
).forEach(
  function (button) {

    button.addEventListener(
      "click",
      function () {

        document.querySelectorAll(
          ".zero-step"
        ).forEach(
          function (stepButton) {

            stepButton.classList.remove(
              "active"
            );

          }
        );

        button.classList.add(
          "active"
        );

        currentZeroStep =
          button.dataset.step;

      }
    );

  }
);

document.getElementById(
  "saveSessionBtn"
).addEventListener(
  "click",
  function () {

    const notes =
      document.getElementById(
        "sessionNotes"
      ).value.trim();

    data.sessions.push({

      id: crypto.randomUUID(),

      date:
        new Date().toISOString(),

      step:
        currentZeroStep,

      notes:
        notes

    });

    document.getElementById(
      "sessionNotes"
    ).value = "";

    saveData();

    showToast(
      "Sesión C.E.R.O. guardada"
    );

  }
);

document.getElementById(
  "resetWeekBtn"
).addEventListener(
  "click",
  function () {

    selectedDay = "Mar";

    renderWeekTabs();

    renderWeekPlan();

    showToast(
      "Semana restablecida"
    );

  }
);

if (
  "serviceWorker" in navigator
) {

  window.addEventListener(
    "load",
    function () {

      navigator.serviceWorker
        .register(
          "service-worker.js"
        )
        .catch(
          function (error) {

            console.error(
              "Error al registrar Service Worker:",
              error
            );

          }
        );

    }
  );

}

renderAll();

updateTimer();
