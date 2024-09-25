const nodemailer = require("nodemailer");

const notificationContent = (data) => `<h1>Hai admin, ada pengaduan baru</h1>
<p>Berikut adalah detail pengaduan yang telah diterima:</p>
<p><strong>Nama Pelapor:</strong> ${data.nama}</p>
<p><strong>Alamat Pelapor:</strong> ${data.alamat}</p>
<p><strong>Nomor Pelapor:</strong> ${data.nomor}</p>
<p><strong>Jenis Pohon:</strong> ${data.jenisPohon}</p>
<p><strong>Jumlah Pohon:</strong> ${data.jumlah}</p>
<p><strong>Diameter Pohon:</strong> ${data.diameter} cm</p>
<p><strong>Lokasi:</strong> ${data.lokasi}</p>
<p><strong>Alasan:</strong></p>
<ul>
    ${data.alasan.map((items) => `<li>${items}</li>`)}
</ul>
<p>Silakan segera tindak lanjuti pengaduan ini. Terima kasih.</p>`;

const resetPasswordContent = (token) => `<p>Token : <b>${token}</b></p>`;

const notifikasiPelaporDisetujui =
  "<p>Bapak/ibu yang terhormat, kami dari admin KEPOLING Dlhkp Kota Kediri ingin menindaklanjuti terkait pelaporan yang diajukan sebelumnya terkait kepras/potong pohon, silahkan untuk melakukan pengambilan surat balasan di kantor DLHKP KOTA KEDIRI yang beralamatkan di Jl. Mayor Bismo no 4, Kel. Semampir Kec. Kota, Kota Kediri, Jawa Timur 64129</p>";

const notifikasiPelaporDitolak =
  "Bapak/ibu yang terhormat kami dari admin KEPOLING Dlhkp Kota Kediri ingin menindaklanjuti terkait pelaporan yang diajukan sebelumnya terkait kepras/potong pohon, mohon maaf pelaporan yang diajukan memerlukan diskusi lebih lanjut, silahkan untuk melakukan kunjungan secara langsung untuk menindaklanjuti permohonan Anda terkait kepras/potong pohon di kantor DLHKP KOTA KEDIRI yang beralamatkan di Jl. Mayor Bismo no 4, Kel. Semampir Kec. Kota, Kota Kediri, Jawa Timur 64129";

module.exports.sendEmail = async function (
  targetEmail,
  subject,
  contentType,
  data
) {
  let emailContent;

  if (contentType === "forAdmin") {
    emailContent = notificationContent(data);
  } else if (contentType === "reqReset") {
    emailContent = resetPasswordContent(data);
  } else if (contentType === "laporanDisetujui") {
    emailContent = notifikasiPelaporDisetujui;
  } else if (contentType === "laporanDitolak") {
    emailContent = notifikasiPelaporDitolak;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "kepolingdlhkpkotakediri@gmail.com",
      pass: "gljaikrzmoqnzsxf",
    },
  });

  const mailOptions = {
    from: {
      name: "Kepoling DLKHP Kota Kediri",
      address: "kepolingdlhkpkotakediri@gmail.com",
    },
    to: targetEmail,
    subject: subject,
    html: emailContent,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
