let countdownStarted = false;

const render = ({ roomId, players, maxPlayers }) => {
  document.querySelector("#room-id").textContent = roomId;
  document.querySelector("#player-count").textContent = players.length;
  document.querySelector("#max-players").textContent = maxPlayers;

  const list = document.querySelector("#players-list");
  list.innerHTML = "";

  players.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = p.username;
    list.appendChild(li);
  });
};

const startCountdown = () => {
  if (countdownStarted) return;
  countdownStarted = true;

  const startMsg = document.querySelector("#start-msg");
  let time = 5;

  startMsg.textContent = `Game starting in ${time}...`;

  const interval = setInterval(() => {
    time--;
    startMsg.textContent = `Game starting in ${time}...`;

    if (time === 0) {
      clearInterval(interval);
      globalThis.location.href = "/game.html";
    }
  }, 1000);
};

const pollRoom = async () => {
  try {
    const res = await fetch("/room-state");
    const data = await res.json();

    render(data);

    if (data.players.length === +data.maxPlayers) {
      startCountdown();
    }
  } catch (err) {
    console.error("Polling error:", err);
  }
};

const main = () => {
  setInterval(pollRoom, 2000);
  pollRoom();
};

globalThis.onload = main;
