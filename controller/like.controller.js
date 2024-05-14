const BlogModel = require("../model/blog.model");
const LikeModel = require("../model/like.modal");

exports.addLike = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { blog_id } = req.params;

    const blog = await BlogModel.findByPk(blog_id);
    if (!blog || blog.user_id === user_id) {
      return res.status(400).json({ message: "You cannot like your own blog" });
    }

    const like = await LikeModel.create({
      user_id: user_id,
      blog_id: parseInt(blog_id),
    });
    res.status(200).send({ message: "blog liked!", data: like });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.removeLike = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { blog_id } = req.params;

    const like = await LikeModel.findOne({ where: { user_id, blog_id } });
    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }

    await like.destroy();
    res.status(200).send({ message: "Like removed successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
