import { shuffle } from "@std/random";

export const getTicketCards = () => {
  const ticketCards = [
    { id: "LAS-NYC", src: "Los Angeles", dest: "New York", points: 21 },
    { id: "DLT-HTN", src: "Duluth", dest: "Houston", points: 8 },
    { id: "SSM-NVL", src: "Sault St. Marie", dest: "Nashville", points: 8 },
    { id: "NYC-ATL", src: "New York", dest: "Atlanta", points: 6 },
    { id: "PLD-NVL", src: "Portland", dest: "Nashville", points: 17 },
    { id: "VCR-MTL", src: "Vancouver", dest: "Montreal", points: 20 },
    { id: "DLT-ELP", src: "Duluth", dest: "El Paso", points: 10 },
    { id: "TRT-MIM", src: "Toronto", dest: "Miami", points: 10 },
  ];

  return shuffle(ticketCards);
};
