const dataSchema = require("../model/data");
const path = require("path");
const fs = require("fs");

module.exports.getAllData = async function () {
  try {
    const data = await dataSchema.find();
    return data;
  } catch (error) {
    console.error(error);
  }
};

module.exports.getDataById = async function (id) {
  try {
    const data = await dataSchema.findOne({ _id: id });
    return data;
  } catch (error) {
    console.error(error);
  }
};

module.exports.setStatusLaporan = async function (id, status) {
  try {
    await dataSchema.updateOne(
      { _id: id },
      {
        status: status,
      }
    );
  } catch (error) {
    console.error(error);
  }
};

module.exports.addData = function (formData) {
  const newData = new dataSchema({
    nama: formData.nama,
    email: formData.email,
    alamat: formData.alamat,
    nomor: formData.nomor,
    jenisPohon: formData.jenisPohon,
    jumlah: formData.jumlah,
    diameter: formData.diameter,
    lokasi: formData.lokasi,
    alasan: formData.alasan,
    status: "Pending",
    foto: formData.foto,
  });

  dataSchema.create(newData);
};

module.exports.deleteData = async function (id) {
  await dataSchema.deleteOne({ _id: id });
};
