// src/js/sub.js
import api from "../api/axiosConfig";

export async function getAccommo(id) {
  if (!id) return null;
  try {
    const res = await api.get(`http://localhost:8080/api/accommo/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
