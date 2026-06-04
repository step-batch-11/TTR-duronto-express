import { apiGet } from "./utils/api_utils.js";
import { createLeaderboard, displayWinner } from "./render.js";

const displayLeaderboard = async () => {
  const { winner, scores } = await apiGet("/game/leaderboard");
  const homeBtn = document.querySelector("#homeBtn");
  homeBtn.addEventListener("click", async () => {
    const { status } = await apiGet("/room/reset");
    if (status) {
      globalThis.location.href = "./lobby.html";
    }
  });

  displayWinner(winner);
  createLeaderboard(scores);
};

globalThis.onload = displayLeaderboard;
