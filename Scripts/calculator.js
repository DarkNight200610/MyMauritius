document.addEventListener('DOMContentLoaded', function() {
    // calculator state
    let currentOperand = '0';
    let previousOperand = '';
    let operation = null;
    let shouldResetScreen = false;

    // DOM Elements
    const currentOperationDisplay = document.getElementById('currentOperation');
    const previousOperationDisplay = document.getElementById('previousOperation');
    const numberButtons = document.querySelectorAll('.number-btn');
    const operatorButtons = document.querySelectorAll('.operator-btn');
    const equalsButton = document.querySelector('.equals-btn');
    const decimalButton = document.querySelector('[data-action="decimal"]');

    // update display
    function updateDisplay() {
        currentOperationDisplay.textContent = currentOperand;
        
        if (operation != null) {
            previousOperationDisplay.textContent = 
                `${previousOperand} ${getOperationSymbol(operation)}`;
        } else {
            previousOperationDisplay.textContent = '';
        }
    }

    // Get operation symbol for display
    function getOperationSymbol(op) {
        switch(op) {
            case 'add': return '+';
            case 'subtract': return '-';
            case 'multiply': return '×';
            case 'divide': return '÷';
            default: return '';
        }
    }

    // Append number
    function appendNumber(number) {
        if (currentOperand === '0' || shouldResetScreen) {
            currentOperand = number;
            shouldResetScreen = false;
        } else {
            currentOperand += number;
        }
    }

    // Add decimal point
    function addDecimal() {
        if (shouldResetScreen) {
            currentOperand = '0.';
            shouldResetScreen = false;
            return;
        }
        
        if (!currentOperand.includes('.')) {
            currentOperand += '.';
        }
    }

    // Choose operation
    function chooseOperation(op) {
        if (currentOperand === '') return;
        
        if (previousOperand !== '') {
            compute();
        }
        
        operation = op;
        previousOperand = currentOperand;
        shouldResetScreen = true;
    }

    // Compute calculation
    function compute() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch(operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    clearAll();
                    return;
                }
                computation = prev / current;
                break;
            case 'percentage':
                computation = prev * (current / 100);
                break;
            default:
                return;
        }
        
        // Handle floating point precision
        currentOperand = Math.round(computation * 100000000) / 100000000;
        currentOperand = currentOperand.toString();
        operation = null;
        previousOperand = '';
        shouldResetScreen = true;
    }

    // Clear last entry
    function clearEntry() {
        if (currentOperand.length === 1) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
    }

    // Clear all
    function clearAll() {
        currentOperand = '0';
        previousOperand = '';
        operation = null;
    }

    // Calculate percentage
    function calculatePercentage() {
        if (currentOperand === '' || currentOperand === '0') return;
        
        const value = parseFloat(currentOperand);
        currentOperand = (value / 100).toString();
    }

    // Format number for display
    function formatNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    // Handle keyboard input
    function handleKeyboardInput(event) {
        if (event.key >= '0' && event.key <= '9') {
            appendNumber(event.key);
            updateDisplay();
        }
        
        if (event.key === '.') {
            addDecimal();
            updateDisplay();
        }
        
        if (event.key === '+') {
            chooseOperation('add');
            updateDisplay();
        }
        
        if (event.key === '-') {
            chooseOperation('subtract');
            updateDisplay();
        }
        
        if (event.key === '*') {
            chooseOperation('multiply');
            updateDisplay();
        }
        
        if (event.key === '/') {
            event.preventDefault();
            chooseOperation('divide');
            updateDisplay();
        }
        
        if (event.key === 'Enter' || event.key === '=') {
            event.preventDefault();
            compute();
            updateDisplay();
        }
        
        if (event.key === 'Escape' || event.key === 'Delete') {
            clearAll();
            updateDisplay();
        }
        
        if (event.key === 'Backspace') {
            clearEntry();
            updateDisplay();
        }
        
        if (event.key === '%') {
            calculatePercentage();
            updateDisplay();
        }
    }

    // Event Listeners for number buttons
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.getAttribute('data-number'));
            updateDisplay();
        });
    });

    // Event Listeners for operator buttons
    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            
            switch(action) {
                case 'add':
                case 'subtract':
                case 'multiply':
                case 'divide':
                    chooseOperation(action);
                    break;
                case 'equals':
                    compute();
                    break;
                case 'clear':
                    clearEntry();
                    break;
                case 'clear-all':
                    clearAll();
                    break;
                case 'percentage':
                    calculatePercentage();
                    break;
            }
            
            updateDisplay();
        });
    });

    // Event Listener for equals button
    equalsButton.addEventListener('click', () => {
        compute();
        updateDisplay();
    });

    // Event Listener for decimal button
    decimalButton.addEventListener('click', () => {
        addDecimal();
        updateDisplay();
    });

    // Keyboard support
    document.addEventListener('keydown', handleKeyboardInput);

    // Initialize display
    updateDisplay();
});