import { apiPost } from "./utils/api_utils.js";
import { Q } from "./utils/web_utils.js";

const onSubmit = async (e) => {
  e.preventDefault();
  const maxPlayer = Q("#maxPlayer").value;
  await apiPost("/room/create", { maxPlayer });
  globalThis.location.href = "/waiting_room.html";
};

const main = () => {
  Q("form").addEventListener("submit", onSubmit);
};

globalThis.onload = main;
