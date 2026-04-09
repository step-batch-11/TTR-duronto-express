import { apiGet } from "./api.js";
import { createLeaderboard, displayWinner } from "./render.js";

const displayLeaderboard = async () => {
  const { winner, scores } = await apiGet("/get-leaderboard");

  displayWinner(winner);
  createLeaderboard(scores);
};

globalThis.onload = displayLeaderboard;
