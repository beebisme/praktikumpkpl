let tableBody = document.getElementById("tableBody");
const myModal = new bootstrap.Modal(document.getElementById("myModal"), {});
const btnSemua = document.getElementById("btnSemua");
const btnDisetujui = document.getElementById("btnDisetujui");
const btnPending = document.getElementById("btnPending");
const btnLogout = document.getElementById("btnLogout");
let data;

function fetchData() {
  const apiUrl = "/api/get-data";
  fetch(apiUrl)
    .then((response) => {
      if (response.status == 401) {
        window.location.replace(
          `${window.location.origin}/kepoling/admin/login`
        );
      }
      return response.json();
    })
    .then((responseData) => {
      buildElement(responseData);
      data = responseData;
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function refreshData() {
  while (tableBody.hasChildNodes()) {
    tableBody.removeChild(tableBody.firstChild);
  }
}

function filterTable(status, data) {
  const filteredData = data.filter((item) => item.status === status);
  buildElement(filteredData);
}

btnSemua.addEventListener("click", () => {
  refreshData();
  buildElement(data);
});

btnPending.addEventListener("click", () => {
  refreshData();
  filterTable("Pending", data);
});

btnDisetujui.addEventListener("click", () => {
  refreshData();
  filterTable("Disetujui", data);
});

btnDitolak.addEventListener("click", () => {
  refreshData();
  filterTable("Ditolak", data);
});

btnLogout.addEventListener("click", async () => {
  await fetch("/api/admin/auth/logout", { method: "POST" }).then((res) => {
    location.reload();
  });
});

function buildElement(data) {
  data.forEach((items) => {
    let tr = document.createElement("tr");

    let tdNama = document.createElement("td");
    tdNama.textContent = items["nama"];
    tr.appendChild(tdNama);

    let tdAlamat = document.createElement("td");
    tdAlamat.textContent = items["alamat"];
    tdAlamat.className = "col-md-2";
    tr.appendChild(tdAlamat);

    let tdTelepon = document.createElement("td");
    tdTelepon.textContent = items["nomor"];
    tr.appendChild(tdTelepon);

    let tdJenis = document.createElement("td");
    tdJenis.textContent = items["jenisPohon"];
    tr.appendChild(tdJenis);

    let tdJumlah = document.createElement("td");
    tdJumlah.textContent = items["jumlah"];
    tr.appendChild(tdJumlah);

    let tdDiameter = document.createElement("td");
    tdDiameter.textContent = items["diameter"];
    tr.appendChild(tdDiameter);

    let tdLokasi = document.createElement("td");
    tdLokasi.textContent = items["lokasi"];
    tr.appendChild(tdLokasi);

    let tdAlasan = document.createElement("td");
    let alasanList = document.createElement("ol");
    items["alasan"].forEach((alasan) => {
      if (alasan.trim() !== "") {
        let li = document.createElement("li");
        li.textContent = alasan;
        alasanList.appendChild(li);
      }
    });
    tdAlasan.appendChild(alasanList);
    tdAlasan.className = "col-md-2";
    tr.appendChild(tdAlasan);

    let tdFoto = document.createElement("td");
    let linkFoto = document.createElement("a");
    linkFoto.href = items["foto"];
    linkFoto.textContent = items["foto"];
    tdFoto.appendChild(linkFoto);
    tr.appendChild(tdFoto);

    // Action Button
    let actionButtonDiv = document.createElement("div");
    if (items["status"] === "Pending") {
      actionButtonDiv.className = "d-flex flex-column";
    } else {
      actionButtonDiv.className = "d-none";
    }

    let approveButton = document.createElement("button");
    approveButton.type = "button";
    approveButton.id = items["_id"];
    approveButton.className = "btn btn-success btn-sm mb-4";
    approveButton.textContent = "Setujui";
    approveButton.addEventListener("click", () => {
      const apiUrl = `/api/update-status/${items["_id"]}/Disetujui/${items["email"]}`;
      fetch(apiUrl, { method: "POST" })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          location.reload();
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
      refreshData();
      buildElement(data);
    });

    let rejectButton = document.createElement("button");
    rejectButton.type = "button";
    rejectButton.id = items["_id"];
    rejectButton.className = "btn btn-danger btn-sm";
    rejectButton.textContent = "Tolak";
    rejectButton.addEventListener("click", async () => {
      const apiUrl = `/api/update-status/${items["_id"]}/Ditolak/${items["email"]}`;
      await fetch(apiUrl, { method: "POST" })
        .then((res) => {
          return res;
        })
        .then((data) => {
          location.reload();
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
      location.reload();
    });

    actionButtonDiv.appendChild(approveButton);
    actionButtonDiv.appendChild(rejectButton);

    let actionCell = document.createElement("td");
    actionCell.appendChild(actionButtonDiv);
    tr.appendChild(actionCell);

    // Action Button 2
    let actionButton2Div = document.createElement("div");
    if (items["status"] === "Ditolak" || items["status"] === "Disetujui") {
      actionButton2Div.className = "d-flex flex-column";
    } else {
      actionButton2Div.className = "d-none";
    }

    let downloadButton = document.createElement("button");
    downloadButton.type = "button";
    downloadButton.id = items["_id"];
    downloadButton.className = "btn btn-primary btn-sm mb-4";
    downloadButton.textContent = "Unduh";
    downloadButton.addEventListener("click", async () => {
      const apiUrl = `/api/generatePdf/${items["_id"]}`;
      await fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to retrieve PDF");
          }
          return response.json();
        })
        .then((pdfBytes) => {
          const byteArray = new Uint8Array(Object.values(pdfBytes));
          const blob = new Blob([byteArray], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = `${items["nama"]}.pdf`;

          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    let deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.id = items["_id"];
    deleteButton.className = "btn btn-danger btn-sm";
    deleteButton.textContent = "Hapus";
    deleteButton.addEventListener("click", () => {
      const apiUrl = `/api/delete-data/${items["_id"]}`;
      fetch(apiUrl, { method: "DELETE" })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          location.reload();
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
      refreshData();
      buildElement(data);
    });

    actionButton2Div.appendChild(downloadButton);
    actionButton2Div.appendChild(deleteButton);

    actionCell.appendChild(actionButton2Div);

    let tdStatus = document.createElement("td");
    tdStatus.textContent = items["status"];
    tr.appendChild(tdStatus);

    // Append table row to table body
    tableBody.appendChild(tr);
  });
}

function showModal(title, content) {
  let modalBody = document.getElementById("modalBody");
  let modalBodyContent = document.createElement("div");
  let modalTitle = document.getElementById("modalTitle");

  if (modalBody.hasChildNodes()) {
    while (modalBody.hasChildNodes()) {
      modalBody.removeChild(modalBody.firstChild);
    }
  }

  if (Array.isArray(content) === true) {
    for (let i = 0; i < content.length; i++) {
      let img = document.createElement("img");
      img.classList.add("w-100");
      img.src = `${host}/${content[i]}`;
      modalBodyContent.appendChild(img);
    }
  } else {
    let img = document.createElement("img");
    img.classList.add("w-100");
    img.src = `${host}/${content}`;
    modalBodyContent.appendChild(img);
  }

  modalBody.appendChild(modalBodyContent);
  modalTitle.innerHTML = title;
  myModal.show();
}

fetchData();
