const FollowModel = require("../model/follow.model");
const UserModel = require("../model/user.model");

exports.followUser = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { following_id } = req.params;

    const existingFollow = await FollowModel.findOne({
      where: { follower_id: user_id, following_id: following_id },
    });
    if (existingFollow) {
      return res
        .status(400)
        .send({ message: "You are already following this user" });
    }

    await FollowModel.create({
      follower_id: user_id,
      following_id: following_id,
    });
    res.status(200).send({ message: "followed" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { following_id } = req.params;

    const follow = await FollowModel.findOne({
      where: { follower_id: user_id, following_id: following_id },
    });
    if (!follow) {
      return res.status(404).send({ message: "Follow relationship not found" });
    }
    await follow.destroy();
    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.fetchFollowing = async (req, res) => {
  try {
    const userId = req.params.userId;
    const following = await FollowModel.findAll({
      where: { follower_id: userId },
      include: [{ model: UserModel }],
    });

    res.status(200).send({ message: "users are fetched!", data: following });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.fetchFollowers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const followers = await FollowModel.findAll({
      where: { following_id: userId },
      include: [{ model: UserModel }],
    });

    res.status(200).send({ message: "users are fetched!", data: followers });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
