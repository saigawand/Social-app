class Temple {
  constructor(name, visitors) {
    this.name = name;
    this.visitors = visitors;
  }

  static calculateTotalVisitors(templeList) {
    let totalVisitors = 0;
    for (let i = 0; i < templeList.length; i++) {
      totalVisitors += templeList[i].visitors;
    }
    return totalVisitors;
  }

  static main() {
    const prompt = require('prompt-sync')();

    const numberOfTemples = parseInt(prompt('Enter the number of temples: '));

    const templeList = [];
    for (let i = 0; i < numberOfTemples; i++) {
      const name = prompt(`Enter the name of temple ${i + 1}: `);
      const visitors = parseInt(prompt(`Enter the number of visitors for temple ${i + 1}: `));

      const temple = new Temple(name, visitors);
      templeList.push(temple);
    }

    const totalVisitors = Temple.calculateTotalVisitors(templeList);

    console.log(`Total visitors to all temples: ${totalVisitors}`);
  }
}

Temple.main();
