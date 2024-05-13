const multer = require("multer");
const upload = require("../service/multer/image");
const { Op } = require("sequelize");
const BlogModel = require("../model/blog.model");
const sequelize = require("../config/dbconn");
const BlogTagModel = require("../model/blog-tag.model");
const TagModel = require("../model/tag.model");
const UserModel = require("../model/user.model");

// get user_id from middleware
exports.addBlog = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).send({ message: err.message });
      } else if (err) {
        return res.status(500).send({ message: err.message });
      }

      try {
        const { title, content, tags } = req.body;
        const { user_id } = req.user;

        const blog_image = req.file.path;
        const parsedTags = JSON.parse(tags);

        const newBlog = await BlogModel.create(
          { title, content, blog_image, user_id },
          { transaction }
        );

        const createTagPromises = parsedTags.map((id) => {
          return BlogTagModel.create(
            { blog_id: newBlog.id, tag_id: id },
            { transaction }
          );
        });

        await Promise.all(createTagPromises);

        await transaction.commit();
        res.status(201).send({ message: "Blog created!", data: newBlog });
      } catch (err) {
        await transaction.rollback();
        res.status(500).send({ message: err.message });
      }
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.fetchBlog = async (req, res) => {
  try {
    const { search } = req.query;
    let blogs;

    if (search) {
      blogs = await BlogModel.findAll({
        where: {
          [Op.or]: [
            { is_deleted: false },
            { title: { [Op.like]: `%${search}%` } },
          ],
        },
        include: [{ model: BlogTagModel, include: [{ model: TagModel }] }],
      });
    } else {
      blogs = await BlogModel.findAll({
        where: { is_deleted: false },
        include: [
          { model: UserModel },
          {
            model: BlogTagModel,
            include: [
              {
                model: TagModel,
              },
            ],
          },
        ],
      });
    }
    res.status(200).send({ message: "blog fetched!", data: blogs });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.fetchBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await BlogModel.findOne({
      where: {
        id: blogId,
        is_deleted: false,
      },
      include: [
        { model: UserModel },
        {
          model: BlogTagModel,
          include: [
            {
              model: TagModel,
            },
          ],
        },
      ],
    });
    if (!blog) {
      return res.status(404).send({ message: "blog not found" });
    }
    res.status(200).send({ message: "blog fetched!", data: blog });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.fetchBlogByUserID = async (req, res) => {
  try {
    const userid = req.params.userid;
    const blogs = await BlogModel.findAll({
      where: { user_id: userid, is_deleted: false },
      include: [
        { model: UserModel },
        {
          model: BlogTagModel,
          include: [
            {
              model: TagModel,
            },
          ],
        },
      ],
    });
    res.status(200).send({ message: "blog fetched!", data: blogs });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const existingBlog = await BlogModel.findByPk(blogId);

    if (!existingBlog) {
      return res.status(404).send({ message: "Blog not found" });
    }

    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).send({ message: err.message });
      } else if (err) {
        return res.status(500).send({ message: err.message });
      }

      try {
        const { title, content } = req.body;
        let updateFields = { title, content };

        if (req.file) {
          updateFields.blog_image = req.file.path;
        }

        await existingBlog.update(updateFields);
        res
          .status(200)
          .send({ message: "Blog updated successfully", data: existingBlog });
      } catch (err) {
        res.status(500).send({ message: err.message });
      }
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const [updatedRowsCount] = await BlogModel.update(
      { is_deleted: true },
      { where: { id: blogId } }
    );
    if (updatedRowsCount > 0) {
      res.status(200).send({ message: "blog deleted" });
    } else {
      res.status(404).send({ message: "blog not found" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
