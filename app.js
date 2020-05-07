/*Notes 
Step 1 Branch 1: Bugfixes 
Step 2 Branch 2: Add new features remaining lectures
Step 3 Push both branches on git repository
Step 4 Create PR for both branches 
Step 5 After you get approval merge both branches in master
Due date : 8th May 2020


*/

// Controls the UI part
var UIController = (function () {
  var DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    accessButton: ".add__btn",
    incomeContainer: ".income__list",
    expenseContainer: ".expenses__list",
    budgetLable: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensePercentage: ".item__percentage",
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
      };
    },

    getDOM: function () {
      return DOMStrings;
    },

    displayInputOnUI: function (obj, type) {
      var html, newHtml, element;
      //create HTML string
      if (type == "exp") {
        element = DOMStrings.expenseContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div></div> ';
      } else if ((type = "inc")) {
        element = DOMStrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //replace place holder text
      newHTML = html.replace("%id%", obj.id);
      newHTML = newHTML.replace("%description%", obj.description);
      newHTML = newHTML.replace("%value%", obj.value);
      //use HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHTML);
    },

    clearFields: function () {
      var fields, fieldsArray;
      fields = document.querySelectorAll(
        DOMStrings.inputDescription + "," + DOMStrings.inputValue
      );
      //converting default list produced by function querSelectorAll into an array
      fieldsArray = Array.prototype.slice.call(fields);
      //the function is an anonymous object created from getValue
      fieldsArray.forEach(function (current, index, array) {
        current.value = "";
        fieldsArray[0].focus();
      });
    },

    displayBudgetOnUI: function (obj) {
      document.querySelector(DOMStrings.budgetLable).textContent =
        obj.totalBudget;
      document.querySelector(DOMStrings.incomeLabel).textContent =
        obj.totalIncome;
      document.querySelector(DOMStrings.expenseLabel).textContent =
        obj.totalExpense;
      if (obj.totalPercentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent =
          obj.totalPercentage + "%";
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = "---";
      }
    },

    deleteItem: function (selectorID) {
      var tempEl = document.getElementById(selectorID);
      tempEl.parentNode.removeChild(tempEl);
    },

    displayExpensePercentage: function (expensePercentage) {
      var fields;

      var fields = document.querySelectorAll(DOMStrings.expensePercentage);
      //Creating a forEach function for list
      //the function will accept the generated list of node via querySelectorAll method as a parameter that
      //the second parameter is a function which will operate on every single element of the list which will be called in a for loop
      var nodeListForEach = function (list, callBack) {
        for (i = 0; i < list.length; i++) {
          callBack(list[i], i);
        }
      };
      //Call the function to send the memebers of  expensePercentage to UI
      nodeListForEach(fields, function (current, index) {
        if (expensePercentage[i] > 0) {
          current.textContent = expensePercentage[i] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },
  };
})();

//Controls the budget data
var budgetController = (function () {
  var Income = function (id, description, value) {
    (this.id = id), (this.description = description), (this.value = value);
  };
  var Expense = function (id, description, value) {
    (this.id = id),
      (this.description = description),
      (this.value = value),
      (percentage = -1);
  };
  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    }
  };
  Expense.prototype.returnPercentage = function () {
    return this.percentage;
  };
  var calcTotal = function (type) {
    var sum = 0;
    storeData.allItems[type].forEach(function (current) {
      sum = sum + current.value;
    });
    storeData.totalItems[type] = sum;
  };
  //store all the data
  var storeData = {
    allItems: {
      inc: [],
      exp: [],
    },
    //store total data
    totalItems: {
      inc: 0,
      exp: 0,
      budget: 0,
      percentage: -1,
    },
  };
  return {
    //A function that will store the new entered item in relevant data structure based on its type(we pass des and val parameters to create a new object of constructor 'Expense' or 'Income' based on the 'Type' parameter)
    cntrlNewItem: function (type, des, val) {
      var newItem, ID;
      if (storeData.allItems[type].length == 0) {
        ID = 0;
      } else {
        ID =
          storeData.allItems[type][storeData.allItems[type].length - 1].id + 1;
      }
      if (type == "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type == "inc") {
        newItem = new Income(ID, des, val);
      }
      storeData.allItems[type].push(newItem);
      return newItem;
    },
    /*
        calculateExpensePercentage : function(){
          var calculatePercentage;
          calculatePercentage = (storeData.allItems[type][storeData.allItems[type].length - 1] /storeData.totalItems.budget) * 100;
          document.querySelector(UIController.getDOM.expensePercentage).textContent = calculatePercentage;
        },
        */

    calculateBudget: function () {
      //calcalculate total income
      calcTotal("exp");
      calcTotal("inc");
      //calculate the budget: income - expense
      storeData.totalItems.budget =
        storeData.totalItems.inc - storeData.totalItems.exp;
      //calculate percentage
      if (storeData.totalItems.inc > 0) {
        storeData.totalItems.percentage = Math.round(
          (storeData.totalItems.exp / storeData.totalItems.inc) * 100
        );
      } else {
        storeData.totalItems.percentage = -1;
      }
    },

    calculateExpensePercentage: function () {
      storeData.allItems.exp.forEach(function (current) {
        current.calcPercentage(storeData.totalItems.inc);
      });
    },

    getExpensePercentage: function () {
      var allPerc = storeData.allItems.exp.map(function (current) {
        return current.returnPercentage();
        console.log(allPerc);
      });
      return allPerc;
    },

    returnBudget: function () {
      return {
        totalBudget: storeData.totalItems.budget,
        totalPercentage: storeData.totalItems.percentage,
        totalIncome: storeData.totalItems.inc,
        totalExpense: storeData.totalItems.exp,
      };
    },
    deleteItem: function (type, id) {
      var ids, index;
      //map is an method of Array that works as a for loop/forEach but it returns a new array. function has access to current value
      ids = storeData.allItems[type].map(function (current) {
        return current.id;
      });
      //indexOf returns the index of the id that we are passing as a parameter in our controller function
      index = ids.indexOf(id);
      if (index !== -1) {
        //splice works as a delete method and removes an element from the array, accepts the position as a parameter that we would want to delete along with no. of entries to be deleted
        storeData.allItems[type].splice(index, 1);
      }
    },
    testing: function () {
      console.log(storeData);
    },
  };
})();

//Connects UI and budget controller
var controller = (function (budCntrl, UICntrl) {
  var setUpEventListener = function () {
    var DOM = UICntrl.getDOM();
    //setup event listener for the value input box
    document.querySelector(DOM.accessButton).addEventListener("click", getItem);
    document.addEventListener("keypress", function (e) {
      if (e.charCode === 13) {
        getItem();
      }
    });
    //Setting up delete icon
    //This might help in CYPRESS to locate the HTML context
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  var getItem = function () {
    //get users INPUT
    var input = UICntrl.getInput();
    //Check if input fields are nor empty or has irrevanlt data
    if (
      input.description != "" &&
      input.value != isNaN(input.value) &&
      input.value > 0
    ) {
      var addNewItem = budCntrl.cntrlNewItem(
        input.type,
        input.description,
        input.value
      );
      //PRINT the input on UI
      UIController.displayInputOnUI(addNewItem, input.type);
      //CLEARING fields
      UIController.clearFields();
      //Calculate the budget
      updateBudget();
      //PRINT the calculation on the UI

      console.log(input);
      console.log(addNewItem);
      //Calculate Expense percentage
      calculateExpensePercentages();
    }
  };

  var ctrlDeleteItem = function (event) {
    var itemID, splitID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);
      //Delete item from the data structure
      budCntrl.deleteItem(type, ID);
      //Delete item from the UI
      UICntrl.deleteItem(itemID);
      //Re-calculate and display new budget
      updateBudget();
      calculateExpensePercentages();
    }
  };
  //Update the budget text
  var updateBudget = function () {
    //Calculates budget
    budCntrl.calculateBudget();
    var budgetValues = budCntrl.returnBudget();
    console.log(budgetValues);
    UICntrl.displayBudgetOnUI(budgetValues);
  };

  var calculateExpensePercentages = function () {
    var percentage;
    // 1. Calculate percentage
    budCntrl.calculateExpensePercentage();
    //2.Read percentage from budget controller
    percentage = budCntrl.getExpensePercentage();
    console.log(percentage);
    //3.Update UI
    UICntrl.displayExpensePercentage(percentage);
  };

  return {
    init: function () {
      console.log("Application has started");
      setUpEventListener();
      UICntrl.displayBudgetOnUI({
        totalBudget: 0,
        totalPercentage: -1,
        totalIncome: 0,
        totalExpense: 0,
      });
    },
  };
})(budgetController, UIController);

controller.init();
