const Admin = require("../model/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register
module.exports.register = async function register(req, res) {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  const duplicate = await Admin.findOne({ email: req.body.email });

  if (duplicate === null) {
    try {
      const newAdmin = new Admin({
        email: req.body.email,
        password: hashedPassword,
      });

      Admin.create(newAdmin);
      res.status(200).send("Berhasil mendaftar");
    } catch (err) {
      res.status(500).send({ message: "Gagal Mendaftar", error: err });
    }
  } else {
    res.status(400).send({ message: "Username sudah ada" });
  }
};

// login
module.exports.login = async function login(req, res) {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) return res.status(404).send("Admin tidak terdaftar");

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      admin.password
    );
    if (!passwordIsValid)
      return res.status(401).send({ auth: false, token: null });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set cookie with token
    res.cookie("jwt", token).status(200).send({ auth: true });
  } catch (err) {
    res.status(500).send("Error logging in admin.");
  }
};

// logout
module.exports.logout = async function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).send({ auth: false });
};
