import { fetchLeaderboardData } from "./api.js";
import { createLeaderboard, displayWinner } from "./render.js";

const displayLeaderboard = async () => {
  const { winner, scores } = await fetchLeaderboardData();
  createLeaderboard(scores);
  displayWinner(winner);
};

globalThis.onload = displayLeaderboard;
