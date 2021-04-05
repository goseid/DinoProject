// Create Animal Constructor
function Animal(obj) {
  this.height = obj.height;
  this.weight = obj.weight;
  this.diet = obj.diet;
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
Dino.prototype.getFact = function () {
  // TODO: return randomized facts
  return this.fact;
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
  console.log("dinoData:", dinoData);
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
    console.log("Random Number" + index);
    const newDino = new Dino(dinoOptions.splice(index, 1)[0]);
    animals.push(newDino);
  }

  // Place the pigeon in a random place in the animals array
  const index = Math.floor(Math.random() * 7);
  animals.splice(index, 0, pigeon);

  // Insert the human in the center of the animals array
  animals.splice(4, 0, person);

  // Generate Tiles for each Dino in Array
  // Add tiles to DOM
  for (const animal of animals) {
    animal.render(document.getElementById("grid"));
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
const testHuman = new Human({
  name: "Ian Malcolm",
  height: 76,
  weight: 197,
  diet: "carnivore",
});

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.

// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.

// On button click, prepare and display infographic
addButtonFunctionality("btn", compareHandler);

function compareHandler() {
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

// TODO: Remove test data fill
// Load form with test data to simplify testing
document.getElementById("name").value = "Ian Malcolm";
document.getElementById("feet").value = 6;
document.getElementById("inches").value = 4;
document.getElementById("weight").value = 197;
document.getElementById("diet").selectedIndex = Math.floor(Math.random() * 3);
