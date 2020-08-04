//Coding Challenge #1
var markMassKG = 87;
var markHeightMeters = 1.7;
var johnMassKG = 86;
var johnHeightMeters = 1.8;

var markBMI = markMassKG / (markHeightMeters * markHeightMeters);
console.log("Mark's BMI: ", markBMI);

var johnBMI = johnMassKG / (johnHeightMeters * johnHeightMeters);
console.log("John's BMI: ", johnBMI);

var isMarkBMIHigher = markBMI > johnBMI;

console.log("Is Mark's BMI higher than John's? " + isMarkBMIHigher);