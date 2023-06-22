const express = require('express');
const app = express();
const port = 3000;

const prompt = require('prompt-sync')();
app.use(express.json());

class Leg {
  constructor(source, destination, cost) {
    this.source = source;
    this.destination = destination;
    this.cost = cost;
  }
}

class Route {
  constructor(id) {
    this.id = id;
    this.legs = [];
  }

  addLeg(leg) {
    this.legs.push(leg);
  }

  calculateTotalCost() {
    let totalCost = 0;
    for (const leg of this.legs) {
      totalCost += leg.cost;
    }
    return totalCost;
  }
}

let routes = [];

// POST - Create a new route
app.post('/route', (req, res) => {
  const id = routes.length + 1;
  const route = new Route(id);
  const numOfLegs = parseInt(prompt('Enter the number of legs in the route: '));

  for (let i = 0; i < numOfLegs; i++) {
    const source = prompt(`Enter the source city of leg ${i + 1}: `);
    const destination = prompt(`Enter the destination city of leg ${i + 1}: `);
    const cost = parseInt(prompt(`Enter the cost of leg ${i + 1}: `));

    const leg = new Leg(source, destination, cost);
    route.addLeg(leg);
  }

  routes.push(route);
  res.status(201).json(route);
});

// GET - Get all routes
app.get('/route', (req, res) => {
  res.json(routes);
});

// GET - Get a specific route by ID
app.get('/route/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const route = routes.find(route => route.id === id);
  if (route) {
    res.json(route);
  } else {
    res.status(404).json({});
  }
});

// GET - Get the total cost of a specific route by ID
app.get('/route/:id/total-cost', (req, res) => {
  const id = parseInt(req.params.id);

  const route = routes.find(route => route.id === id);
  if (route) {
    const totalCost = route.calculateTotalCost();
    res.json({ totalCost });
  } else {
    res.status(404).json({});
  }
});

// PUT - Update a route by ID
app.put('/route/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const routeIndex = routes.findIndex(route => route.id === id);

  if (routeIndex !== -1) {
    const numOfLegs = parseInt(prompt('Enter the number of legs in the route: '));

    routes[routeIndex].legs = []; // Clear existing legs

    for (let i = 0; i < numOfLegs; i++) {
      const source = prompt(`Enter the source city of leg ${i + 1}: `);
      const destination = prompt(`Enter the destination city of leg ${i + 1}: `);
      const cost = parseInt(prompt(`Enter the cost of leg ${i + 1}: `));

      const leg = new Leg(source, destination, cost);
      routes[routeIndex].addLeg(leg);
    }

    res.json(routes[routeIndex]);
  } else {
    res.status(404).json({ error: 'Route not found' });
  }
});

// DELETE - Delete a route by ID
app.delete('/route/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const routeIndex = routes.findIndex(route => route.id === id);

  if (routeIndex !== -1) {
    const deletedRoute = routes.splice(routeIndex, 1);
    res.json(deletedRoute[0]);
  } else {
    res.status(404).json({ error: 'Route not found' });
  }
});

// PUT - Update a leg in a route by ID
app.put('/route/:routeId/leg/:legId', (req, res) => {
  const routeId = parseInt(req.params.routeId);
  const legId = parseInt(req.params.legId);

  const route = routes.find(route => route.id === routeId);

  if (route) {
    const legIndex = route.legs.findIndex(leg => leg.id === legId);

    if (legIndex !== -1) {
      const source = prompt('Enter the updated source city: ');
      const destination = prompt('Enter the updated destination city: ');
      const cost = parseInt(prompt('Enter the updated cost: '));

      route.legs[legIndex].source = source;
      route.legs[legIndex].destination = destination;
      route.legs[legIndex].cost = cost;

      res.json(route.legs[legIndex]);
    } else {
      res.status(404).json({ error: 'Leg not found' });
    }
  } else {
    res.status(404).json({ error: 'Route not found' });
  }
});

// DELETE - Delete a leg from a route by ID
app.delete('/route/:routeId/leg/:legId', (req, res) => {
  const routeId = parseInt(req.params.routeId);
  const legId = parseInt(req.params.legId);

  const route = routes.find(route => route.id === routeId);

  if (route) {
    const legIndex = route.legs.findIndex(leg => leg.id === legId);

    if (legIndex !== -1) {
      const deletedLeg = route.legs.splice(legIndex, 1);
      res.json(deletedLeg[0]);
    } else {
      res.status(404).json({ error: 'Leg not found' });
    }
  } else {
    res.status(404).json({ error: 'Route not found' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
