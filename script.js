let num1
let num2
let operator

function operate(num1, operator, num2) {
    if (operator === 'sqrt') {
        return Math.sqrt(num2)
    }
    else if (operator === '**') {
        return num1**num2
    }
    else if (operator === '+') {
        return num1 + num2
    }
    else if (operator === '-') {
        return num1 - num2
    }
    else if (operator === '*') {
        return num1 * num2
    }
    else if (operator === '/') {
        return num1 / num2
    }
}

let input = []
let displayText = ''

function displayInput(e) {
    let id = e.target.id
    let item
    let last = input.length - 1;
    if (input.join('').length > 16) return 'too many digits'
    else if (isFinite(Number(id)) || id === '.') {
        if (input[last] !== undefined) {
            if (isFinite(Number(input[last])) === true || input[last] === '.') {
                item = input[last];
                item += id
                input.pop();
                input.push(`${item}`)
            } else input.push(`${id}`);
        } else input.push(`${id}`);
    } 
    else input.push(`${id}`);
    let inputString = input.join('');
    displayText = inputString.replaceAll('**', '^').
                              replaceAll('sqrt', '√').
                              replaceAll('*', ' × ').
                              replaceAll('/', ' ÷ ').
                              replaceAll('+', ' + ').
                              replaceAll('-', ' - ');
    const display = document.querySelector('.display');
    display.textContent = displayText;
}

function isPower(x) {
    if (x === '**') return true
    else if (x === 'sqrt') return true
    else return false
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
    return isPower(x) || isMultiply(x) || isAdd(x)
    }

let order;

function orderOfOperations(exp) {
    order = [];
    if (exp.some(isPower)) {
        exp.forEach((item, i) => {
            if (isPower(item) && !isPower(exp[i - 2])) {
                order.push(i);
            }
        })
    }
    else if (exp.some(isMultiply)) {
        exp.forEach((item, i) => {
            if (isMultiply(item) && !isMultiply(exp[i - 2])) {
                order.push(i);
            }
        })
    } else {
        exp.forEach((item, i) => {
            if (isAdd(item) && !isAdd(exp[i - 2])) {
                order.push(i)
            }
        })
    }
}

function solve(exp) {
    let inputString = exp.join(',');
    const display = document.querySelector('.display');
    while (exp.some(isOperator) && display.textContent !== 'error') {
        orderOfOperations(exp);
        order.forEach(index => {
            num1 = exp[index - 1]
            operator = exp[index]
            num2 = exp[index + 1]
            let result;
            if (operator === 'sqrt') {
                result = operate(null, operator, Number(num2))
            } else {
                result = operate(Number(num1), operator, Number(num2));
            }
            if (!isFinite(result)) {
                exp = [];
                document.querySelector('.display').textContent = 'error';
                return 'error'
            }
            let resultString = result.toString()
            let expression;
            if (operator === 'sqrt') {
                expression = operator + ',' + num2
            } else {
                expression = num1 + ',' + operator +  ',' + num2
            }
            inputString = inputString.replace(expression, resultString)
        })
        exp = inputString.split(',')
    }
    return exp
}

function calculate() {
    const display = document.querySelector('.display')
    const clearEntry = document.querySelector('#clear-entry');
    clearEntry.removeEventListener('click', clear)
    const inputButtons = document.querySelectorAll('.input');
    inputButtons.forEach(button => {
        button.removeEventListener('click', displayInput)
    })  
    input.forEach((item, i) => {
        if (item === 'sqrt' && isFinite(+input[i - 1])) {
            display.textContent = 'error';
            return 'error'
            }
    })
    let inputString = input.join(',');
    while (input.some(isOperator) && display.textContent !== 'error')
        if (input.includes('(')) {
            inputString = input.join(',');
            let start = inputString.indexOf('(')
            let end = inputString.indexOf(')');
            let smallString = inputString.slice(start + 2, end - 1);
            let smallInput = smallString.split(',');
            smallInput = solve(smallInput);
            let expression = inputString.slice(start, end + 1)
            smallString = smallInput.join(',');
            inputString = inputString.replace(expression, smallString);
            input = inputString.split(',')
        } 
        else {
            input = solve(input);
        }
    if (display.textContent === 'error') return 'error'
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
    let inputString = displayText.replaceAll(' × ', ' * ').replaceAll(' ÷ ', ' / ');
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

function type(e) {
    const button = document.querySelector(`.button[data-key=${e.code}]`);
    if (button !== null) return button.click()
}

window.addEventListener('keydown', type)

activateClearEntry()
activateInputButtons()