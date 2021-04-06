// Create Animal Constructor
function Animal(obj) {
  this.height = obj.height;
  this.weight = obj.weight;
  this.diet = obj.diet.toLowerCase();
}

// Create Dino Constructor
function Dino(obj) {
  Animal.call(this, obj);
  this.species = obj.species;
  this.region = obj.where;
  this.period = obj.when;
  this.fact = obj.fact;

  // Return standard fact for pigeons
  if (obj.species === "Pigeon")
    this.getFact = function () {
      return this.fact;
    };
}

Dino.prototype = Object.create(Animal.prototype);

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs.
Dino.prototype.compareWeight = function (person) {
  if (this.weight < person.weight)
    return (
      "You are the same weight as " +
      Math.round((person.weight / this.weight) * 10) / 10 +
      ` typical ${this.species}s.`
    );
  if (this.weight > person.weight)
    return (
      `The typical ${this.species} weighed ` +
      Math.round(this.weight - person.weight) +
      " pounds more than you."
    );
  return `You weigh the same as the typical ${this.species}.`;
};

// Create Dino Compare Method 2
// NOTE: Height in JSON file is in inches.
Dino.prototype.compareHeight = function (person) {
  const diff = this.height - person.height;
  if (diff === 0) return `You are the same weight as a ${this.species}`;
  return (
    `The typical ${this.species} was ` +
    formatInches(diff) +
    (diff > 0 ? " taller " : " shorter ") +
    "than you."
  );
};

// Create Dino Compare Method 3
Dino.prototype.compareDiet = function (person) {
  if (this.diet == person.diet)
    return `You and the ${this.species} are both ${this.diet}s.`;
  return `The ${this.species} was a ${this.diet}.`;
};

Dino.prototype.getFact = function (person) {
  // create array to hold all facts per dino
  // allows for easy addition of compare methods
  const facts = [];

  formatInches = function (inches) {
    const feetDiff = Math.floor(Math.abs(inches / 12));
    const inchDiff = Math.round(Math.abs(inches % 12));
    return (
      (feetDiff ? `${feetDiff} ${feetDiff == 1 ? "foot" : "feet"}` : "") +
      (feetDiff && inchDiff ? " " : "") +
      (inchDiff ? `${inchDiff} inches` : "")
    );
  };

  // adds " and" after the last comma in text
  commaAnd = function (text) {
    const pos = text.lastIndexOf(",");
    if (pos > 0)
      return text.substring(0, pos) + ", and " + text.substring(pos + 1);
    return text;
  };

  // add original facts
  facts.push(this.fact);
  facts.push(
    `An average ${this.species} stood ${formatInches(this.height)} tall.`
  );
  facts.push(`The average ${this.species} weighed ${this.weight} pounds.`);
  facts.push(
    `The ${this.species} could be found in ` + `${commaAnd(this.region)}.`
  );
  facts.push(`The ${this.species} lived during the ${this.period} period.`);

  // add alternate facts
  facts.push(this.compareWeight(person));
  facts.push(this.compareHeight(person));
  facts.push(this.compareDiet(person));

  // Randomly return one of the facts for each dino
  return facts[Math.floor(Math.random() * facts.length)];
};

Dino.prototype.render = function (parentElement, person) {
  const tile = document.createElement("div");
  tile.className = "grid-item";

  const heading = document.createElement("h3");
  heading.innerText = this.species;
  tile.appendChild(heading);

  const image = document.createElement("img");
  image.setAttribute("src", `images/${this.species.toLowerCase()}.png`);
  tile.appendChild(image);

  const fact = document.createElement("p");
  fact.innerText = this.getFact(person);
  tile.appendChild(fact);

  parentElement.appendChild(tile);
};

// Read dino.json data, push it into dinoData array
const dinoData = [];

readJSONFile("dino.json", (resp) => {
  dinoData.push(...JSON.parse(resp).Dinos);
});

function readJSONFile(file, callback) {
  const rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = () => {
    if (rawFile.readyState === 4 && rawFile.status === 200)
      callback(rawFile.responseText);
  };
  rawFile.send(null);
}

// Create Dino Objects
const animals = [];

function populateAnimals(person) {
  // Copy dinoData array into dinoOptions (retain original for next run)
  const dinoOptions = [...dinoData];

  // Find the pigeon remove it from the new array and set it aside
  const pigeonIndex = dinoOptions.findIndex(
    (dino) => dino.species === "Pigeon"
  );
  const pigeon = new Dino(dinoOptions.splice(pigeonIndex, 1)[0]);

  // Ensure animals array is empty
  animals.splice(0, animals.length);

  // Randomly choose 6 dinos and insert in animals array.
  // This allows randomly choosing from more than eight dinos
  // if more are added to the JSON document.
  for (i = 0; i < 7; i++) {
    const index = Math.floor(Math.random() * dinoOptions.length);
    const newDino = new Dino(dinoOptions.splice(index, 1)[0]);
    animals.push(newDino);
  }

  // Place the pigeon in a random place in the animals array
  const index = Math.floor(Math.random() * 8);
  animals.splice(index, 0, pigeon);

  // Insert the human in the center of the animals array
  animals.splice(4, 0, person);

  // Ensure the grid is empty
  const grid = document.getElementById("grid");
  removeAllChildNodes(grid);

  // Generate Tiles for each Dino in Array
  // Add tiles to DOM
  for (const animal of animals) {
    animal.render(grid, person);
  }
}

// Create Human Constructor
function Human(obj) {
  Animal.call(this, obj);
  this.name = obj.name;
  this.render = function (parentElement) {
    // Since there will only be one Human object adding method here
    const tile = document.createElement("div");
    tile.className = "grid-item";

    const h3 = document.createElement("h3");
    h3.innerText = this.name;
    tile.appendChild(h3);

    const image = document.createElement("img");
    image.setAttribute("src", `images/human.png`);
    tile.appendChild(image);

    parentElement.appendChild(tile);
  };
}

Human.prototype = Object.create(Animal.prototype);

// Create Human Object
let human = {};

// On button click, prepare and display infographic
addButtonFunctionality("btn", compareHandler);

function compareHandler() {
  // If this is the first time compare has been clicked
  const btn = document.getElementById("btn");
  if (btn.innerText !== "Compare Me Again!") {
    // Remove form from screen
    document.getElementById("dino-compare").style.display = "none";

    // Use IIFE to get human data from form
    human = (function () {
      let height =
        parseInt(document.getElementById("feet").value * 12) +
        parseInt(document.getElementById("inches").value);

      return new Human({
        name: document.getElementById("name").value,
        height: height,
        weight: parseInt(document.getElementById("weight").value),
        diet: document.getElementById("diet").value,
      });
    })();

    // Move button to footer and change label to Compare Me Again!
    btn.innerText = "Compare Me Again!";
    document.getElementsByTagName("footer")[0].prepend(btn);
  }

  populateAnimals(human);
}

function addButtonFunctionality(id, callBack) {
  let el = document.getElementById(id);
  el.tabIndex = 0;
  el.onclick = callBack;
  el.addEventListener("keyup", (event) => {
    event.preventDefault();
    if (event.code === "Space" || event.code === "Enter") compareHandler();
  });
}

// Add button to compare again

// function to remove all child nodes from container
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
