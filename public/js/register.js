const myModal = new bootstrap.Modal(document.getElementById("myModal"), {});
const btnClose = document.getElementById("btnClose");
const form = document.getElementById("registerForm");
const email = document.getElementById("email");
const password = document.getElementById("password");

function showModal(title, content) {
  let modalBody = document.getElementById("modalBody");
  let modalTitle = document.getElementById("modalTitle");
  let modalHeader = document.getElementById("modalHeader");

  if (title === "Terjadi Kesalahan") {
    modalHeader.classList.add("bg-danger");
    modalTitle.innerHTML = title;
  } else {
    modalHeader.classList.add("bg-success");
    modalTitle.innerHTML = title;
  }

  modalBody.innerHTML = content;
  myModal.show();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    fetch("/api/admin/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    }).then((response) => {
      if (response.status === 400) {
        showModal(
          "Terjadi Kesalahan",
          "Email Sudah Terdaftar! Silahkan Menggunakan Email Baru"
        );
      } else if (response.status === 500) {
        showModal("Terjadi Kesalahan", "Terjadi Kesalahan Di Server");
      } else if (response.status === 200) {
        showModal("Berhasil", "Anda Berhasil Mendaftar");
        window.location.replace(
          `${window.location.origin}/kepoling/admin/login`
        );
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
});
