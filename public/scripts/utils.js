import { fetchLog } from "./api.js";
import { displayLog } from "./render.js";

export const createCarCardImg = (color) => {
  const img = document.createElement("img");
  img.setAttribute("src", `/assets/car-cards-images/${color}.jpg`);

  return img;
};

export const handleLog = async (msg) => {
  const body = { msg };
  const log = await fetchLog(body);
  displayLog(log);
};
