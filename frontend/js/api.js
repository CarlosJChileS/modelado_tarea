const API = 'http://localhost:4000/api';

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

export async function getTasks(userId) {
  const res = await fetch(`${API}/tasks?userId=${userId}`);
  return res.json();
}

export async function createTask(userId, text) {
  const res = await fetch(`${API}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, text })
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

export async function editTask(id, userId, text) {
  const res = await fetch(`${API}/tasks/edit/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, text })
  });
  return res.json();
}
