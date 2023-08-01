const add = (num1, num2) => num1 + num2

const subtract = (num1, num2) => num1 - num2

const multiply = (num1, num2) => num1 * num2

const divide = (num1, num2) => num1 / num2;

let num1
let num2
let operator

function operate(num1, operator, num2) {
    if (operator === '+') {
        return add(num1, num2)
    }
    else if (operator === '-') {
        return subtract(num1, num2)
    }
    else if (operator === '*') {
        return multiply(num1, num2)
    }
    else if (operator === '/') {
        return divide(num1, num2) 
    }
}

let input = []

function displayInput(e) {
    let id = e.target.id;
    input.push(`${id}`);
    inputString = input.join('');
    displayText = inputString.replace('*', ' × ').
                        replace('/', ' ÷ ').
                        replace('+', ' + ').
                        replace('-', ' - ');
    const display = document.querySelector('.display');
    display.textContent = displayText;
}

function isMultiply(x) {
    if (x === '*') return true
    else if (x === '/') return true
    else return false
}

function isAdd(x) {
    if (x === '+') return true
    else if (x === '-') return true
    else return false
}

function isOperator(x) {
    (isMultiply || isAdd === true) ? true : false
}

function orderOfOperations(array) {
    let order = []
    /*
    evaluate input list 
    return list of indexes for operators in order
    */
   /*
    find indexes for the division operators in order
    add them to order list
    find indexes for addition operators in order
    add them to order list
   */
    for (x in input) {
        if (isOperator(x) === true) {

        }
    }
}

function calculate() {
    /*
    input-string equals joined input
    while input-string contains operators is true
        find first operator
        answer-string equals `index-1operatorindex+1`
        replace answer-string in input-string with result of operate function
    input equals separated input-string
    displayInput()
    */
    while (input.some(x => isOperator(x)) === true) {
        sldkfjlsdkfj
   }
}

const inputButtons = document.querySelectorAll('.input');
inputButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        return displayInput(e)
    })
})