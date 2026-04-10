import { apiPost } from "./utils/api_utils.js";
import { Q } from "./utils/web_utils.js";

const main = () => {
  const form = Q("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const roomId = new FormData(form).get("roomId");
    const res = await apiPost("/room/join", { roomId });

    if (res.isValidRoom) {
      return (globalThis.location.href = "/waiting_room.html");
    }

    document.querySelector(".alert").textContent = res.error;
  });
};

globalThis.onload = main;
