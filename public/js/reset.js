const btnRequestToken = document.getElementById("btnRequestToken");
const btnReset = document.getElementById("btnReset");
const email = document.getElementById("email");
const token = document.getElementById("token");
const password = document.getElementById("password");

btnRequestToken.addEventListener("click", async (e) => {
  e.preventDefault();

  await fetch("/api/admin/auth/request-reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.value,
    }),
  }).then((response) => {
    if (response.status === 200) {
      alert("Silahkan Cek Email Anda");
    } else if (response.status === 500) {
      alert("Terjadi Kesalahan Pada Server");
    } else if (response.status === 400) {
      alert("Email Tidak Terdaftar");
    }
  });
});

btnReset.addEventListener("click", async (e) => {
  e.preventDefault();
  await fetch("/api/admin/auth/reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: password.value,
      token: token.value,
    }),
  }).then((response) => {
    if (response.status === 200) {
      alert("Berhasil Mengubah Password");
      window.location.replace(`${window.location.origin}/kepoling/admin/login`);
    } else if (response.status === 500) {
      alert("Terjadi Kesalahan Pada Server");
    } else if (response.status === 400) {
      alert("Token Tidak Valid");
    }
  });
});
