//Coding Challenge #4

var mark = {
    fullName: 'Mark Miller',
    massKG: 78,
    heightMeters: 1.69,
    calcBMI: function() {
        this.bmi = this.massKG / (this.heightMeters * this.heightMeters);
        return this.bmi;
    }
};

var john = {
    fullName: 'John Smith',
    massKG: 92,
    heightMeters: 1.95,
    calcBMI: function() {
        this.bmi = this.massKG / (this.heightMeters * this.heightMeters);
        return this.bmi;
    }
};

if (mark.calcBMI() > john.calcBMI())
    console.log(mark.fullName, 'has the highest BMI of', mark.bmi);
else if (john.bmi > mark.bmi)
    console.log(john.fullName, 'has the highest BMI of', john.bmi);
else
    console.log(mark.fullName, 'and', john.fullName, 'have the same BMI of ', mark.bmi);