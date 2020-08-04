//Coding Challenge #5
var john = {
    fullName: 'John Smith',
    bills: [124, 48, 268, 180, 42],
    calcTips: function() {
        this.tips = [];          //Added dynamically!!!
        this.finalPayment = [];  //Added dynamically!!!
        for(var i = 0; i < this.bills.length; i++) {
            var percentage;
            if (this.bills[i] < 50)
                percentage = .2;
            else if (this.bills[i] >= 50 && this.bills[i] < 200)
                percentage = .15;
            else
                percentage = .1;
            this.tips[i] = this.bills[i] * percentage;
            this.finalPayment[i] = this.bills[i] + this.tips[i];
        }
    }
};

var mark = {
    fullName: 'Mark Miller',
    bills: [77, 475, 110, 45],
    calcTips: function() {
        this.tips = [];          //Added dynamically!!!
        this.finalPayment = [];  //Added dynamically!!!
        for(var i = 0; i < this.bills.length; i++) {
            var percentage;
            if (this.bills[i] < 100)
                percentage = .2;
            else if (this.bills[i] >= 100 && this.bills[i] < 300)
                percentage = .1;
            else
                percentage = .25;
            this.tips[i] = this.bills[i] * percentage;
            this.finalPayment[i] = this.bills[i] + this.tips[i];
        }
    }
};

//DRY ALERT: Keep this function outside since its the same exact code!!!
function calcAvg(tips) {
    if (tips.length === 0)
        return 0;
    var sum = 0;
    for(var i = 0; i < tips.length; i++)
        sum += tips[i];
    return sum / tips.length;
}

john.calcTips();
mark.calcTips();

john.average = calcAvg(john.tips);  //Store inside object!!!
mark.average = calcAvg(mark.tips);  //Store inside object!!!

console.log(john, mark);

if (john.average > mark.average)
    console.log(john.fullName + '\'s family paid the highest average tip amount of $' + john.average);
else if (mark.average > john.average)
    console.log(mark.fullName + '\'s family paid the highest average tip amount of $' + mark.average);
else
    console.log('Both families paid the same average tip amount');