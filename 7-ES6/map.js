function Person(name) {
    this.name = name;
}

var friends = ['Bob', 'Jane', 'Mark'];

// ES5
Person.prototype.myFriends5 = function(friends) {
    
    var arr = friends.map(function(el) {
       return this.name + ' is friends with ' + el; 
    }.bind(this));
    
    console.log(arr);
}
new Person('John').myFriends5(friends);

// ES6
Person.prototype.myFriends6 = function(friends) {
    const foo = friends.map(element => `${this.name} is friends with ${element}`);
    console.log(foo);
}
new Person('John').myFriends6(friends);
