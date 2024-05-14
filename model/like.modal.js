const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconn");

const LikeModel = sequelize.define("like", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  blog_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = LikeModel;
