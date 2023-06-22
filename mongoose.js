const prompt = require('prompt-sync')();
const mongoose = require('mongoose');

// Define the Mongoose schema for City
const citySchema = new mongoose.Schema({
  name: String
});

// Define the Mongoose schema for Leg
const legSchema = new mongoose.Schema({
  source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  },
  cost: Number
});

// Define the Mongoose schema for Route
const routeSchema = new mongoose.Schema({
  legs: [legSchema]
});

// Create Mongoose models
const CityModel = mongoose.model('City', citySchema);
const LegModel = mongoose.model('Leg', legSchema);
const RouteModel = mongoose.model('Route', routeSchema);

async function performCRUD() {
  // Connect to MongoDB and specify the database name as "Routes"
  await mongoose.connect('mongodb+srv://sairajendragbsc22:vlVcF0CREaQm6j4J@cluster0.aordgu9.mongodb.net/Routes?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Create a new route
    let route = new RouteModel();

    // Get the number of legs from the user
    let n = parseInt(prompt("Enter the number of legs in the route: "));

    // Get the details of each leg
    for (let i = 1; i <= n; i++) {
      let sourceCityName = prompt(`Enter the source city for leg ${i}: `);
      let destinationCityName = prompt(`Enter the destination city for leg ${i}: `);
      let cost = parseFloat(prompt(`Enter the cost for leg ${i}: `));

      // Create or find the source city
      let sourceCity = await CityModel.findOne({ name: sourceCityName });
      if (!sourceCity) {
        sourceCity = new CityModel({ name: sourceCityName });
        await sourceCity.save();
      }

      // Create or find the destination city
      let destinationCity = await CityModel.findOne({ name: destinationCityName });
      if (!destinationCity) {
        destinationCity = new CityModel({ name: destinationCityName });
        await destinationCity.save();
      }

      let leg = new LegModel({ source: sourceCity, destination: destinationCity, cost });
      route.legs.push(leg);
    }

    let totalCost = route.legs.reduce((sum, leg) => sum + leg.cost, 0);

    // Save the route to the database
    await route.save();
    console.log('Route saved to the database.');

    // Read the routes from the database
    const savedRoutes = await RouteModel.find().populate('legs.source legs.destination');
    console.log('Saved routes:');
    console.log(savedRoutes);
  } catch (error) {
    console.log('An error occurred:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
  }
}

performCRUD();
