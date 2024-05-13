const express = require("express");
const app = express();

app.use(express.json());

const cors = require("cors");
app.use(cors());

const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

const sequlize = require("./config/dbconn");
sequlize
  .sync()
  .then(() => {
    console.log(`database configuration success!`);
  })
  .catch((err) => {
    console.log(`database configuration failed!`, err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.status(200).send({ message: "server is running!" });
});

const user = require("./routes/user.route");
const blog = require("./routes/blog.route");
const tag = require("./routes/tag.route");
const comment = require("./routes/comment.route");
app.use("/api/user", user);
app.use("/api/blog", blog);
app.use("/api/tag", tag);
app.use("/api/comment", comment);

const BlogModel = require("./model/blog.model");
const UserModel = require("./model/user.model");
const CommentModel = require("./model/comment.model");

BlogModel.belongsTo(UserModel, { foreignKey: "user_id" });
UserModel.hasMany(BlogModel, { foreignKey: "user_id" });

CommentModel.belongsTo(BlogModel, { foreignKey: "blog_id" });
CommentModel.belongsTo(UserModel, { foreignKey: "user_id" });

app.listen(process.env.PORT, (req, res) => {
  console.log(`server is running on port ${process.env.PORT}`);
});
