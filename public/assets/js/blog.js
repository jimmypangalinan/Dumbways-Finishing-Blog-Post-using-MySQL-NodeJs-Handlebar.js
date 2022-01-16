//variabel penampung elemen inputan dari add-blog
let blogs = []

function addBlog(event) {
  event.preventDefault()

  let title = document.getElementById('input-blog-title').value
  let content = document.getElementById('input-blog-content').value
  let image = document.getElementById('input-blog-image').files

  image = URL.createObjectURL(image[0])

  let blog = {
    title: title,
    content: content,
    image: image,
    author: 'Jimmy Pangalinan',
    postAt: new Date()
  }

  // Untuk mengirim data inputan di add-blog ke dalam var blogs diatas yg ditampung dalam bentuk array
  blogs.push(blog)

  // Menampilkan isi var blogs
  console.log(blogs)

  // Memanggil fungsi renderBlog di DOM/ dibawah
  renderBlog();

}

// Manipulation Object HTML / DOM
//
function renderBlog() {
  // membuta var untuk mengambil data content pada add-blog.html
  let contentContainer = document.getElementById('contents')

  contentContainer.innerHTML = firstBlogPost()

  for (let i = 0; i < blogs.length; i++) {

    contentContainer.innerHTML += `
      <div class="blog-list-item">
        <div class="blog-image">
          <img src="${blogs[i].image}" alt="gambar" />
        </div>
        <div class="blog-content">
          <div class="btn-group">
            <button class="btn-edit">Edit Post</button>
            <button class="btn-post">Post Blog</button>
          </div>
          <h1>
            <a href="blog-detail.html" target="_blank"
              >${blogs[i].title}</a>
          </h1>
          <div class="detail-blog-content">
            ${getFullTime(blogs[i].postAt)} | ${blogs[i].author}
          </div>
          <p>
            ${blogs[i].content}
          </p>
          <div style="text-align: right;">
              <span style="font-size: 13px; color: grey">
                ${getDistanceTime(blogs[i].postAt)}
              </span>
          </div>
        </div>
      </div>`
  }
}



// membuat function
function firstBlogPost() {
  return `
    <div class="blog-list-item">
      <div class="blog-image">
        <img src="assets/blog-img.png" alt="" />
      </div>
      <div class="blog-content">
        <div class="btn-group">
          <button class="btn-edit">Edit Post</button>
          <button class="btn-post">Post Blog</button>
        </div>
        <h1>
          <a href="blog-detail.html" target="_blank"
            >Pasar Coding di Indonesia Dinilai Masih Menjanjikan</a
          >
        </h1>
        <div class="detail-blog-content">
          12 Jul 2021 22:30 WIB | Ichsan Emrald Alamsyah
        </div>
        <p>
          Ketimpangan sumber daya manusia (SDM) di sektor digital masih
          menjadi isu yang belum terpecahkan. Berdasarkan penelitian
          ManpowerGroup, ketimpangan SDM global, termasuk Indonesia,
          meningkat dua kali lipat dalam satu dekade terakhir. Lorem ipsum,
          dolor sit amet consectetur adipisicing elit. Quam, molestiae
          numquam! Deleniti maiores expedita eaque deserunt quaerat! Dicta,
          eligendi debitis?
        </p>
      </div>
    </div>`
}

// var bulan untuk tampilan di add-blog.html
let month = ['January', 'febuari', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Nopember', 'December']
// function untuk membuat tanggal, bulan, tahun, jam dan menit
function getFullTime(time) {
  //menampilkan 
  console.log(time);

  let date = time.getDate()
  let monthIndex = time.getMonth()
  let year = time.getFullYear()

  let hours = time.getHours()
  let minutes = time.getMinutes()

  let fullTime = `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`
  return fullTime
}

// function membuat waktu post sudah berapa hari/jam/menit/detik yang lalu.
function getDistanceTime(time) {

  let timePost = time
  let timeNow = new Date()

  //
  let distance = timeNow - timePost

  let milisecond = 1000 // seribu dalam 1 detik
  let secondInHours = 3600 // 1 jam sama dengan 3600 detik
  let hoursInDay = 23 // dalam 1 hari 23 jam 

  let minutes = 60 // menit
  let seconds = 60 // detik


  let distanceDay = Math.floor(distance / (milisecond * secondInHours * hoursInDay)) // untuk mendapatkan hari
  let distanceHours = Math.floor(distance / (milisecond * seconds * minutes)) // untuk mendapatkan jam 
  let distanceMinutes = Math.floor(distance / (milisecond * seconds)) // untuk mendapatkan menit
  let dinstanceSeconds = Math.floor(distance / milisecond) // untuk mendapatkan detik

  // kondisi untuk mendapatkan hari
  if (distanceDay >= 1) {
    return `${distanceDay} day ago`;

  } else if (distanceHours >= 1) {
    // kondisi untuk mendapatkan jam
    return `${distanceHours} hours ago`;

  } else if (distanceMinutes >= 1) {
    // kondisi untuk mendapatkan menit
    return `${distanceMinutes} minutes ago`;

  } else {
    return `${dinstanceSeconds} seconds ago`;
  }

}
// function untuk menjalankan renderBlog setiap 3menit (3000)
// setInterval(() => {
//     renderBlog()
//   }, 3000)