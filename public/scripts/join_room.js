globalThis.onload = () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = new FormData(form).get("roomId");

    const res = await fetch("/join-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId: id }),
    }).then((x) => x.json());

    if (res.isValidRoom) {
      globalThis.location.href = "/waiting_room.html";
    } else {
      document.querySelector(".alert").textContent = res.error;
    }
  });
};
