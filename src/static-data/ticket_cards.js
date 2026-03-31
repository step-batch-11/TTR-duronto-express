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
    { id: "PLD-PHX", src: "Portland", dest: "Phoenix", points: 11 },
    { id: "DLS-NYC", src: "Dallas", dest: "New York", points: 11 },
    { id: "CLC-SLC", src: "Calgary", dest: "Salt Lake City", points: 7 },
    { id: "CLC-PHX", src: "Calgary", dest: "Phoenix", points: 13 },
    { id: "LAS-MIM", src: "Los Angeles", dest: "Miami", points: 20 },
    { id: "WPG-LRK", src: "Winnipeg", dest: "Little Rock", points: 11 },
    { id: "SFO-ATL", src: "San Francisco", dest: "Atlanta", points: 17 },
    { id: "KCT-HTN", src: "Kansas City", dest: "Houston", points: 5 },
    { id: "LAS-CHG", src: "Los Angeles", dest: "Chicago", points: 16 },
    { id: "DVR-PBH", src: "Denver", dest: "Pittsburgh", points: 11 },
    { id: "CHG-SFE", src: "Chicago", dest: "Santa Fe", points: 9 },
    { id: "VCR-SFE", src: "Vancouver", dest: "Santa Fe", points: 13 },
    { id: "BSN-MIM", src: "Boston", dest: "Miami", points: 12 },
    { id: "CHG-NOL", src: "Chicago", dest: "New Orleans", points: 7 },
    { id: "MTL-ATL", src: "Montreal", dest: "Atlanta", points: 9 },
    { id: "STL-LAS", src: "Seattle", dest: "Los Angeles", points: 9 },
    { id: "DVR-ELP", src: "Denver", dest: "El Paso", points: 4 },
    { id: "HLN-LAS", src: "Helena", dest: "Los Angeles", points: 8 },
    { id: "WPG-HTN", src: "Winnipeg", dest: "Houston", points: 12 },
    { id: "MTL-NOL", src: "Montreal", dest: "New Orleans", points: 13 },
    { id: "SSM-OKC", src: "Sault St. Marie", dest: "Oklahoma City", points: 9 },
    { id: "STL-NYC", src: "Seattle", dest: "New York", points: 22 },
  ];

  return shuffle(ticketCards);
};