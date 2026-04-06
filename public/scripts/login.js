const submitUsername = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const username = formData.get("username");
  const res = await fetch("/login", {
    method: "post",
    body: JSON.stringify({ username }),
    headers: {
      "content-type": "application/json",
    },
  });
  const { isLoggedIn } = await res.json();
  if (isLoggedIn) {
    globalThis.location.href = "/lobby.html";
  } else {
    globalThis.location.href = "/login.html";
  }
};

globalThis.onload = () => {
  const form = document.querySelector("#login-form");
  form.addEventListener("submit", submitUsername);
};
