const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  empid: {
    type: String,
    unique: true,
  },

  name: String,

  email: String,

  department: String,

  basicSalary: Number,

  hra: Number,

  da: Number,

  pf: Number,

  netSalary: Number,

  password: String,
});

module.exports = mongoose.model("Employee", employeeSchema);
