const claimRoute = (e) => {
  const userData = {
    color: "green",
  };

  const route = e.target.closest(".route");
  if (route.getAttribute("data-owner-color") === "none") {
    route.setAttribute("data-owner-color", userData.color);
  } else {
    route.setAttribute("data-owner-color", "none");
  }
};

const loadRoute = (map) => {
  const data = [
    { id: "route-STL-CLC", trackColor: "transparent" },
    { id: "route-HLN-CLC", trackColor: "transparent" },
    { id: "route-STL-HLN", trackColor: "yellow" },
    { id: "route-STL-VCR", trackColor: "transparent" },
    { id: "route-VCR-CLC", trackColor: "transparent" },
  ];

  data.forEach((route) => {
    const track = map.querySelector(`#${route.id}`);
    track.setAttribute("data-route-color", route.trackColor);
    track.setAttribute("data-owner-color", "none");
  });
};

globalThis.onload = async () => {
  const mapContainer = document.querySelector("#map");

  await fetch("/assets/map.svg")
    .then((res) => res.text())
    .then((data) => {
      const parser = new DOMParser();
      const map = parser.parseFromString(data, "image/svg+xml").documentElement;
      mapContainer.appendChild(map);
    });

  const routes = document.querySelectorAll(".route");
  loadRoute(mapContainer);
  routes.forEach((route) => {
    route.addEventListener("click", claimRoute);
  });
};
