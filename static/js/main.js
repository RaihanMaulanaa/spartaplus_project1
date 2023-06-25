$(document).ready(function () {
  listing();
  bsCustomFileInput.init(); //memanggil fungsinya dari libary
});

function listing() {
  $.ajax({
    type: "GET",
    url: "/diary",
    data: {},
    success: function (response) {
      let articles = response["articles"];
      for (let i = 0; i < articles.length; i++) {
        let file = articles[i]["file"];
        let profile = articles[i]["profile"];
        let title = articles[i]["title"];
        let content = articles[i]["content"];
        let time = articles[i]["time"] || "??.??.????";
        let temp_html = `
          <div class="col-4">
            <div class="card">
              <img
              src="../${file}"
                class="card-img-top"
                alt="..."
              />
              <img
              src="../${profile}"
                class="bulat"
                alt="..."
              />  
              <rect width="100%" height="100%" fill="#777"></rect>
              <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">
                  ${content}
                </p>
                <h6 class="card-subtitle mb-2 text-muted">${time}</h6>
              </div>
            </div>
          </div>
        `;
        $("#cards-box").append(temp_html);
      }
    },
  });
}

function posting() {
  // trim() berfungsi untuk memangkas spasi awal dan spasi akhir, karna saya tidak ingin ada spasi kosong masuk ke database
  let title = $("#title-image").val().trim();
  if (!title) {
    return alert("Hei Pengguna, anda belum memberi judul pada kartu");
  }
  let content = $("#description-image").val().trim();
  if (!content) {
    return alert("Hei pengguna, anda belum memberi deskripsi pada kartu");
  }

  // di variabel ini berisi file gambar yang diambil dari #image. file ini hanya mengakses properti bernama file, file ini hanya mengekstrak file pertama[0]
  let file = $("#image").prop("files")[0];
  if (!file) {
    return alert("Hei pengguna, anda belum masukkan gambar pada kartu");
  }

  //tugas --
  let profile = $("#profile").prop("files")[0];
  if (!profile) {
    return alert("Hei pengguna, anda belum masukkan foto profil pada kartu");
  }

  // let time = $("#tanggal-time").val()
  // if (!time) {
  //   return alert("Hei pengguna, anda belum memberi tanggal pada kartu");
  // }

  // membuat objek formData
  form_data = new FormData();

  //data ini akan dimasukkan kedalam form_data
  form_data.append("file_give", file);
  form_data.append("profile_give", profile);
  form_data.append("title_give", title);
  form_data.append("content_give", content);
  // form_data.append("time_give", time);

  $.ajax({
    type: "POST",
    url: "/diary",
    data: form_data,
    contentType: false,
    processData: false,
    success: function (response) {
      alert(response["pesan"]);
      window.location.reload();
    },
  });
}
