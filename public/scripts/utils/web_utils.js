export const Q = (sel) => document.querySelector(sel);

export const cloneTemplate = (sel) => Q(sel).content.cloneNode(true);
