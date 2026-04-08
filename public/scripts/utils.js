export const createCarCardImg = (color) => {
  const img = document.createElement("img");
  img.setAttribute("src", `/assets/car-cards-images/${color}.jpg`);

  return img;
};

export const showAlert = (message) => {
  const dialogBox = document.getElementById("alert-box");
  dialogBox.classList.add("active-alert");
  dialogBox.querySelector("p").textContent = message;
  dialogBox.show();
  setTimeout(() => {
    dialogBox.close();
    dialogBox.classList.remove("active-alert");
  }, 2000);
};
