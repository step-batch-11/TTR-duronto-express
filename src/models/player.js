export default class Player {
  #carCards;
  #claimedTickets;
  #bogies;
  #claimedRoutes;
  #colors;
  #color;
  #playerId;
  #name;

  constructor(name, id, index) {
    this.colors = ["green", "yellow", "blue", "purple", "red"];
    this.#carCards = {};
    this.#name = name;
    this.#claimedTickets = [];
    this.#bogies = 45;
    this.#claimedRoutes = [];
    this.#color = this.colors[index];
    this.#playerId = id;
  }

  addCarCardToHand(carCard) {
    const cardCount = this.#carCards[carCard] || 0;
    this.#carCards[carCard] = cardCount + 1;
  }

  claimTickets(tickets) {
    this.#claimedTickets.push(...tickets);

    return structuredClone(this.#claimedTickets);
  }

  getPlayerHand() {
    const cards = Object.entries(this.#carCards);
    const handCards = Object.fromEntries(
      cards.filter(([color]) => color !== "undefined"),
    );
    return {
      carCards: handCards,
      claimedTickets: structuredClone(this.#claimedTickets),
      bogies: this.#bogies,
    };
  }

  #removeExhaustedCard(color) {
    if (this.#carCards[color] === 0) delete this.#carCards[color];
  }

  #reconcile(color, count) {
    this.#carCards[color] = this.#carCards[color] - count;
  }

  #removeUsedBogies(count) {
    this.#bogies = this.#bogies - count;
  }

  claimRoute(
    routeId,
    routeData,
    { colorCardUsed, colorCardCount, wildCardCount },
  ) {
    if (colorCardUsed !== null) {
      this.#reconcile(colorCardUsed, colorCardCount);
      this.#removeExhaustedCard(colorCardUsed);
    }

    if (this.#carCards["wild"] > 0) {
      this.#reconcile("wild", wildCardCount);
      this.#removeExhaustedCard("wild");
    }

    const clrCardCount = colorCardCount || 0;
    const wCardCount = wildCardCount || 0;

    this.#removeUsedBogies(clrCardCount + wCardCount);
    this.#claimedRoutes.push({ routeId, routeData });
  }

  getPlayerId() {
    return this.#playerId;
  }

  getPlayerColor() {
    return this.#color;
  }

  getClaimedRoutes() {
    return structuredClone(this.#claimedRoutes);
  }

  set playerBogies(bogies) { // for testing the game end condition
    this.#bogies = bogies;
  }

  getClaimedTickets() {
    return structuredClone(this.#claimedTickets);
  }

  #makeGraph(claimedRoute) {
    const graph = {};
    for (const { routeId } of claimedRoute) {
      const [c1, c2] = routeId.split("-");
      if (graph[c1] === undefined) graph[c1] = [];
      if (graph[c2] === undefined) graph[c2] = [];
      graph[c1].push(c2);
      graph[c2].push(c1);
    }
    return graph;
  }

  #checkRoute(graph, city, to, visited) {
    if (city === to) return true;

    visited.add(city);

    for (const neighbor of graph[city] || []) {
      if (!visited.has(neighbor)) {
        if (this.#checkRoute(graph, neighbor, to, visited)) return true;
      }
    }

    return false;
  }

  #calculateTicketScore(graph, tickets, pointMap) {
    return tickets.reduce((total, ticket) => {
      const visited = new Set();
      const [src, dest] = ticket.split("-");
      const isDone = this.#checkRoute(graph, src, dest, visited);

      const ticketPoint = parseInt(pointMap[ticket]);
      const point = isDone ? 1 * ticketPoint : -1 * ticketPoint;
      total += point;
      return total;
    }, 0);
  }

  #calculatePointsOnRoute(routes, routeToScore) {
    return routes.reduce((total, route) => {
      const { routeLength } = route.routeData;
      const point = routeToScore[routeLength - 1];
      total += point;
      return total;
    }, 0);
  }

  calculateScore(pointMap, routeToScore) {
    const routeScore = this.#calculatePointsOnRoute(
      this.#claimedRoutes,
      routeToScore,
    );
    const graph = this.#makeGraph(this.#claimedRoutes);
    const ticketScore = this.#calculateTicketScore(
      graph,
      this.#claimedTickets,
      pointMap,
    );

    const total = routeScore + ticketScore;
    return {
      name: this.name,
      routeScore,
      ticketScore,
      total,
    };
  }

  get name() {
    return this.#name;
  }

  get color() {
    return this.#color;
  }

  get bogiesCount() {
    return this.#bogies;
  }

  get ticketCount() {
    return this.#claimedTickets.length;
  }
}
