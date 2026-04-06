window.onload = function () {

    let a = '';        
    let b = '';       
    let selectedOperation = null;
    let accumulator = null;
    let accumulatorActive = false;
    

    let historyFull = '';        
    let waitingForSecondNumber = false;  

    const outputElement = document.getElementById('result');
    const historyElement = document.getElementById('history-text');
    const digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]');

    function formatNumber(num) {
        if (num === 'Ошибка') return 'Ошибка';
        let n = typeof num === 'number' ? num : parseFloat(num);
        if (isNaN(n)) return '0';
        
        let str = n.toString();
        if (str.length > 14) {
            let exp = n.toExponential(8);
            if (exp.length > 14) {
                exp = n.toExponential(8);
            }
            return exp;
        }
        return str;
    }

    function getCurrentNumber() {
        return selectedOperation ? b : a;
    }
    
    function setCurrentNumber(val) {
        let formatted = formatNumber(val);
        if (selectedOperation) {
            b = formatted;
        } else {
            a = formatted;
        }
        outputElement.innerHTML = formatted;
    }

    function updateHistoryDisplay() {
        if (historyFull === '') {
            historyElement.innerHTML = '';
        } else {
            historyElement.innerHTML = historyFull;
        }
    }

    function addToHistory(text) {
        historyFull += text;
        updateHistoryDisplay();
    }

    function clearHistory() {
        historyFull = '';
        updateHistoryDisplay();
    }

    function onDigitButtonClicked(digit) {
        if (accumulatorActive) {
            accumulator = null;
            accumulatorActive = false;
        }
        
        const cur = getCurrentNumber();
        
        if (digit === '000') {
            if (cur === '' || cur === '0' || cur === 'Ошибка') return;
            let newVal = cur + '000';
            if (newVal.length > 14) return;
            setCurrentNumber(newVal);
            return;
        }
        
        if (!selectedOperation) {
            if (digit === '.') {
                if (a.includes('.')) return;
                if (a === '' || a === '0') {
                    a = '0.';
                    outputElement.innerHTML = a;
                } else {
                    a += digit;
                    outputElement.innerHTML = a;
                }
            } else {
                if (a === '0' && digit !== '.') {
                    a = digit;
                } else {
                    a += digit;
                }
                outputElement.innerHTML = a;
            }
        } else {
            if (digit === '.') {
                if (b.includes('.')) return;
                if (b === '' || b === '0') {
                    b = '0.';
                    outputElement.innerHTML = b;
                } else {
                    b += digit;
                    outputElement.innerHTML = b;
                }
            } else {
                if (b === '0' && digit !== '.') {
                    b = digit;
                } else {
                    b += digit;
                }
                outputElement.innerHTML = b;
            }
        }
    }

    digitButtons.forEach(function (button) {
        button.onclick = function () {
            onDigitButtonClicked(button.innerHTML);
        };
    });

    document.getElementById('btn_op_plus').onclick = function () {
        if (a === '' || a === 'Ошибка') return;
        
        if (selectedOperation && b !== '') {
            calculate();
        }
        
        selectedOperation = '+';
        
        if (historyFull === '' || historyFull.endsWith('=')) {
            addToHistory(a + ' + ');
        } else {
            addToHistory('+ ');
        }
        waitingForSecondNumber = true;
    };
    
    document.getElementById('btn_op_minus').onclick = function () {
        if (a === '' || a === 'Ошибка') return;
        
        if (selectedOperation && b !== '') {
            calculate();
        }
        
        selectedOperation = '-';
        
        if (historyFull === '' || historyFull.endsWith('=')) {
            addToHistory(a + ' - ');
        } else {
            addToHistory('- ');
        }
        waitingForSecondNumber = true;
    };
    
    document.getElementById('btn_op_mult').onclick = function () {
        if (a === '' || a === 'Ошибка') return;
        
        if (selectedOperation && b !== '') {
            calculate();
        }
        
        selectedOperation = 'x';
        
        if (historyFull === '' || historyFull.endsWith('=')) {
            addToHistory(a + ' × ');
        } else {
            addToHistory('× ');
        }
        waitingForSecondNumber = true;
    };
    
    document.getElementById('btn_op_div').onclick = function () {
        if (a === '' || a === 'Ошибка') return;
        
        if (selectedOperation && b !== '') {
            calculate();
        }
        
        selectedOperation = '/';
        
        if (historyFull === '' || historyFull.endsWith('=')) {
            addToHistory(a + ' ÷ ');
        } else {
            addToHistory('÷ ');
        }
        waitingForSecondNumber = true;
    };
    
    document.getElementById('btn_op_clear').onclick = function () {
        a = '';
        b = '';
        selectedOperation = null;
        accumulator = null;
        accumulatorActive = false;
        waitingForSecondNumber = false;
        clearHistory();
        outputElement.innerHTML = '0';
    };
    
    function calculate() {
        if (a === '' || a === 'Ошибка') return;
        if (b === '' && selectedOperation) return;
        if (!selectedOperation) return;
        
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        let result;
        
        switch (selectedOperation) {
            case '+': result = numA + numB; break;
            case '-': result = numA - numB; break;
            case 'x': result = numA * numB; break;
            case '/':
                if (numB === 0) {
                    outputElement.innerHTML = 'Ошибка';
                    historyElement.innerHTML = 'деление на 0';
                    a = 'Ошибка';
                    b = '';
                    selectedOperation = null;
                    return;
                }
                result = numA / numB;
                break;
            default: return;
        }
        
        addToHistory(b + ' = ');
        
        let formattedResult = formatNumber(result);
        addToHistory(formattedResult);
        
        a = formattedResult;
        b = '';
        selectedOperation = null;
        outputElement.innerHTML = a;
        waitingForSecondNumber = false;
    }
    
    document.getElementById('btn_op_equal').onclick = calculate;

    document.getElementById('btn_op_sign').onclick = function () {
        const cur = getCurrentNumber();
        if (cur === '' || cur === '0' || cur === 'Ошибка') return;
        setCurrentNumber((parseFloat(cur) * -1).toString());
    };

    document.getElementById('btn_op_percent').onclick = function () {
        const cur = getCurrentNumber();
        if (cur === '' || cur === 'Ошибка') return;
        setCurrentNumber((parseFloat(cur) / 100).toString());
    };

    function doBackspace() {
        const cur = getCurrentNumber();
        if (cur === '' || cur === '0' || cur === 'Ошибка') return;
        const result = cur.slice(0, -1);
        setCurrentNumber(result === '' ? '0' : result);
    }

    // Тема
    let isDark = true;
    document.getElementById('switch').onclick = function () {
        const wrapper = document.querySelector('.calc-wrapper');
        const display = document.querySelector('.calc-display');
        if (isDark) {
            wrapper.style.backgroundColor = '#e8e2d9';
            wrapper.style.boxShadow = '0 24px 64px rgba(0,0,0,0.1)';
            display.style.backgroundColor = '#d5cfc6';
            outputElement.style.color = '#1a1a1a';
            historyElement.style.color = '#555';
            document.getElementById('switch').innerHTML = '🌙';
        } else {
            wrapper.style.backgroundColor = '#1a1a1a';
            wrapper.style.boxShadow = '0 24px 64px rgba(0,0,0,0.25)';
            display.style.backgroundColor = '#2c2c2c';
            outputElement.style.color = '#f5f3ee';
            historyElement.style.color = '#888';
            document.getElementById('switch').innerHTML = '☀';
        }
        isDark = !isDark;
    };

    function doSqrt() {
        const cur = getCurrentNumber();
        if (cur === '' || cur === 'Ошибка') return;
        if (parseFloat(cur) < 0) {
            outputElement.innerHTML = 'Ошибка';
            historyElement.innerHTML = 'корень из отрицательного';
            a = 'Ошибка';
            return;
        }
        addToHistory('√' + cur + ' = ');
        let result = formatNumber(Math.sqrt(parseFloat(cur)));
        addToHistory(result);
        a = result;
        b = '';
        selectedOperation = null;
        outputElement.innerHTML = a;
    }

    function doSquare() {
        const cur = getCurrentNumber();
        if (cur === '' || cur === 'Ошибка') return;
        addToHistory(cur + '² = ');
        let result = formatNumber(parseFloat(cur) * parseFloat(cur));
        addToHistory(result);
        a = result;
        b = '';
        selectedOperation = null;
        outputElement.innerHTML = a;
    }

    function doFactorial() {
        const cur = getCurrentNumber();
        if (cur === '' || cur === 'Ошибка') return;
        const n = parseFloat(cur);
        if (n < 0 || !Number.isInteger(n)) {
            outputElement.innerHTML = 'Ошибка';
            historyElement.innerHTML = 'только целые ≥ 0';
            a = 'Ошибка';
            return;
        }
        if (n > 170) {
            outputElement.innerHTML = '∞';
            historyElement.innerHTML = cur + '! слишком большое';
            a = '∞';
            return;
        }
        let fact = 1;
        for (let i = 2; i <= n; i++) {
            fact *= i;
        }
        addToHistory(cur + '! = ');
        let result = formatNumber(fact);
        addToHistory(result);
        a = result;
        b = '';
        selectedOperation = null;
        outputElement.innerHTML = a;
    }

    document.getElementById('btn_op_accplus').onclick = function () {
        const cur = getCurrentNumber();
        if (cur === '' || cur === 'Ошибка') return;
        if (accumulator === null) {
            accumulator = parseFloat(cur);
        } else {
            accumulator += parseFloat(cur);
        }
        accumulatorActive = true;
        addToHistory('A+ → ' + accumulator);
        a = formatNumber(accumulator).toString();
        b = '';
        selectedOperation = null;
        outputElement.innerHTML = a;
    };

    document.getElementById('btn_op_accminus').onclick = function () {
        const cur = getCurrentNumber();
        if (cur === '' || cur === 'Ошибка') return;
        if (accumulator === null) {
            accumulator = parseFloat(cur);
        } else {
            accumulator -= parseFloat(cur);
        }
        accumulatorActive = true;
        addToHistory('A- → ' + accumulator);
        a = formatNumber(accumulator).toString();
        b = '';
        selectedOperation = null;
        outputElement.innerHTML = a;
    };

    document.getElementById('btn_op_custom').onclick = function () {
        const cur = getCurrentNumber();
        if (cur === '' || cur === 'Ошибка') return;
        if (parseFloat(cur) === 0) {
            outputElement.innerHTML = 'Ошибка';
            historyElement.innerHTML = 'деление на 0';
            a = 'Ошибка';
            return;
        }
        addToHistory('1/' + cur + ' = ');
        let result = formatNumber(1 / parseFloat(cur));
        addToHistory(result);
        a = result;
        b = '';
        selectedOperation = null;
        outputElement.innerHTML = a;
    };

    document.addEventListener('keydown', function (event) {
        switch (event.key) {
            case '0': case '1': case '2': case '3': case '4':
            case '5': case '6': case '7': case '8': case '9':
                onDigitButtonClicked(event.key);
                break;
            case '.': case ',':
                onDigitButtonClicked('.');
                break;
            case '+':
                if (a === '' || a === 'Ошибка') break;
                if (selectedOperation && b !== '') calculate();
                selectedOperation = '+';
                if (historyFull === '' || historyFull.endsWith('=')) {
                    addToHistory(a + ' + ');
                } else {
                    addToHistory('+ ');
                }
                break;
            case '-':
                if (a === '' || a === 'Ошибка') break;
                if (selectedOperation && b !== '') calculate();
                selectedOperation = '-';
                if (historyFull === '' || historyFull.endsWith('=')) {
                    addToHistory(a + ' - ');
                } else {
                    addToHistory('- ');
                }
                break;
            case '*':
                if (a === '' || a === 'Ошибка') break;
                if (selectedOperation && b !== '') calculate();
                selectedOperation = 'x';
                if (historyFull === '' || historyFull.endsWith('=')) {
                    addToHistory(a + ' × ');
                } else {
                    addToHistory('× ');
                }
                break;
            case '/':
                if (a === '' || a === 'Ошибка') break;
                if (selectedOperation && b !== '') calculate();
                selectedOperation = '/';
                if (historyFull === '' || historyFull.endsWith('=')) {
                    addToHistory(a + ' ÷ ');
                } else {
                    addToHistory('÷ ');
                }
                break;
            case 'Enter':
            case '=':
                calculate();
                break;
            case 'Escape':
                a = '';
                b = '';
                selectedOperation = null;
                clearHistory();
                outputElement.innerHTML = '0';
                break;
            case 'Backspace':
                doBackspace();
                break;
            case 'r':
            case 'R':
                doSqrt();
                break;
            case 'q':
            case 'Q':
                doSquare();
                break;
            case 'f':
            case 'F':
                doFactorial();
                break;
        }
    });
};