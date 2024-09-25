const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dataController = require("../controller/dataController");
const adminController = require("../controller/adminController");
const EmailSender = require("../service/smtp/send-email");
const { generatePdf } = require("../service/pdfgen/generate-pdf");

// Get Data
router.get("/get-data", async (req, res) => {
  const authorized = verifyToken(req);
  if (authorized) {
    const data = await dataController.getAllData();
    res.send(data);
  } else {
    return res.status(401).send({ auth: false, message: "No token provided." });
  }
});

// Get Data By Id
router.get("/get-data/:id", async (req, res) => {
  const authorized = verifyToken(req);
  if (authorized) {
    res.send(await dataController.getDataById(req.params.id));
  } else {
    return res.status(401).send({ auth: false, message: "No token provided." });
  }
});

// Add Data
router.post("/add-data", async (req, res) => {
  const formData = req.body;

  try {
    dataController.addData(formData);
    await notifyAdmin(formData);
    res
      .status(200)
      .json({ Message: "Berhasil Menyimpan Data", status: "success" });
  } catch (error) {
    res.status(500).json({ error: "Terjadi Kesalahan Pada Server" });
  }
});

// Update Status Laporan
router.post("/update-status/:id/:status/:email", async (req, res) => {
  const authorized = verifyToken(req);

  if (authorized) {
    await dataController.setStatusLaporan(req.params.id, req.params.status);
    if (req.params.status === "Disetujui") {
      EmailSender.sendEmail(
        req.params.email,
        "Laporan Disetujui",
        "laporanDisetujui",
        ""
      );
    } else if (req.params.status === "Ditolak") {
      EmailSender.sendEmail(
        req.params.email,
        "Laporan Ditolak",
        "laporanDitolak",
        ""
      );
    }

    res.status(200).json({ message: "Berhasil Mengubah Status" });
  } else {
    return res.status(401).send({ auth: false, message: "No token provided." });
  }
});

// Delete Data
router.delete("/delete-data/:id", async (req, res) => {
  const authorized = verifyToken(req);
  if (authorized) {
    try {
      await dataController.deleteData(req.params.id);
      res.status(200).json({ message: "Data Berhasil Dihapus" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal Menghapus Data" });
    }
  } else {
    return res.status(401).send({ auth: false, message: "No token provided." });
  }
});

router.get("/generatePdf/:id", async (req, res) => {
  try {
    const data = await dataController.getDataById(req.params.id);
    const pdf = await generatePdf(data);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdf);
  } catch (error) {
    res.send({ error: error });
  }
});

async function notifyAdmin(data) {
  const emailAdmin = await adminController.getEmailAdmin();
  EmailSender.sendEmail(emailAdmin, "Pengaduan Baru", "forAdmin", data);
}

function verifyToken(req) {
  const token = req.cookies.jwt;
  if (!token) return false;

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) return false;

    req.userId = decoded.id;
  });
  return true;
}

module.exports = router;
