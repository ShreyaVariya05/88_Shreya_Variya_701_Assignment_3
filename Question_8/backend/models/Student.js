const { DataTypes } = require("sequelize");

const sequelize = require("sequelize");

const db = new sequelize.Sequelize("studentdb", "root", "YourNewPassword", {
  host: "localhost",
  dialect: "mysql",
});

const Student = db.define("Student", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  course: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = {
  Student,
  db,
};
