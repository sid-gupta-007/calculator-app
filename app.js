// Calculator functionality
let display = document.getElementById('display');
let currentInput = '0';
let operator = null;
let previousInput = null;
let waitingForNewInput = false;

// Theme switching functionality
function changeTheme(theme) {
    document.body.className = `theme-${theme}`;
}

// Update display
function updateDisplay() {
    display.value = currentInput;
}

// Clear calculator
function clearCalculator() {
    currentInput = '0';
    operator = null;
    previousInput = null;
    waitingForNewInput = false;
    updateDisplay();
}

// Handle number input
function inputNumber(num) {
    if (waitingForNewInput) {
        currentInput = num;
        waitingForNewInput = false;
    } else {
        currentInput = currentInput === '0' ? num : currentInput + num;
    }
    updateDisplay();
}

// Handle decimal point
function inputDecimal() {
    if (waitingForNewInput) {
        currentInput = '0.';
        waitingForNewInput = false;
    } else if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
    }
    updateDisplay();
}

// Handle operators
function inputOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (previousInput === null) {
        previousInput = inputValue;
    } else if (operator) {
        const currentValue = previousInput || 0;
        const newValue = calculate(currentValue, inputValue, operator);

        currentInput = String(newValue);
        previousInput = newValue;
    }

    waitingForNewInput = true;
    operator = nextOperator;
    
    // Show the current number + operator on display
    display.value = currentInput + ' ' + nextOperator;
}

// Perform calculation
function calculate(firstValue, secondValue, operator) {
    switch (operator) {
        case '+':
            return firstValue + secondValue;
        case '-':
            return firstValue - secondValue;
        case '*':
            return firstValue * secondValue;
        case '/':
            return secondValue !== 0 ? firstValue / secondValue : 0;
        case '%':
            return firstValue % secondValue;
        default:
            return secondValue;
    }
}

// Handle equals
function calculateResult() {
    const inputValue = parseFloat(currentInput);

    if (previousInput !== null && operator) {
        const newValue = calculate(previousInput, inputValue, operator);
        currentInput = String(newValue);
        previousInput = null;
        operator = null;
        waitingForNewInput = true;
        updateDisplay();
    }
}

// Handle backspace
function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Event listeners for buttons
document.addEventListener('DOMContentLoaded', function() {
    // Theme buttons
    const themeButtons = document.querySelectorAll('.theme');
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            changeTheme(theme);
        });
    });

    // Calculator buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const action = this.getAttribute('data-action');
            const buttonClass = this.className;

            if (buttonClass.includes('number')) {
                if (value === '.') {
                    inputDecimal();
                } else {
                    inputNumber(value);
                }
            } else if (buttonClass.includes('operator')) {
                let operator;
                if (action) {
                    operator = action;
                } else if (value) {
                    operator = value;
                } else {
                    // Fallback to button text content
                    operator = this.textContent.trim();
                }
                // Convert X to * for calculation
                const actualOperator = operator === 'X' ? '*' : operator;
                inputOperator(actualOperator);
            } else if (buttonClass.includes('equals')) {
                calculateResult();
            } else if (buttonClass.includes('clear')) {
                if (action === 'clear') {
                    clearCalculator();
                } else if (action === 'delete') {
                    backspace();
                }
            }
        });
    });

    // Keyboard support
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        
        if (key >= '0' && key <= '9') {
            inputNumber(key);
        } else if (key === '.') {
            inputDecimal();
        } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
            inputOperator(key);
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            calculateResult();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            clearCalculator();
        } else if (key === 'Backspace') {
            backspace();
        }
    });

    // Initialize display
    updateDisplay();
});

// Add some visual feedback for button presses
document.addEventListener('DOMContentLoaded', function() {
    const allButtons = document.querySelectorAll('.btn, .theme');
    
    allButtons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});