const CommentModel = require("../model/comment.model");
const UserModel = require("../model/user.model");

exports.createComment = async (req, res) => {
  try {
    const { message, blog_id } = req.body;
    const { user_id } = req.user;
    const newComment = await CommentModel.create({
      message,
      blog_id,
      user_id,
    });

    res.status(200).send({ message: "comment created!", comment: newComment });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getCommentByBlogId = async (req, res) => {
  try {
    const blog_id = req.params.id;
    const comments = await CommentModel.findAll({
      where: { blog_id, is_deleted: false },
      include: [{ model: UserModel }],
    });
    res.status(200).send({ message: "comments fetched!", data: comments });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment_id = req.params.id;
    const comment = await CommentModel.findByPk(comment_id);
    if (!comment) {
      return res.status(404).send({ message: "comment not found" });
    }

    await comment.update({ is_deleted: true });
    res.status(200).send({ message: "comment deleted!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment_id = req.params.id;
    const comment = await CommentModel.findByPk(comment_id);
    if (!comment) {
      return res.status(404).send({ message: "comment not found" });
    }

    const { message } = req.body;
    await comment.update({ message: message });
    res
      .status(200)
      .send({ message: "comment updated successfully", data: comment });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
