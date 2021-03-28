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
  if (obj.species === "Pigeon") {
    // return standard fact for pigeons
    this.getFact = function () {
      return this.fact;
    };
  }
}

Dino.prototype = Object.create(Animal.prototype);
Dino.prototype.getFact = function () {
  // TODO: FIll out getFact method
};
Dino.prototype.render = function (person, parentElement) {
  // Function on new prototype, not inherited
  // TODO: FIll out render method
  console.dir(this);
};

// Read dino.json data

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
const testDino = new Dino({
  species: "Triceratops",
  weight: 13000,
  height: 114,
  diet: "herbivore",
  where: "North America",
  when: "Late Cretaceous",
  fact: "First discovered in 1889 by Othniel Charles Marsh",
});

// Create Human Constructor
function Human(obj) {
  Animal.call(this, obj);
  this.name = obj.name;
  this.render = function (parentElement) {
    // since there will only be one Human object adding method here
    // TODO: FIll out render method
    console.dir(this);
  };
}

Human.prototype = Object.create(Animal.prototype);
// Human.prototype.render = function(parent) {
//    NOTE: This is where to override the method on prototype
// }

// Create Human Object
const testHuman = new Human({
  name: "Ian Malcolm",
  height: 76,
  weight: 197,
  diet: "carnivore",
});

// Use IIFE to get human data from form

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.

// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.

// Generate Tiles for each Dino in Array

// Add tiles to DOM

// Remove form from screen

// On button click, prepare and display infographic
addButtonFunctionality("btn", compareHandler);

function compareHandler() {
  document.getElementById("dino-compare").style.display = "none";
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
