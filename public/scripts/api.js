const postArgs = (data) => ({ method: "post", body: JSON.stringify(data) });
const readJson = (res) => res.json();
const readText = (res) => res.text();

export const apiPost = (path, data) =>
  fetch(path, postArgs(data)).then(readJson);
export const apiGet = (path) => fetch(path).then(readJson);
export const apiGetText = (path) => fetch(path).then(readText);
