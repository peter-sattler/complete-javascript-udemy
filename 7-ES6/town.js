//Section 7: Coding Challenge 8
class Element {
    constructor(name, buildYear) {
        this.name = name;
        this.buildYear = buildYear;
    }
}

class Park extends Element {
    constructor(name, buildYear, area, nbrOfTrees) {
        super(name, buildYear);
        this.area = area;
        this.nbrOfTrees = nbrOfTrees;
    }
    treeDensity() {
        const density = this.nbrOfTrees / this.area;
        console.log(`${this.name} has a tree density of ${density} trees per square mile.`);
    }
}

class Street extends Element {
    constructor(name, buildYear, length, size = 3) {
        super(name, buildYear);
        this.length = length;
        this.size = size;
    }
    classifyStreet() {
        const classification = new Map();
        classification.set(1, 'tiny');
        classification.set(2, 'small');
        classification.set(3, 'normal');
        classification.set(4, 'big');
        classification.set(5, 'huge');
        console.log(`${this.name}, built in ${this.buildYear}, is a ${classification.get(this.size)} street.`);
    }
}

const allParks = [new Park('Green Park', 1987, 0.2, 215),
                  new Park('National Park', 1894, 2.9, 3541),
                  new Park('Oak Park', 1953, 0.4, 949)];

const allStreets = [new Street('Ocean Avenue', 1999, 1.1, 4),
                    new Street('Evergreen Street', 2008, 2.7, 2),
                    new Street('4th Street', 2015, 0.8),
                    new Street('Sunset Boulevard', 1982, 2.5, 5)];

const sumReducer = (accumulator, currentValue) => accumulator + currentValue;

function parksReport(parks) {
    console.log('-----PARK REPORT-----');
    //Average park age:
    const ages = parks.map(park => new Date().getFullYear() - park.buildYear);
    console.log(`Our ${parks.length} parks have an average of ${ages.reduce(sumReducer) / parks.length} years.`);
    
    parks.forEach(park => park.treeDensity());  //Tree density
    
    //Park with more than 1,000 trees:
    const index = parks.map(park => park.nbrOfTrees).findIndex(element => element >= 1000);
    console.log(`${parks[index].name} has more than 1000 trees.`);
}

function streetReport(streets) {
    console.log('-----STREET REPORT-----');
    //Total and average length:
    const totalLength = streets.map(street => street.length).reduce(sumReducer);
    console.log(`Our ${streets.length} streets have a total length of ${totalLength} miles, with an average of ${totalLength / streets.length} miles.`);
    
    streets.forEach(street => street.classifyStreet());  //Street classification
}

parksReport(allParks);
streetReport(allStreets);
