const { PDFDocument, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

module.exports.generatePdf = async function (data) {
  const laporan = data;

  const pdfPath = path.join(__dirname, "..", "..", "public", "file.pdf");
  const pdf = fs.readFileSync(pdfPath);

  const pdfDoc = await PDFDocument.load(pdf);
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const form = pdfDoc.getForm();
  const nameField = form.getTextField("nama");
  const alamatField = form.getTextField("alamat");
  const teleponField = form.getTextField("telepon");
  const jenisField = form.getTextField("jenis");
  const jumlahField = form.getTextField("jumlah");
  const diameterField = form.getTextField("diameter");
  const lokasiField = form.getTextField("lokasi");
  const alasanField = form.getTextField("alasan");

  nameField.setText(laporan.nama);
  nameField.setFontSize(12);
  nameField.updateAppearances(timesRomanFont);

  alamatField.setText(laporan.alamat);
  alamatField.setFontSize(12);
  alamatField.updateAppearances(timesRomanFont);

  teleponField.setText(laporan.nomor);
  teleponField.setFontSize(12);
  teleponField.updateAppearances(timesRomanFont);

  jenisField.setText(laporan.jenisPohon);
  jenisField.setFontSize(12);
  jenisField.updateAppearances(timesRomanFont);

  jumlahField.setText(laporan.jumlah);
  jumlahField.setFontSize(12);
  jumlahField.updateAppearances(timesRomanFont);

  diameterField.setText(`${laporan.diameter} cm`);
  diameterField.setFontSize(12);
  diameterField.updateAppearances(timesRomanFont);

  lokasiField.setText(laporan.lokasi);
  lokasiField.setFontSize(12);
  lokasiField.updateAppearances(timesRomanFont);

  let alasan = laporan.alasan;
  let alasanModified = alasan
    .filter((item) => item !== "")
    .map(
      (item, index, filteredArr) => `${filteredArr.indexOf(item) + 1}. ${item}`
    )
    .join("\n");
  alasanField.setText(alasanModified);
  alasanField.setFontSize(12);
  alasanField.updateAppearances(timesRomanFont);

  // Flatten the form to prevent further editing of the fields
  form.flatten();

  // Generate the PDF bytes
  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
};
