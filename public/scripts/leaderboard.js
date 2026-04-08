import { fetchLeaderboardData } from "./api.js";
import { createLeaderboard, displayWinner } from "./render.js";

const displayLeaderboard = async () => {
  const { winner, scores } = await fetchLeaderboardData();

  displayWinner(winner);
  createLeaderboard(scores);
};

globalThis.onload = displayLeaderboard;
