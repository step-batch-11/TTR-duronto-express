import { apiPost } from "../utils/api_utils.js";

export const handleExitGame = async () => {
  globalThis.poller.pause();
  await apiPost("/game/exit");
  globalThis.location.href = "/lobby.html";
};
