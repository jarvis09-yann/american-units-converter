const metricSelect = document.querySelector("#metric-units-select");
const freedomSelect = document.querySelector("#freedom-units-select");
const swap = document.querySelector("#swap");
const metricField = document.querySelector("#metric-input");
const freedomField = document.querySelector("#freedom-input");
const copyMessage = document.querySelector("#copy-message");
let currentMetricUnit = "meter";
let currentMetricType = "distance";
let freedomValue = "";
const freedomUnits = {
  volume: {
    drop: { description: "Drop", metric: 0.00005 },
    teaspoon: { description: "Teaspoon", metric: 0.0049 },
    tablespoon: { description: "Tablespoon", metric: 0.0148 },
    fluidOunce: { description: "Fluid Ounce", metric: 0.0296 },
    sodaCan: { description: "Soda Can", metric: 0.355 },
    redSoloCup: { description: "Red Solo Cup", metric: 0.473 },
    pint: { description: "Pint", metric: 0.473 },
    quart: { description: "Quart", metric: 0.946 },
    milkJug: { description: "Milk Jug", metric: 3.785 },
    bigGulp: { description: "Big Gulp", metric: 1.3 },
    bucketOfChicken: { description: "Bucket of Fried Chicken", metric: 5.678 },
    keg: { description: "Beer Keg", metric: 58.67 },
    olympicPool: { description: "Olympic Swimming Pool", metric: 2500000 },
  },
  distance: {
    speck: { description: "Speck of Dust", metric: 0.000001 },
    riceGrain: { description: "Grain of Rice", metric: 0.007 },
    quarter: { description: "Quarter", metric: 0.02426 },
    dollar: { description: "Dollar Bill", metric: 0.156 },
    hotdog: { description: "Hot Dog", metric: 0.1524 },
    subwayFootlong: { description: "Subway Footlong", metric: 0.3048 },
    pickupTruck: { description: "Pickup Truck", metric: 5.49 },
    basketballCourt: { description: "Basketball Court", metric: 28.65 },
    footballField: { description: "Football Field", metric: 91.44 },
    statueOfLiberty: { description: "Statue of Liberty", metric: 92.7 },
    empireState: { description: "Empire State Building", metric: 443.2 },
    goldenGateBridge: { description: "Golden Gate Bridge", metric: 2737 },
    mississippiRiver: { description: "Mississippi River", metric: 3766080 },
    moon: { description: "Moon", metric: 384400000 },
    lightYear: { description: "Light Year", metric: 9460730472580800 },
  },
  weight: {
    dustMite: { description: "Dust Mite", metric: 0.0000001 },
    mnms: { description: "M&Ms", metric: 0.0009 },
    peanut: { description: "Peanut", metric: 0.0045 },
    burger: { description: "Quarter-Pound Burger", metric: 0.1134 },
    baconPack: { description: "Pack of Bacon", metric: 0.4536 },
    thanksgivingTurkey: { description: "Thanksgiving Turkey", metric: 6.8 },
    baldEagle: { description: "Bald Eagle", metric: 4.5 },
    washingMachine: { description: "Washing Machine", metric: 90 },
    fordF150: { description: "Ford F-150", metric: 2400 },
    elephant: { description: "Elephant", metric: 5000 },
    blueWhale: { description: "Blue Whale", metric: 150000 },
    spaceShuttle: { description: "Space Shuttle", metric: 2000000 },
    cargoShip: { description: "Cargo Ship", metric: 50000000 },
    oilTanker: { description: "Oil Tanker", metric: 200000000 },
  },
};

metricSelect.addEventListener("change", () => {
  currentMetricUnit = metricSelect.value;
  if (
    currentMetricUnit == "meter" ||
    currentMetricUnit == "kilometer" ||
    currentMetricUnit == "centimeter"
  ) {
    currentMetricType = "distance";
  }
  if (
    currentMetricUnit == "gram" ||
    currentMetricUnit == "kilogram" ||
    currentMetricUnit == "ton"
  ) {
    currentMetricType = "weight";
  }
  if (
    currentMetricUnit == "liter" ||
    currentMetricUnit == "centiliter" ||
    currentMetricUnit == "milliliter"
  ) {
    currentMetricType = "volume";
  }
  handleMetricInput();
});

metricField.addEventListener("input", () => {
  handleMetricInput();
});

swap.addEventListener("click", () => {
  metricField.value = freedomValue;
  handleMetricInput();
});

freedomField.addEventListener("click", () => {
  if (freedomField.value != "") {
    freedomField.select();
    freedomField.setSelectionRange(0, freedomField.value.length);

    navigator.clipboard.writeText(freedomField.value);
    copyMessage.style.opacity = "1";
    setTimeout(() => {
      copyMessage.style.opacity = "0";
    }, 1500);
  }
});

function handleMetricInput() {
  if (metricField.value == "") {
    freedomField.value = "";
    freedomValue = "";
    return;
  }
  let convertedValue = convertToUnit(currentMetricUnit, metricField.value);
  if (convertedValue <= 0.001) {
    freedomField.value = "That's quite small";
    return;
  }
  const closestUnit = getClosestFreedomUnit(convertedValue, currentMetricType);
  freedomValue = (convertedValue / closestUnit.metric).toFixed(2);
  freedomField.value = `${freedomValue} ${closestUnit.description}`;
  freedomField.value = freedomField.value.replace(".", ","); // for consistency
}

function getUnitByIndex(type, index) {
  return freedomUnits[type][Object.keys(freedomUnits[type])[index]];
}

function getClosestFreedomUnit(val, type) {
  let closestUnit = getUnitByIndex(type, 0);
  let smallestDiff = Math.abs(closestUnit.metric - val);

  for (let i = 1; i < Object.keys(freedomUnits[type]).length; i++) {
    const currentUnit = getUnitByIndex(type, i);
    const diff = Math.abs(currentUnit.metric - val);

    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestUnit = currentUnit;
    }
  }
  return closestUnit;
}

function convertToUnit(unit, value) {
  value = parseFloat(value);
  if (unit === "meter" || unit === "liter" || unit === "gram") {
    value *= 1;
  } else if (unit === "centimeter" || unit === "centiliter") {
    value /= 100;
  } else if (unit === "kilometer" || unit === "kilogram" || unit === "ton") {
    value *= 1000;
  } else if (unit === "milliliter") {
    value /= 1000;
  }
  return parseFloat(value.toFixed(6)); // Higher precision for smaller values
}
