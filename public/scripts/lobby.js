globalThis.onload = () => {
  document.querySelector(".create").addEventListener("click", (e) => {
    e.preventDefault();
    globalThis.location.href = "/host.html";
  });

  document.querySelector(".join").addEventListener("click", (e) => {
    e.preventDefault();
    globalThis.location.href = "/join.html";
  });

  document.querySelector(".manual").addEventListener("click", (e) => {
    e.preventDefault();
    globalThis.location.href = "/manual.pdf";
  });
};
