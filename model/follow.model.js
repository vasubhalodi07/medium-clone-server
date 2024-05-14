const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconn");

const FollowModel = sequelize.define("follow", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  follower_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  following_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = FollowModel;
