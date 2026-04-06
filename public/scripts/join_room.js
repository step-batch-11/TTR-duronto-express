globalThis.onload = () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = new FormData(form).get("roomId");

    await fetch("/join-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId: id }),
    });

    globalThis.location.href = "/waiting_room.html";
  });
};
