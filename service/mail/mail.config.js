const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vasu.bhalodi109088@marwadiuniversity.ac.in",
    pass: "hqfg afmn uqek kqzs",
  },
});

module.exports = transporter;
