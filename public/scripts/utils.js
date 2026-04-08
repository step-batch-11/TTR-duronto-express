export const createCarCardImg = (color) => {
  const img = document.createElement("img");
  img.setAttribute("src", `/assets/car-cards-images/${color}.webp`);

  return img;
};
