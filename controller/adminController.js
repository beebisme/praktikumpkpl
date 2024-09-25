const Admin = require("../model/admin");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const EmailSender = require("../service/smtp/send-email");

module.exports.getEmailAdmin = async function () {
  const admins = await Admin.find();
  const adminEmails = admins.map((admin) => admin.email);
  return adminEmails;
};

module.exports.getAdminInfo = async function (id) {
  const admin = await Admin.findOne({ _id: id });
  return admin;
};

module.exports.requestResetPassword = async function (req, res) {
  const email = req.body.email;
  try {
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(400).json({ msg: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    admin.resetPasswordToken = token;
    await admin.save();

    EmailSender.sendEmail(email, "Reset Password", "reqReset", token);
    res.status(200).json({ msg: "Email berhasil dikirim" });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

module.exports.resetPassword = async function (req, res) {
  const { password, token } = req.body;
  try {
    const admin = await Admin.findOne({ resetPasswordToken: token });

    if (!admin) {
      return res.status(400).json({ msg: "Invalid token" });
    }

    admin.resetPasswordToken = undefined;
    admin.password = bcrypt.hashSync(password, 8);
    await admin.save();

    res.status(200).json({ msg: "Password berhasil diubah" });
  } catch (e) {
    res.status(500).send("Server error");
  }
};
