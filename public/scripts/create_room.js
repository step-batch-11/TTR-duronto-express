import { apiPost } from "./api.js";

const Q = (sel) => document.querySelector(sel);

const onSubmit = async (e) => {
  e.preventDefault();
  const maxPlayer = Q("#maxPlayer").value;
  await apiPost("/create-room", { maxPlayer });
  globalThis.location.href = "/waiting_room.html";
};

const main = () => {
  Q("form").addEventListener("submit", onSubmit);
};

globalThis.onload = main;
