import { apiPost } from "./utils/api_utils.js";
import { Q } from "./utils/web_utils.js";

const main = () => {
  const form = Q("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const roomId = new FormData(form).get("roomId");
    const res = await apiPost("/join-room", { roomId });

    if (res.isValidRoom) {
      globalThis.location.href = "/waiting_room.html";
      return;
    }

    document.querySelector(".alert").textContent = res.error;
  });
};

globalThis.onload = main;
