import { apiPost } from "./utils/api_utils.js";
import { Q } from "./utils/web_utils.js";

const submitUsername = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const username = formData.get("username");
  const res = await apiPost("/auth/login", { username });

  if (res.isLoggedIn) return (globalThis.location.href = "/");

  // globalThis.location.href = "/login.html";
  Q(".alert").textContent = res.message;
};

const main = () => {
  Q("#login-form").addEventListener("submit", submitUsername);
};

globalThis.onload = main;
