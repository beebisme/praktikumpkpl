const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  nama: String,
  email: String,
  alamat: String,
  nomor: String,
  jenisPohon: String,
  jumlah: String,
  diameter: String,
  lokasi: String,
  alasan: [String],
  status: String,
  foto: String,
});

module.exports = mongoose.model("laporan", dataSchema);
