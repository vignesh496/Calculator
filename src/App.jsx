// App.jsx
import { useRef, useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);

  // Store refs for all buttons
  const buttonRefs = useRef({});

  const focusInput = () => inputRef.current && inputRef.current.focus();

  const handleClick = (value) => {
    setInput((prev) => prev + value);
    focusInput();
  };

  const handleClear = () => {
    setInput("");
    focusInput();
  };

  const handleChange = (e) => {
    // sanitize input while typing
    const sanitized = e.target.value.replace(/[^0-9+\-*/(). ]/g, "");
    setInput(sanitized);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "=") {
      e.preventDefault();
      handleCalculate();
      triggerButtonEffect("=");
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleClear();
      triggerButtonEffect("C");
    } else {
      // map to button highlight only
      const keyMap = { "/": "÷", "*": "×", "-": "-", "+": "+", ".": "." };
      const displayKey = keyMap[e.key] || e.key;
      if (/^[0-9+\-*/.]$/.test(e.key)) {
        triggerButtonEffect(displayKey);
      }
    }
  };

  const handleCalculate = () => {
    try {
      const expr = input.replace(/[+\-*/.]+$/, ""); // strip trailing operator
      if (!expr.trim()) return;

      const resultNum = eval(expr); // ⚠️ safe only for controlled calculator
      const result = String(resultNum);

      setHistory((h) => [{ expression: expr, result }, ...h].slice(0, 10));
      setInput(result);
      focusInput();
    } catch {
      setInput("Error");
      focusInput();
    }
  };

  const triggerButtonEffect = (value) => {
    const btn = buttonRefs.current[value];
    if (btn) {
      btn.classList.add("active-press");
      setTimeout(() => btn.classList.remove("active-press"), 150);
    }
  };

  const registerButtonRef = (value, el) => {
    if (el) buttonRefs.current[value] = el;
  };

  return (
    <div className="global">
      <h2 className="title">Calculator App</h2>
    <div className="calculator">
      <input
        ref={inputRef}
        autoFocus
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="display"
        placeholder="0"
        inputMode="decimal"
      />

      {history.length > 0 && (
        <>
        <h4 className="history-title">History</h4>
        <div className="history">
          
          <ul>
            {history.map((item, index) => (
              <li key={index} onClick={() => setInput(item.result)}>
                <span className="expr">{item.expression}</span>
                <span className="eq">=</span>
                <span className="res">{item.result}</span>
              </li>
            ))}
          </ul>
        </div>
        </>
      )}

      <div className="buttons">
        <button
          ref={(el) => registerButtonRef("C", el)}
          onClick={handleClear}
          className="clear"
        >
          C
        </button>
        <button
          ref={(el) => registerButtonRef("÷", el)}
          onClick={() => handleClick("/")}
        >
          &divide;
        </button>
        <button
          ref={(el) => registerButtonRef("×", el)}
          onClick={() => handleClick("*")}
        >
          &times;
        </button>
        <button
          ref={(el) => registerButtonRef("-", el)}
          onClick={() => handleClick("-")}
        >
          -
        </button>

        <button ref={(el) => registerButtonRef("7", el)} onClick={() => handleClick("7")}>7</button>
        <button ref={(el) => registerButtonRef("8", el)} onClick={() => handleClick("8")}>8</button>
        <button ref={(el) => registerButtonRef("9", el)} onClick={() => handleClick("9")}>9</button>
        <button ref={(el) => registerButtonRef("+", el)} onClick={() => handleClick("+")}>+</button>

        <button ref={(el) => registerButtonRef("4", el)} onClick={() => handleClick("4")}>4</button>
        <button ref={(el) => registerButtonRef("5", el)} onClick={() => handleClick("5")}>5</button>
        <button ref={(el) => registerButtonRef("6", el)} onClick={() => handleClick("6")}>6</button>
        <button
          ref={(el) => registerButtonRef("=", el)}
          onClick={handleCalculate}
          className="equals"
        >
          =
        </button>

        <button ref={(el) => registerButtonRef("1", el)} onClick={() => handleClick("1")}>1</button>
        <button ref={(el) => registerButtonRef("2", el)} onClick={() => handleClick("2")}>2</button>
        <button ref={(el) => registerButtonRef("3", el)} onClick={() => handleClick("3")}>3</button>
        <button ref={(el) => registerButtonRef("0", el)} onClick={() => handleClick("0")}>0</button>

        <button ref={(el) => registerButtonRef(".", el)} onClick={() => handleClick(".")}>.</button>
      </div>
    </div>
    </div>
  );
}

export default App;
