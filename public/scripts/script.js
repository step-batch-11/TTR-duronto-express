const fetchPlayerDetails = () => {
  return [
    {
      name: "a",
      symbol: "green",
      carCount: 45,
    },
    {
      name: "b",
      symbol: "red",
      carCount: 45,
    },
    {
      name: "v",
      symbol: "blue",
      carCount: 45,
    },
  ];
};

const appendPlayer = ({ name, symbol, carCount }, container, template) => {
  const clone = template.content.cloneNode(true);
  clone.querySelector(".identifier .name").textContent = name;
  clone.querySelector(".identifier .symbol").style.backgroundColor = symbol;

  clone.querySelector(".train-car-data img").setAttribute("src", "/something");
  clone.querySelector(".train-car-data .car-count").textContent = carCount;

  container.append(clone);
};

const displayPlayers = (players) => {
  const playerTemplate = document.querySelector("#user");
  const container = document.querySelector(".player-details");
  players.forEach((player) => {
    appendPlayer(player, container, playerTemplate);
  });
};

const fetchFaceUpCards = () => {
  return ["red", "green", "wild", "yellow", "blue"];
};

const displayFaceUpCards = (cards) => {
  const cardTemplate = document.querySelector("#face-up-cards");
  const container = document.querySelector(".faceup-cards");
  cards.forEach((card, index) => {
    const clone = cardTemplate.content.cloneNode(true);
    clone.querySelector(".card").id = index;
    clone.querySelector(".card img").setAttribute(
      "src",
      `./assets/car-cards-images/${card}.jpg`,
    );
    container.append(clone);
  });
};

globalThis.onload = () => {
  fetchPlayerDetails().then(displayPlayers);
  fetchFaceUpCards().then(displayFaceUpCards);
};
