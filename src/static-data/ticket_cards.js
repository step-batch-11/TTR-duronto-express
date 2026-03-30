export const getTicketCards = () => {
  const ticketCards = [
    { id: "t1", src: "Helena", dest: "Duluth", points: 12 },
    { id: "t2", src: "Saint Louis", dest: "St Marie", points: 6 },
    { id: "t3", src: "Chicago", dest: "New Orleans", points: 7 },
    { id: "t4", src: "Denver", dest: "El Paso", points: 4 },
    { id: "t5", src: "Winnipeg", dest: "Little Rock", points: 11 },
  ];

  return shuffle(ticketCards);
};
