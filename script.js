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
        if (num2 == 0) {
            alert('woah there! no dividing by 0!')
            return 'error'
        }
        return num1 / num2
    }
}

let input = ['0']
let displayText = ''

function inputUpdate(start, end, answer) {
    let inputString = input.join(',');
    let expression = inputString.slice(start, end + 1);
    inputString = inputString.replace(expression, answer);
    input = inputString.split(',')
}

function displayUpdate() {
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

function displayInput(e) {
    let id = e.target.id
    let item
    let last = input.length - 1;
    if (input.length == 1 && input[0] == 0) input = [];
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
    displayUpdate()
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

function reduceParentheses() {
    let inputString = input.join(',');
    if (!inputString.includes(')') && !inputString.includes('(')) return
    if (!inputString.includes(')') || !inputString.includes('(')) return 'error'
    while (inputString.includes('(')) {
        let indexOpen = inputString.indexOf('(')
        let indexClose = inputString.indexOf(')');
        if (indexClose == -1) return 'error'
        let nextOpen = inputString.indexOf('(', indexOpen + 1);
        while (nextOpen !== -1) {
            indexOpen = nextOpen;
            nextOpen = inputString.indexOf('(', indexOpen + 1)
        }
        if (indexClose < indexOpen) return 'error'
        let expression = inputString.slice(indexOpen + 2, indexClose - 1).split(',');
        if (expression.includes('(') || expression.includes(')')) return 'error'
        let answer = solve(expression);
        inputUpdate(indexOpen, indexClose, answer);
        inputString = input.join(',')
    }
}

function round(answer) {
    answer = answer.slice(0, 18);
    if (answer.includes('.')) {
        let decimalPlaces = 15 - answer.indexOf('.');
        answer = (Math.round(Number(answer) * 10**decimalPlaces) / 10**decimalPlaces).toString()
    }
    else {
        let decimalPlaces = (answer.length - 1) - 15;
        answer = (Math.round(Number(answer) / 10**decimalPlaces) * 10**decimalPlaces).toString()
    }
    answer = answer.slice(0, 16);
    return answer
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
    let reduced;
    if (input.join('').includes('(')) {
        reduced = reduceParentheses()
    }
    if (reduced == 'error') {
        display.textContent = 'error'
        return 'error'
    }
    if (input.length > 1) input = solve(input);
    if (display.textContent === 'error') return 'error'
    let answer = input.join('');
    if (answer.length > 16) {
        round(answer)
    } 
    display.textContent = answer
}

function clear() {
    let display = document.querySelector('.display')
    if (display.textContent.length == 1) {
        input = ['0']
        display.textContent = '0'
        return
    }
    let lastIndex = input.length - 1;
    let lastItem = input[lastIndex];
    if (lastItem.length > 1 && lastItem != '**' && lastItem != 'sqrt') {
        let updatedItem = lastItem.slice(0, lastItem.length - 1);
        input[lastIndex] = updatedItem
    } else input.pop();
    displayUpdate()
}

function type(e) {
    const button = document.querySelector(`.button[data-key=${e.code}]`);
    if (button !== null) return button.click()
}

function activateInputButtons() {
    const inputButtons = document.querySelectorAll('.input');
    inputButtons.forEach(button => {
        button.addEventListener('click', displayInput)
})
}

function activateClearEntry() {
    const clearEntry = document.querySelector('#clear-entry');
    clearEntry.addEventListener('click', clear)
}

const equalButton = document.querySelector('#equals');
equalButton.addEventListener('click', calculate)

const clearAll = document.querySelector('#clear-all');
clearAll.addEventListener('click', function() {
    document.querySelector('.display').textContent = '0';
    input = ['0'];
    activateClearEntry();
    activateInputButtons()
})

window.addEventListener('keydown', type)

activateClearEntry()
activateInputButtons()