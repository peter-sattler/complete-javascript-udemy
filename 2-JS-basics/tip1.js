//Coding Challenge #3

function calculateTip(billAmount) {
    if (billAmount < 50) {
        return billAmount * .20;
    }
    if (billAmount >= 50 && billAmount < 200) {
        return billAmount * .15;
    }
    return billAmount * .10;
}

var bills = [124, 48, 268];
var tips = [calculateTip(bills[0]),
            calculateTip(bills[1]),
            calculateTip(bills[2])];
var billPlusTip = [bills[0] + tips[0],
                   bills[1] + tips[1],
                   bills[2] + tips[2]];

console.log('Bills: ', bills);
console.log('Tips: ', tips);
console.log('Bills plus tips: ', billPlusTip);
