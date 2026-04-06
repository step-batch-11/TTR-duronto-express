globalThis.onload = () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const maxPlayer = document.querySelector("#maxPlayer").value;

    await fetch("/create-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ maxPlayer }),
    });

    globalThis.location.href = "/waiting_room.html";
  });
};
