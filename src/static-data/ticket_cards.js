import { shuffle } from "@std/random";

export const getTicketCards = () => {
  const ticketCards = [
    { id: "HLN-DLT", src: "Helena", dest: "Duluth", points: 12 },
    { id: "SLS-SSM", src: "St Louis", dest: "St Marie", points: 6 },
    { id: "CHG-NOL", src: "Chicago", dest: "New Orleans", points: 7 },
    { id: "DVR-ELP", src: "Denver", dest: "El Paso", points: 4 },
    { id: "WPG-LRK", src: "Winnipeg", dest: "Little Rock", points: 11 },
  ];

  return shuffle(ticketCards);
};
