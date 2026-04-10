import { apiGet } from "./utils/api_utils.js";
import { createLeaderboard, displayWinner } from "./render.js";

const displayLeaderboard = async () => {
  const { winner, scores } = await apiGet("/game/leaderboard");

  displayWinner(winner);
  createLeaderboard(scores);
};

globalThis.onload = displayLeaderboard;
