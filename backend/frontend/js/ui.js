import { registerUser, loginUser, getTasks, createTask, toggleTask, deleteTask, editTask } from './api.js';

const app = document.getElementById("app");
let userSession = null;

// Utilidad para mostrar tiempos relativos
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

// Render login
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
        <form id="loginForm">
          <label>Email</label>
          <input id="login-email" type="email" required />
          <label>Contraseña</label>
          <input id="login-pass" type="password" required />
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
  document.getElementById("loginForm").onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const pass = document.getElementById("login-pass").value;
    const res = await loginUser({ email, pass });
    if (res.user) {
      userSession = res.user;
      renderTodo();
    } else {
      renderLogin(res.error || "Error en el login");
    }
  };
}

// Render registro
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
        <form id="registerForm">
          <label>Nombre</label>
          <input id="reg-nombre" type="text" required />
          <label>Apellido</label>
          <input id="reg-apellido" type="text" required />
          <label>Email</label>
          <input id="reg-email" type="email" required />
          <label>Contraseña</label>
          <input id="reg-pass" type="password" required />
          <label>Confirmar Contraseña</label>
          <input id="reg-pass2" type="password" required />
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
  document.getElementById("registerForm").onsubmit = async (e) => {
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
    const res = await registerUser({ nombre, apellido, email, pass });
    if (res.user) {
      renderLogin("¡Registro exitoso! Ahora puedes iniciar sesión.");
    } else {
      renderRegister(res.error || "Error en el registro");
    }
  };
}

// Render tareas
function renderTodo() {
  if (!userSession) return renderLogin();
  app.innerHTML = `
    <nav class="menu-bar">
      <div class="menu-left">
        <span class="taskmate-logo"><span class="icon-circle-nav">✔</span> <b>TaskMate</b></span>
      </div>
      <div class="menu-right">
        Hola, ${userSession.nombre}
        <div class="user-initial">${userSession.nombre[0].toUpperCase()}</div>
        <button class="logout-btn" id="logoutBtn">Cerrar sesión</button>
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
  document.getElementById("logoutBtn").onclick = () => {
    userSession = null;
    renderLogin();
  };
  document.getElementById("add-task-btn").onclick = async () => {
    const input = document.getElementById("task-input");
    const text = input.value.trim();
    if (!text) return;
    await createTask(userSession.id, text);
    input.value = "";
    showTasks();
  };
  showTasks();
}

// Mostrar tareas del usuario logueado
async function showTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "<li>Cargando...</li>";
  const tasks = await getTasks(userSession.id);
  list.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completada ? "completed" : "";

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = !!task.completada;
    checkbox.onchange = async () => {
      await toggleTask(task.id, userSession.id);
      showTasks();
    };

    // Texto
    const span = document.createElement("span");
    span.textContent = task.texto;

    // Fecha
    const timeSpan = document.createElement("span");
    timeSpan.className = "task-time";
    timeSpan.textContent = tiempoRelativo(task.fecha);

    // Editar (comentado)
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "✎";
    
    editBtn.onclick = async () => {
      const nuevoTexto = prompt("Editar tarea:", task.texto);
      if (nuevoTexto && nuevoTexto.trim() && nuevoTexto !== task.texto) {
        await editTask(task.id, userSession.id, nuevoTexto.trim());
        showTasks();
      }
    };
    

    // Eliminar (comentado)
    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "✗";
    
    delBtn.onclick = async () => {
      await deleteTask(task.id, userSession.id);
      showTasks();
    };
  

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(timeSpan);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// Inicia la app en login
renderLogin();
