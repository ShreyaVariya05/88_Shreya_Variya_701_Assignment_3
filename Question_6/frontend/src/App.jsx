import { useState } from "react";

function App() {
  const [amount, setAmount] = useState("");

  const [from, setFrom] = useState("USD");

  const [to, setTo] = useState("INR");

  const [result, setResult] = useState("");

  const [error, setError] = useState("");

  async function convertCurrency() {
    if (!amount) {
      setError("Please enter amount");

      return;
    }

    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/currency?amount=${amount}&from=${from}&to=${to}`,
      );

      const data = await response.json();

      if (data.rates && data.rates[to]) {
        setResult(`${amount} ${from} = ${data.rates[to]} ${to}`);
      } else {
        setError("Currency conversion failed");
      }
    } catch (error) {
      setError("Unable to connect to backend");
    }
  }

  return (
    <div>
      <h2>Currency Converter</h2>

      <label>Amount:</label>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br />
      <br />

      <label>From:</label>

      <select value={from} onChange={(e) => setFrom(e.target.value)}>
        <option value="USD">USD</option>
        <option value="INR">INR</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
      </select>

      <br />
      <br />

      <label>To:</label>

      <select value={to} onChange={(e) => setTo(e.target.value)}>
        <option value="INR">INR</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
      </select>

      <br />
      <br />

      <button onClick={convertCurrency}>Convert</button>

      <br />
      <br />

      {result && <p>{result}</p>}

      {error && <p>{error}</p>}
    </div>
  );
}

export default App;
