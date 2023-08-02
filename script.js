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
let displayText = ''

function displayInput(e) {
    let id = e.target.id
    let item
    let last = input.length -1;
    if (isFinite(Number(id)) || id === '.') {
        if (input[last] !== undefined) {
            if (isFinite(Number(input[last])) === true || input[last] === '.') {
                item = input[last];
                item += id
                input.pop();
                input.push(`${item}`)
            } else input.push(`${id}`);
        } else input.push(`${id}`);
    } else input.push(`${id}`);
    let inputString = input.join('');
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
    return isMultiply(x) || isAdd(x)
    }

let order;

function orderOfOperations() {
    order = [];
    if (input.some(isMultiply)) {
        input.forEach((item, i) => {
            if (isMultiply(item) && !isMultiply(input[i - 2])) {
                order.push(i);
            }
        })
    } else {
        input.forEach((item, i) => {
            if (isAdd(item) && !isAdd(input[i - 2])) {
                order.push(i)
            }
        })
    }
}

function calculate() {
    const clearEntry = document.querySelector('#clear-entry');
    clearEntry.removeEventListener('click', clear);
    const inputButtons = document.querySelectorAll('.input');
    inputButtons.forEach(button => {
        button.removeEventListener('click', displayInput)
    })  
    let inputString = input.join(',')
    while (input.some(isOperator)) {
        orderOfOperations();
        order.forEach(index => {
            num1 = input[index - 1]
            operator = input[index]
            num2 = input[index + 1];
            let result = operate(Number(num1), operator, Number(num2));
            let resultString = result.toString()
            let expression = num1 + ',' + operator +  ',' + num2;
            inputString = inputString.replace(expression, resultString)
        })
        input = inputString.split(',')
    }
    let answer = input.join('');
    if (answer.length > 16) {
        if (answer[15] !== '.' && answer[16] !== '.') {
            let lastNumber = +answer[14]
            let nextNumber = +answer[15];
            if (nextNumber > 4) {
                ++lastNumber;
                answer = answer.slice(0, 15) + lastNumber;
            }
        }
        else if (answer[16] === '.') {
            answer = answer.slice(0, 15)
        }
        else {
            answer = answer.slice(0, 16)
        }
    } 
    const display = document.querySelector('.display');
    display.textContent = answer
}

function activateInputButtons() {
    const inputButtons = document.querySelectorAll('.input');
    inputButtons.forEach(button => {
        button.addEventListener('click', displayInput)
})
}

const equalButton = document.querySelector('#equals');
equalButton.addEventListener('click', calculate)

function clear() {
    let lastEntry = displayText.length - 1;
    if (displayText[lastEntry] === ' ') lastEntry = lastEntry - 2;
    displayText = displayText.slice(0, lastEntry);
    document.querySelector('.display').textContent = displayText;
    let inputString = displayText.replace(' × ', ' * ').replace(' ÷ ', ' / ');
    input = inputString.split(' ')
}

function activateClearEntry() {
    const clearEntry = document.querySelector('#clear-entry');
    clearEntry.addEventListener('click', clear)
}

const clearAll = document.querySelector('#clear-all');
clearAll.addEventListener('click', function() {
    document.querySelector('.display').textContent = '0';
    input = [];
    activateClearEntry();
    activateInputButtons()
})

activateClearEntry()
activateInputButtons()