const UserModel = require("../model/user.model");
const tokenCreation = require("../service/jwt/token.jwt");
const transporter = require("../service/mail/mail.config");

exports.login = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ message: "email is required" });
    }

    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .send({ message: "user not found! register your user" });
    }

    const access_token = tokenCreation.generateAccessTokenWithExpire(email);
    const info = await transporter.sendMail({
      from: '"Vasu Bhalodi" vasu.bhalodi109088@marwadiuniversity.ac.in',
      to: email,
      subject: "Login Method",
      html: `<p>
        Click the following link to login your account:
      </p>
      <p>
        <a href="http://localhost:4200/auth/?auth=${access_token}">http://localhost:4200/auth/?auth=${access_token}</a>
        </p>`,
    });

    res.status(200).send({
      message: "login mail send successfully!",
      data: info,
      token: access_token,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { toMail } = req.body;

    if (!toMail) {
      return res.status(400).send({ message: "email is required" });
    }

    let emailExist = await UserModel.findOne({
      where: { email: toMail },
    });

    if (emailExist) {
      return res.status(400).send({ message: "email already registered" });
    }

    const access_token = tokenCreation.generateAccessTokenWithExpire(toMail);
    const info = await transporter.sendMail({
      from: '"Vasu Bhalodi" vasu.bhalodi109088@marwadiuniversity.ac.in',
      to: toMail,
      subject: "Registration Confirmation",
      html: `<p>
        Click the following link to complete your registration:
      </p>
      <p>
        <a href="http://localhost:4200/auth/?token=${access_token}">http://localhost:4200/auth/?token=${access_token}</a>
        </p>`,
    });

    res.status(200).send({
      message: "mail send successfully!",
      data: info,
      token: access_token,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.loginCheckToken = async (req, res) => {
  try {
    const { email } = req.user;
    const findUser = await UserModel.findOne({ where: { email: email } });

    if (!findUser) {
      return res.status(404).send({ message: "user not found" });
    }

    const access_token = tokenCreation.generateAccessToken(findUser.id);
    res.status(200).send({
      message: "token is verified",
      access_token: access_token,
      id: findUser.id,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.checkToken = async (req, res) => {
  try {
    const { email } = req.user;
    const username = email.split("@")[0];

    let createUser = await UserModel.create({
      email: email,
      username: username,
    });

    const access_token = tokenCreation.generateAccessToken(createUser.id);
    res.status(200).send({
      message: "token is verified",
      access_token: access_token,
      id: createUser.id,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.fetchUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();
    res.status(200).send({ message: "users fetched!", data: users });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.fetchUserById = async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await UserModel.findByPk(user_id);

    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }

    res.status(200).send({ message: "user fetched!", data: user });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const { user_id } = req.user;
    const user = await UserModel.findByPk(user_id);

    if (!user) {
      return res.status(404).send({ message: "user not found" });
    }

    await user.update(req.body);
    res.status(200).send({ message: "user updated!", data: user });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
