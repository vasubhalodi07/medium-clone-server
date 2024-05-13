const TagModel = require("../model/tag.model");

exports.fetchTag = async (req, res) => {
  try {
    const { limit } = req.query;
    let tags;

    if (limit) {
      tags = await TagModel.findAll({
        where: { is_deleted: false },
        limit: parseInt(limit),
      });
    } else {
      tags = await TagModel.findAll({
        where: { is_deleted: false },
      });
    }

    res.status(200).send({ message: "Tags fetched!", data: tags });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.addTag = async (req, res) => {
  try {
    const { name } = req.body;
    await TagModel.create({ name });
    res.status(200).send({ message: "tag created!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.deleteTag = async (req, res) => {
  try {
    const tagId = req.params.id;
    const [updatedRowsCount] = await TagModel.update(
      { is_deleted: true },
      { where: { id: tagId } }
    );
    if (updatedRowsCount === 0) {
      return res.status(404).send({ message: "tag not found" });
    }
    res.status(200).send({ message: "tag deleted!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.updateTag = async (req, res) => {
  try {
    const tagId = req.params.id;
    const { name } = req.body;
    const [updatedRowsCount] = await TagModel.update(
      { name },
      { where: { id: tagId } }
    );
    if (updatedRowsCount === 0) {
      return res.status(404).send({ message: "tag not found" });
    }
    res.status(200).send({ message: "tag updated!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
