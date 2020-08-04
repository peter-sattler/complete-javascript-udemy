/******************** BUDGET (DATA) CONTROLLER ********************/
var budgetController = (function() {
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calculatePercentage = function(totalIncome) {
        if (totalIncome === 0) {
            this.percentage = -1;
        }
        else {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }
    };
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current, index, array) {
            sum += current.value;
        });
        data.totals[type] = sum;
    };
    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    };
    return {
        addItem: function(type, description, value) {
            //Get next ID (last element + 1):
            var id = 0;
            if(data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            //Create new item based on type:
            var newItem;
            if (type === 'inc') {
                newItem = new Income(id, description, value);
            }
            else if (type === 'exp') {
                newItem = new Expense(id, description, value);
            }
            data.allItems[type].push(newItem);  //Push it to the data structure
            return newItem;                     //Return the new item
        },
        deleteItem: function(type, id) {
            //Map the IDs since items in the data structure are not necessarily in order (may have been deleted):
            //Example: id = 6 and data.allItems[type] = [1, 2, 4, 6, 8], then index = 3
            var idArray = data.allItems[type].map(function(current) {
                return current.id;
            });
            var index = idArray.indexOf(id);
            if (index > -1) {
                data.allItems[type].splice(index, 1);
                console.log('Deleted [' + type + '] item ID [' + id + '] at index [' + index + ']');
            }
        },
        calculateBudget: function() {
            calculateTotal('inc');                            //Calculate total income
            calculateTotal('exp');                            //Calculate total expense
            data.budget = data.totals.inc - data.totals.exp;  //Calculate budget
            //Calculate percentage of income spent:
            if (data.totals.inc === 0) {
                data.percentage = -1;
            }
            else {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
        },
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(current) {
                current.calculatePercentage(data.totals.inc);
            });
        },
        getPercentages: function() {
            var percentages = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });
            return percentages;
        },
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        //TESTING ONLY!!!
        testing: function() {
            return data;
        }
    };
})();

/******************** UI CONTROLLER ********************/
var uiController = (function() {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    var formatNumber = function(type, number) {
        number = Math.abs(number).toFixed(2);   //Must always have 2 decimal places
        var numberSplit = number.split('.');
        var integerPart = numberSplit[0];
        if (integerPart.length > 3) {
            //Use comma to separate thousands:
            //Examples: (a) 23510 -> 23,510 (b) 2500 -> 2,500
            integerPart = integerPart.substr(0, integerPart.length - 3) + ',' + integerPart.substr(integerPart.length - 3, 3);
        }
        return (type === 'exp' ? '- ' : '+ ') + integerPart + '.' + numberSplit[1];  //Prepend + for income or - for expense
    };
    //Node list does not have a forEach function, so we create our own reusable one:
    var nodeListForEach = function(nodeList, callback) {
        for(var i = 0; i < nodeList.length; i++) {
            callback(nodeList[i], i);
        }
    };
    return {
        displayDate: function() {
            var now = new Date();
            var months = ['January', 'February', 'March', 
                          'April',   'May',      'June',
                          'July',    'August',   'September', 
                          'October', 'November', 'December'];
            document.querySelector(DOMStrings.dateLabel).textContent = months[now.getMonth()] + ' ' + now.getFullYear();
        },
        changedType: function() {
            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue
            );
            nodeListForEach(fields, function(current) {
                current.classList.toggle('red-focus');
            });
            document.querySelector(DOMStrings.inputButton).classList.toggle('red');
        },
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,  //Either 'inc' or 'exp'
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },
        addListItem: function(data, type) {
            //Create HTML template with placeholder text:
            var element, htmlTemplate;
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                htmlTemplate = '<div class="item clearfix" id="inc-__ID__"><div class="item__description">__DESCRIPTION__</div><div class="right clearfix"><div class="item__value">__VALUE__</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type === 'exp') {
                element = DOMStrings.expenseContainer;
                htmlTemplate = '<div class="item clearfix" id="exp-__ID__"><div class="item__description">__DESCRIPTION__</div><div class="right clearfix"><div class="item__value">__VALUE__</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //Replace the placeholder text with data:
            var html = htmlTemplate.replace('__ID__', data.id);
                html = html.replace('__DESCRIPTION__', data.description);
                html = html.replace('__VALUE__', formatNumber(data.type, data.value));
            //Insert the HTML into the DOM:
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },
        deleteListItem: function(selectorId) {
            var element = document.getElementById(selectorId);
            element.parentNode.removeChild(element);
        },
        clearFields: function() {
            var fieldList = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            var fieldArray = Array.prototype.slice.call(fieldList);  //HACK ALERT!!!
            //Another way to iterate over an array:
            fieldArray.forEach(function(current, index, array) {
                current.value = '';
            });
            fieldArray[0].focus();  //Set focus on description field
        },
        displayBudget: function(budgetObj) {
            var type = budgetObj.budget > 0 ? 'inc' : 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(type, budgetObj.budget);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber('inc', budgetObj.totalInc);
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber('exp', budgetObj.totalExp);
            if (budgetObj.percentage <= 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
            else {
                document.querySelector(DOMStrings.percentageLabel).textContent = budgetObj.percentage + '%';
            }
        },
        displayPercentages: function(percentages) {
            var fieldNodeList = document.querySelectorAll(DOMStrings.expensePercentageLabel);
            //Better alternative to using the call HACK (above):
            nodeListForEach(fieldNodeList, function(current, index) {
                if (percentages[index] <= 0) {
                    current.textContent = '---';
                }
                else {
                    current.textContent = percentages[index] + '%';
                }
            });
        },
        getDOMStrings: function() {
            return DOMStrings;
        }
    };
})();

/******************** GLOBAL APP CONTROLLER ********************/
var appController = (function(budgetCtrl, uiCtrl) {
    var setupEventListeners = function() {
        var DOMStrings = uiCtrl.getDOMStrings();
        document.querySelector(DOMStrings.inputButton).addEventListener('click', addItem);
        document.addEventListener('keypress', function(event) {
            //Check if ENTER was pressed:
            if(event.keyCode === 13 || event.which === 13) {
                addItem();
            }
        });
        document.querySelector(DOMStrings.container).addEventListener('click', deleteItem);  //Event delegation
        document.querySelector(DOMStrings.inputType).addEventListener('change', uiCtrl.changedType);
    };
    var updateBudget = function() {
        budgetCtrl.calculateBudget();         //Calculate budget
        var budget = budgetCtrl.getBudget();  //Retrieve budget
        uiCtrl.displayBudget(budget);         //Display updated budget
    };
    var updatePercentages = function() {
        budgetCtrl.calculatePercentages();              //Calculate percentages
        var percentages = budgetCtrl.getPercentages();  //Read percentages from budget controller
        uiCtrl.displayPercentages(percentages);         //Update the UI with the new percentages
    };
    var addItem = function() {
        var input = uiCtrl.getInput();        //Get the field input data
        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);  //Add new item  to data structure
            uiCtrl.addListItem(newItem, input.type);                                       //Display new item
            uiCtrl.clearFields();             //Clear the UI fields
            updateBudget();                   //Recalculate budget and update UI
            updatePercentages();              //Recalculate percentages and update UI
        }
    };
    var deleteItem = function(event) {
        var itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            //Split item id (i.e. inc-10) into its type and id:
            var splitItemId = itemId.split('-');
            var type = splitItemId[0];
            var id = parseInt(splitItemId[1]);
            budgetCtrl.deleteItem(type, id);  //Delete item from data structure
            uiCtrl.deleteListItem(itemId);    //Delete item from UI
            updateBudget();                   //Update and show new budget
            updatePercentages();              //Update and show new percentages
        }
    };
    return {
        init: function() {
            console.log('Application has started');
            uiCtrl.displayDate();
            uiCtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
})(budgetController, uiController);

appController.init();