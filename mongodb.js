const prompt = require('prompt-sync')();
const { MongoClient } = require('mongodb');

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

async function performCRUD() {
  const uri = 'mongodb+srv://sairajendragbsc22:vlVcF0CREaQm6j4J@cluster0.aordgu9.mongodb.net/?retryWrites=true&w=majority'; // MongoDB connection string
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db('mydatabase');
    const collection = database.collection('routes');

    // Create a new route
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

    // Insert the route into the MongoDB collection
    await collection.insertOne({ route, totalCost });
    console.log('Route saved to the database.');

    // Read the routes from the MongoDB collection
    const savedRoutes = await collection.find().toArray();
    console.log('Saved routes:');
    console.log(savedRoutes);

    // Update a route
    const updateQuery = { totalCost: { $lt: 100 } };
    const updateOperation = { $set: { totalCost: 200 } };
    await collection.updateMany(updateQuery, updateOperation);
    console.log('Routes updated.');

    // Read the updated routes from the MongoDB collection
    const updatedRoutes = await collection.find().toArray();
    console.log('Updated routes:');
    console.log(updatedRoutes);

    // Delete a route
    const deleteQuery = { totalCost: { $gte: 200 } };
    await collection.deleteMany(deleteQuery);
    console.log('Routes deleted.');

    // Read the remaining routes from the MongoDB collection
    const remainingRoutes = await collection.find().toArray();
    console.log('Remaining routes:');
    console.log(remainingRoutes);
  } catch (error) {
    console.log('An error occurred:', error);
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}

performCRUD();
