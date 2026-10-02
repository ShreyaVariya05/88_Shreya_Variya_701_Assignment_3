const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// =====================================
// Backend calls free currency API
// =====================================

app.get("/api/currency", async (req, res) => {
  try {
    const from = req.query.from;
    const to = req.query.to;
    const amount = Number(req.query.amount);

    const response = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`,
    );

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error calling currency API",
    });
  }
});

app.listen(5000, () => {
  console.log("Backend running at http://localhost:5000");
});
