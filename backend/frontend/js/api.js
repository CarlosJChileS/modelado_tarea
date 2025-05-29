const PORT = process.env.PORT ;
const API = process.env.BASE_URL || `http://localhost:${PORT}/api`;

// ---------- AUTH ----------
export async function registerUser({ nombre, apellido, email, pass }) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, apellido, email, pass })
  });
  return res.json();
}

export async function loginUser({ email, pass }) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, pass })
  });
  return res.json();
}

// ---------- TAREAS ----------
export async function getTasks(userId) {
  const res = await fetch(`${API}/tasks?userId=${userId}`);
  return res.json();
}

export async function createTask(userId, text, materiaId = null, etiquetas = []) {
  const res = await fetch(`${API}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, text, materiaId, etiquetas })
  });
  return res.json();
}

export async function toggleTask(id, userId) {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  return res.json();
}

export async function deleteTask(id, userId) {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  return res.json();
}

export async function editTask(id, userId, text, materiaId = null, etiquetas = []) {
  const res = await fetch(`${API}/tasks/edit/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, text, materiaId, etiquetas })
  });
  return res.json();
}

// ---------- MATERIAS ----------
export async function getMaterias(userId) {
  const res = await fetch(`${API}/materias?userId=${userId}`);
  return res.json();
}

export async function createMateria(userId, nombre) {
  const res = await fetch(`${API}/materias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, nombre })
  });
  return res.json();
}

// ---------- ETIQUETAS ----------
export async function getEtiquetas() {
  const res = await fetch(`${API}/etiquetas`);
  return res.json();
}

export async function createEtiqueta(nombre, color, prioridad) {
  const res = await fetch(`${API}/etiquetas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, color, prioridad })
  });
  return res.json();
}
