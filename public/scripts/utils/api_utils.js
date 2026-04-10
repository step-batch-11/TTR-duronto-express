const readJson = (res) => res.json();
const readText = (res) => res.text();

export const apiGet = (path) => fetch(path).then(readJson);
export const apiGetText = (path) => fetch(path).then(readText);

const postArgs = (data) => ({ method: "post", body: JSON.stringify(data) });

export const apiPost = (path, data) =>
  fetch(path, postArgs(data)).then(readJson);
