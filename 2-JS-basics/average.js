//Coding Challenge #2
var johnAvg = (89 + 120 + 103) / 3;
var mikeAvg = (116 + 94 + 123) / 3;
var maryAvg = (97 + 134 + 105) / 3;

console.log('Averages: ', johnAvg, mikeAvg, maryAvg);

//UNCOMMENT FOR TIE: 
//maryAvg = mikeAvg = johnAvg;

switch(true) {
    case johnAvg > mikeAvg && johnAvg > maryAvg:
        console.log('John\'s team wins: ', johnAvg);
        break;
    case mikeAvg > johnAvg && mikeAvg > maryAvg:
        console.log('Mike\'s team wins: ', mikeAvg);
        break;
    case maryAvg > johnAvg && maryAvg > mikeAvg:
        console.log('Mary\'s team wins: ', maryAvg);
        break;
    default:
        console.log('All 3 teams tie: ', johnAvg);
}
