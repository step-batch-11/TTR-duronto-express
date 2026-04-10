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
    this.#colors = ["green", "yellow", "blue", "purple", "red"];
    this.#carCards = {};
    this.#name = name;
    this.#claimedTickets = [];
    this.#bogies = 4;
    this.#claimedRoutes = [];
    this.#color = this.#colors[index];
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

  #makeCostMap(claimRoutes) {
    const graph = {};
    claimRoutes.forEach(({ routeId, routeData }) => {
      const [from, to] = routeId.split("-");
      if (graph[to] === undefined) graph[to] = {};
      if (graph[from] === undefined) graph[from] = {};
      graph[from][to] = routeData.routeLength;
      graph[to][from] = routeData.routeLength;
    });
    return graph;
  }

  #calculateDegree(claimedRoutes, trail) {
    const degreeMap = {};
    claimedRoutes.forEach(({ routeId }) => {
      const [from, to] = routeId.split("-");
      if (trail.includes(from) && trail.includes(to)) {
        if (degreeMap[from] === undefined) degreeMap[from] = 0;
        if (degreeMap[to] === undefined) degreeMap[to] = 0;
        degreeMap[from] += 1;
        degreeMap[to] += 1;
      }
    });
    return degreeMap;
  }

  #overlapped(forests, vertex) {
    const sets = [];
    forests.forEach((forest, index) => {
      if (forest.has(vertex)) {
        sets.push({ forest, index });
      }
    });
    return sets;
  }

  #mergeForests(overlaps, forests) {
    let mergedForest = new Set();

    overlaps.forEach(({ forest, index }) => {
      mergedForest = mergedForest.union(forest);
      forests.splice(index, 1);
    });
    forests.push(mergedForest);
    return forests;
  }

  #makeForest(claimedRoutes) {
    let forests = [];
    claimedRoutes.forEach(({ routeId }) => {
      const [from, to] = routeId.split("-");
      const overlaps = [];
      overlaps.push(...this.#overlapped(forests, from));
      overlaps.push(...this.#overlapped(forests, to));

      if (overlaps.length === 1) {
        const { index } = overlaps[0];
        forests[index].add(from);
        forests[index].add(to);
        return;
      }

      if (overlaps.length > 1) {
        forests = this.#mergeForests(overlaps, [...forests]);
        return;
      }

      const newForest = new Set();
      newForest.add(from);
      newForest.add(to);
      forests.push(newForest);
    });
    return forests;
  }

  #getAllSubsets(arr) {
    return [...arr]
      .reduce((subsets, value) =>
        subsets.concat(subsets
          .map((set) => [...set, value])), [[]])
      .filter((s) => s.length > 0);
  }

  #isValidTrail(trail) {
    let oddCount = 0;
    const degreeMap = this.#calculateDegree(this.#claimedRoutes, trail);

    for (const edge of trail) {
      oddCount += (degreeMap[edge] % 2) || 0;
    }

    return oddCount === 0 || oddCount === 2;
  }

  #calculateCost(trail, lengthMap) {
    let sum = 0;

    for (let prev = 0; prev < trail.length - 1; prev++) {
      const prevV = trail[prev];
      for (let cur = prev + 1; cur < trail.length; cur++) {
        const curV = trail[cur];
        sum += lengthMap[prevV][curV] || 0;
      }
    }

    return sum;
  }

  #findHighest(highest, cost) {
    return Math.max(highest, cost);
  }

  #calculateLongest(graph, claimedRoutes) {
    const allSubsets = this.#getAllSubsets(graph);
    const lengthMap = this.#makeCostMap(claimedRoutes);
    // const degreeMap = this.#calculateDegree(claimedRoutes);
    return allSubsets
      .filter((trail) => this.#isValidTrail(trail))
      .map((trail) => this.#calculateCost(trail, lengthMap))
      .reduce(this.#findHighest);
  }

  findLongest() {
    const forests = this.#makeForest(this.#claimedRoutes);

    return forests
      .map((graph) => this.#calculateLongest(graph, this.#claimedRoutes))
      .reduce(this.#findHighest, 0);
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
