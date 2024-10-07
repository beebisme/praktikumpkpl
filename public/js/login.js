const myModal = new bootstrap.Modal(document.getElementById("myModal"), {});
const btnClose = document.getElementById("btnClose");
const form = document.getElementById("loginForm");
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
    fetch("/api/admin/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    }).then((response) => {
      if (response.status === 500) {
        showModal("Terjadi Kesalahan", "Terjadi Kesalahan Di Server");
      } else if (response.status === 401) {
        showModal("Gagal", "Email atau Password anda salah");
        btnClose.addEventListener("click", () => {
          modal.hide();
        });
      } else if (response.status === 200) {
        showModal("Berhasil", "Anda Berhasil Masuk");
        btnClose.addEventListener("click", () => {
          window.location.replace(
            `${window.location.origin}/kepoling/admin/dashboard`
          );
        });
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
});
