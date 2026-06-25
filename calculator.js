(function () {
  "use strict";
  const previousDisplay = document.getElementById("previousDisplay");
  const currentDisplay = document.getElementById("currentDisplay");
  const numberButtons = document.querySelectorAll(".btn-number");
  const operatorButtons = document.querySelectorAll(".btn-operator");
  const clearBtn = document.getElementById("clearBtn");
  const backspaceBtn = document.getElementById("backspaceBtn");
  const equalsBtn = document.getElementById("equalsBtn");
  let currentInput = "0";
  let previousInput = "";
  let operator = null;
  let shouldResetDisplay = false;
  let justEvaluated = false;

  function operatorSymbol(op) {
    const map = {
      "+": "+",
      "-": "−",
      "*": "×",
      "/": "÷",
      "%": "%",
    };
    return map[op] || op;
  }

  function highlightOperator(op) {
    operatorButtons.forEach((btn) => btn.classList.remove("active"));
    operatorButtons.forEach((btn) => {
      if (btn.dataset.operator === op) {
        btn.classList.add("active");
      }
    });
  }

  function clearHighlight() {
    operatorButtons.forEach((btn) => btn.classList.remove("active"));
  }

  function calculate(a, b, op) {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        if (b === 0) {
          currentDisplay.classList.add("error");
          return "error";
        }
        return a / b;
      case "%":
        return a % b;
      default:
        return b;
    }
  }

  function updateDisplay() {
    currentDisplay.textContent = currentInput || "0";
    currentDisplay.classList.remove("error");

    let displayExpression = "";

    if (previousInput && operator) {
      if (shouldResetDisplay || justEvaluated) {
        displayExpression = previousInput + " " + operatorSymbol(operator);
      } else {
        displayExpression =
          previousInput + " " + operatorSymbol(operator) + " " + currentInput;
      }
    } else if (previousInput && !operator) {
      displayExpression = previousInput;
    } else {
      displayExpression = "";
    }

    previousDisplay.textContent = displayExpression;
  }

  function clearAll() {
    currentInput = "0";
    previousInput = "";
    operator = null;
    shouldResetDisplay = false;
    justEvaluated = false;
    clearHighlight();
    updateDisplay();
  }

  function handleBackspace() {
    if (justEvaluated) {
      clearAll();
      return;
    }
    if (currentInput.length > 1) {
      currentInput = currentInput.slice(0, -1);
    } else {
      currentInput = "0";
    }
    updateDisplay();
  }

  function inputNumber(value) {
    if (justEvaluated) {
      clearAll();
      justEvaluated = false;
    }
    if (shouldResetDisplay) {
      currentInput = "0";
      shouldResetDisplay = false;
    }
    if (value === ",") {
      if (currentInput.includes(".")) return;
      if (currentInput === "") currentInput = "0";
      currentInput += ".";
    } else {
      if (currentInput === "0" && value !== ".") {
        currentInput = value;
      } else {
        currentInput += value;
      }
    }
    updateDisplay();
  }

  function handleOperator(op) {
    if (justEvaluated) {
      const prev = parseFloat(currentInput);
      if (!isNaN(prev)) {
        previousInput = currentInput;
        operator = op;
        shouldResetDisplay = true;
        justEvaluated = false;
        updateDisplay();
        highlightOperator(op);
      }
      return;
    }

    const current = parseFloat(currentInput);

    if (operator && !shouldResetDisplay) {
      const result = calculate(parseFloat(previousInput), current, operator);
      currentInput = String(result);
      previousInput = currentInput;
      operator = op;
      shouldResetDisplay = true;
      updateDisplay();
      highlightOperator(op);
      return;
    }

    if (currentInput !== "" && !isNaN(current)) {
      previousInput = currentInput;
      operator = op;
      shouldResetDisplay = true;
      updateDisplay();
      highlightOperator(op);
    }
  }

  function evaluate() {
    if (operator === null || shouldResetDisplay) {
      return;
    }

    const a = parseFloat(previousInput);
    const b = parseFloat(currentInput);

    if (isNaN(a) || isNaN(b)) return;

    const result = calculate(a, b, operator);

    previousInput =
      previousInput +
      " " +
      operatorSymbol(operator) +
      " " +
      currentInput +
      " =";
    currentInput = String(result);
    operator = null;
    shouldResetDisplay = true;
    justEvaluated = true;

    updateDisplay();
    clearHighlight();
  }

  function handleKeyboard(e) {
    const key = e.key;

    if (key >= "0" && key <= "9") {
      e.preventDefault();
      inputNumber(key);
      return;
    }
    if (key === ".") {
      e.preventDefault();
      inputNumber(".");
      return;
    }
    if (key === "+") {
      e.preventDefault();
      handleOperator("+");
      return;
    }
    if (key === "-") {
      e.preventDefault();
      handleOperator("-");
      return;
    }
    if (key === "") {
      e.preventDefault();
      handleOperator("");
      return;
    }
    if (key === "/") {
      e.preventDefault();
      handleOperator("/");
      return;
    }
    if (key === "%") {
      e.preventDefault();
      handleOperator("%");
      return;
    }
    if (key === "Enter" || key === "=") {
      e.preventDefault();
      evaluate();
      return;
    }
    if (key === "Backspace") {
      e.preventDefault();
      handleBackspace();
      return;
    }
    if (key === "Escape") {
      e.preventDefault();
      clearAll();
      return;
    }
  }

  function bindEvents() {
    numberButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        inputNumber(this.dataset.number);
      });
    });

    operatorButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        handleOperator(this.dataset.operator);
      });
    });

    clearBtn.addEventListener("click", clearAll);
    backspaceBtn.addEventListener("click", handleBackspace);
    equalsBtn.addEventListener("click", evaluate);
    document.addEventListener("keydown", handleKeyboard);
  }

  bindEvents();
  updateDisplay();
})();
