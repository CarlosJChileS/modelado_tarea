const API = 'http://localhost:4000/api';
const app = document.getElementById("app");

let userSession = null; // Guardamos usuario logueado

// --- Login ---
function renderLogin(error = "") {
  app.innerHTML = `
    <div class="center-box">
      <div class="left-side">
        <div class="icon-circle">✔</div>
        <h2>TaskMate</h2>
        <div>La forma más sencilla de gestionar tus tareas diarias y aumentar tu productividad.</div>
        <ul>
          <li><span class="checkmark">✔</span> Organiza tus tareas fácilmente</li>
          <li><span class="checkmark">✔</span> Marca tareas como completadas</li>
          <li><span class="checkmark">✔</span> Elimina tareas innecesarias</li>
        </ul>
      </div>
      <div class="right-side">
        <h3>Iniciar Sesión</h3>
        <p>Ingresa tus credenciales para continuar</p>
        <form id="loginForm">
          <label for="login-email">Email</label>
          <input id="login-email" type="email" placeholder="usuario@ejemplo.com" required />
          <label for="login-pass">Contraseña</label>
          <input id="login-pass" type="password" placeholder="********" required />
          <button class="form-btn" type="submit">Iniciar Sesión</button>
          <div class="info-small">
            ¿No tienes cuenta? <a href="#" id="goToRegister" class="text-link">Regístrate</a>
          </div>
          <div style="color:red;font-size:1rem; margin-top:7px;">${error}</div>
        </form>
      </div>
    </div>
  `;
  document.getElementById("goToRegister").onclick = (e) => {
    e.preventDefault();
    renderRegister();
  };
  document.getElementById("loginForm").onsubmit = handleLogin;
}

// --- Registro ---
function renderRegister(error = "") {
  app.innerHTML = `
    <div class="center-box">
      <div class="left-side">
        <div class="icon-circle">✔</div>
        <h2>TaskMate</h2>
        <div>Únete hoy y comienza a organizar tus tareas de manera eficiente.</div>
      </div>
      <div class="right-side">
        <h3>Crear una cuenta</h3>
        <p>Completa tus datos para comenzar</p>
        <form id="registerForm">
          <div style="display:flex;gap:10px;">
            <div style="flex:1;">
              <label for="reg-nombre">Nombre</label>
              <input id="reg-nombre" type="text" placeholder="Nombre" required />
            </div>
            <div style="flex:1;">
              <label for="reg-apellido">Apellido</label>
              <input id="reg-apellido" type="text" placeholder="Apellido" required />
            </div>
          </div>
          <label for="reg-email">Email</label>
          <input id="reg-email" type="email" placeholder="usuario@ejemplo.com" required />
          <label for="reg-pass">Contraseña</label>
          <input id="reg-pass" type="password" placeholder="********" required />
          <label for="reg-pass2">Confirmar Contraseña</label>
          <input id="reg-pass2" type="password" placeholder="********" required />

          <button class="form-btn" type="submit">Crear cuenta</button>
          <div class="info-small">
            ¿Ya tienes cuenta? <a href="#" id="goToLogin" class="text-link">Iniciar sesión</a>
          </div>
          <div style="color:red;font-size:1rem; margin-top:7px;">${error}</div>
        </form>
      </div>
    </div>
  `;
  document.getElementById("goToLogin").onclick = (e) => {
    e.preventDefault();
    renderLogin();
  };
  document.getElementById("registerForm").onsubmit = handleRegister;
}

// --- Registro y Login API ---
async function handleRegister(e) {
  e.preventDefault();
  const nombre = document.getElementById("reg-nombre").value.trim();
  const apellido = document.getElementById("reg-apellido").value.trim();
  const email = document.getElementById("reg-email").value.trim().toLowerCase();
  const pass = document.getElementById("reg-pass").value;
  const pass2 = document.getElementById("reg-pass2").value;
  if (!nombre || !apellido) return renderRegister("Debes ingresar tu nombre y apellido.");
  if (!email.includes("@")) return renderRegister("El email no es válido.");
  if (pass.length < 5) return renderRegister("La contraseña debe tener al menos 5 caracteres.");
  if (pass !== pass2) return renderRegister("Las contraseñas no coinciden.");

  try {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, apellido, email, pass })
    });
    if (res.ok) {
      renderLogin("¡Registro exitoso! Ahora puedes iniciar sesión.");
    } else {
      const data = await res.json();
      renderRegister(data.error || "Error en el registro");
    }
  } catch {
    renderRegister("Error de red");
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const pass = document.getElementById("login-pass").value;
  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pass })
    });
    if (res.ok) {
      const data = await res.json();
      userSession = data.user; // { id, nombre, apellido, email }
      renderTodo();
    } else {
      const data = await res.json();
      renderLogin(data.error || "Error en el login");
    }
  } catch {
    renderLogin("Error de red");
  }
}

function handleLogout() {
  userSession = null;
  renderLogin();
}

// --- Calcular tiempo relativo ---
function tiempoRelativo(fechaISO) {
  const ahora = new Date();
  const fecha = new Date(fechaISO);
  const segundos = Math.floor((ahora - fecha) / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  if (dias > 0) return `Hace ${dias} día${dias === 1 ? '' : 's'}`;
  if (horas > 0) return `Hace ${horas} hora${horas === 1 ? '' : 's'}`;
  if (minutos > 0) return `Hace ${minutos} minuto${minutos === 1 ? '' : 's'}`;
  return 'Hace unos segundos';
}

// --- Vista de tareas ---
function renderTodo() {
  if (!userSession) return renderLogin();
  app.innerHTML = `
    <nav class="menu-bar">
      <div class="menu-left">
        <span class="taskmate-logo"><span class="icon-circle-nav">✔</span> <b>TaskMate</b></span>
      </div>
      <div class="menu-right">
        Hola, ${userSession.nombre || "Usuario"}
        <div class="user-initial">${userSession.nombre ? userSession.nombre[0].toUpperCase() : "U"}</div>
        <button class="logout-btn" onclick="handleLogout()">Cerrar sesión</button>
      </div>
    </nav>
    <div class="todo-main">
      <h2>Mis Tareas</h2>
      <div class="todo-desc">Gestiona tus tareas diarias</div>
      <div class="add-task-box">
        <input type="text" id="task-input" placeholder="Agregar nueva tarea..." />
        <button id="add-task-btn">Agregar</button>
      </div>
      <ul class="task-list" id="task-list"></ul>
    </div>
  `;
  loadTasks();
  document.getElementById("add-task-btn").onclick = addTask;
}

async function loadTasks() {
  if (!userSession) return;
  try {
    const res = await fetch(`${API}/tasks?userId=${encodeURIComponent(userSession.id)}`);
    const tasks = await res.json();
    showTasks(tasks);
  } catch {
    showTasks([]);
  }
}

async function addTask() {
  const input = document.getElementById("task-input");
  const taskText = input.value.trim();
  if (!taskText) return;
  await fetch(`${API}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: userSession.id, text: taskText })
  });
  input.value = "";
  loadTasks();
}

// Mostrar lista de tareas (eliminar y editar solo diseño)
function showTasks(tasks) {
  const list = document.getElementById("task-list");
  list.innerHTML = "";
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = task.completada ? "completed" : "";

    // Checkbox para completar tarea
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = !!task.completada;
    checkbox.onchange = async () => {
      await fetch(`${API}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userSession.id })
      });
      loadTasks();
    };

    // Texto tarea
    const span = document.createElement("span");
    span.textContent = task.texto;

    // Hora relativa
    const timeSpan = document.createElement("span");
    timeSpan.className = "task-time";
    timeSpan.textContent = tiempoRelativo(task.fecha);

    // Botón modificar (solo diseño)
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "✎";
    /* Funcionalidad comentada:
    editBtn.onclick = () => {
      // Aquí iría el código para modificar la tarea
    };
    */

    // Botón eliminar (solo diseño)
    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "✗";
    /* Funcionalidad comentada:
    delBtn.onclick = async () => {
      await fetch(`${API}/tasks/${task.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userSession.id })
      });
      loadTasks();
    };
    */

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(timeSpan);
    li.appendChild(editBtn);
    li.appendChild(delBtn);

    list.appendChild(li);
  });
}

// Cargar vista inicial
renderLogin();
