const prompt = require('prompt-sync')();

class City {
  constructor(name) {
    this.name = name;
  }
}

class Leg {
  constructor(source, destination, cost) {
    this.source = source;
    this.destination = destination;
    this.cost = cost;
  }
}

class Route {
  constructor() {
    this.legs = [];
  }

  addLeg(leg) {
    this.legs.push(leg);
  }

  getTotalCost() {
    let totalCost = 0;
    for (let leg of this.legs) {
      totalCost += leg.cost;
    }
    return totalCost;
  }
}

function main() {
  let route = new Route();

  // Get the number of legs from the user
  let n = parseInt(prompt("Enter the number of legs in the route: "));

  // Get the details of each leg
  for (let i = 1; i <= n; i++) {
    let source = new City(prompt(`Enter the source city for leg ${i}: `));
    let destination = new City(prompt(`Enter the destination city for leg ${i}: `));
    let cost = parseFloat(prompt(`Enter the cost for leg ${i}: `));

    let leg = new Leg(source, destination, cost);
    route.addLeg(leg);
  }

  let totalCost = route.getTotalCost();
  console.log(`The total cost of the trip is: ${totalCost}`);
}

main();
