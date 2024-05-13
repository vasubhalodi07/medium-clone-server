const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconn");
const TagModel = require("./tag.model");
const BlogModel = require("./blog.model");

const BlogTagModel = sequelize.define("blogtag", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  blog_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: BlogModel,
      key: "id",
    },
  },
  tag_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TagModel,
      key: "id",
    },
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

// Define associations
BlogTagModel.belongsTo(BlogModel, { foreignKey: "blog_id" });
BlogModel.hasMany(BlogTagModel, { foreignKey: "blog_id" });

BlogTagModel.belongsTo(TagModel, { foreignKey: "tag_id" });
TagModel.hasMany(BlogTagModel, { foreignKey: "tag_id" });

module.exports = BlogTagModel;
