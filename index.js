//mengambil modul express menggunakan require dan memasukan kedalam var express yang kan bertindak sebagai function di var app
const express = require('express');

// var app menjalankan function express untuk dipakai dibawah 
const app = express()
//menentukan portnya
const PORT = 7000

//mengkoneksikan server ke database 
const db = require('./conection/db')

app.set('view engine', 'hbs') //set templete engine dari folder node_modules

//menjadikan folder public menampung file static speerti file gambar, css file, js 
//__dirname untuk mengakses subdirectory dalam folder public
app.use('/public', express.static(__dirname + '/public'))

app.use(express.urlencoded({ extended: false }))




// Membuat functiion untuk format waktu post pada blog
function getFullTime(time) {
    let month = ['January', 'Februari', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Membuat var format date
    let date = time.getDate();

    // Membuat var format bulan dengan mengambil index bulan di var month diatas 
    let monthIndex = time.getMonth();

    // Membuat var format tahun
    let year = time.getFullYear()

    // mendapatkan jam
    let hours = time.getHours()

    // mendapatkan menit
    let minutes = time.getMinutes()

    return `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`
}



function getDistanceTime(time) {
    let timePost = time;
    let timeNow = new Date();

    let distance = timeNow - timePost;

    let miliSecond = 1000; // 1 Second = 1000 milisecond.
    let secondInHours = 3600; // 1 Hours = 3600 second.
    let hoursInDay = 23; // 1 Day = 23 Hours because if you write 24, 24 = 00.
    let minutes = 60;
    let second = 60;

    let distanceDay = Math.floor(
        distance / (miliSecond * secondInHours * hoursInDay)
    ); // menampilkan hari.
    let distanceHours = Math.floor(distance / (miliSecond * minutes * second)); // menampilkan jam.
    let distanceMinutes = Math.floor(distance / (miliSecond * minutes)); // menampilkan menit.
    let distanceSeconds = Math.floor(distance / miliSecond); // menampilkan detik.

    if (distanceDay >= 1) {
        return `${distanceDay} day ago`;
    } else if (distanceHours >= 1) {
        return `${distanceHours} hours ago`;
    } else if (distanceMinutes >= 1) {
        return `${distanceMinutes} minutes ago`;
    } else {
        return `${distanceSeconds} seconds ago`;
    }
}


//membuat rute utama
//ketika dijalankan app dan ada request method get kehalaman /(root)  maka jalankan fungsi dalam blok yaitu tampilkan index
app.get('/', function (request, response) {
    response.render('index');
});


let isLogin = true


// rute halaman blog
app.get('/blog', function (request, response) {

    db.connect(function (err, client, done) {
        if (err) throw err

        client.query('SELECT * FROM tb_blog ORDER BY id ASC', function (err, result) {
            if (err) throw err

            // console.log(result.rows); //print isi row dari tb_blog

            let blogsDB = result.rows

            const blogsData = blogsDB.map((data) => ({

                ...data,
                isLogin,
                // postAt: getFullTime(data.postAt),
                // postAtDistance: getDistanceTime(blog.postAt)

            }))
            // console.log(blogsData);
            response.render('blog', { isLogin, blogs: blogsData }) //ngirim isLogin sama blogs ke halaman /blog
        })

    });
})

// app.get('/blog-detail/:id', function (request, response) {

//     let blogId = request.params.id

//     response.render("blog-detail", {
//         blog: {
//             id: blogId,
//             title: 'Selamat Datang di Web',
//             content: 'lorem ipsumlah',
//             author: 'Jimmy Pangalinan',
//             postAt: '12 Jan 2022 11:30 WIB'
//         }
//     })
// });

app.get("/blog-detail/:id", function (request, response) {
    let blogId = request.params.id;

    db.connect(function (err, client, done) {
        if (err) throw err;
        // Query untuk mendapatkan data dari database table tb_blogs berdasarkan idnya
        client.query(
            `SELECT * FROM tb_blog WHERE id = $1`,
            [blogId],
            function (errs, result) {
                if (errs) throw errs;

                // Render, untuk menampilkan
                response.render("blog-detail", { blog: result.rows[0] });
            }
        );
    });
});





// app.post('/blog', function (request, response) {

//     let data = {
//         title: request.body.inputTitle,
//         content: request.body.inputContent,
//         author: 'Jimmy Pangalinan',
//         postAt: getFullTime(new Date())
//     }

//     console.log(data);

//     blogs.push(data)

//     response.redirect('/blog')
// })


app.get('/add-blog', function (request, response) {
    response.render('add-blog');
});

// Method POST akan mengirimkan data atau nilai langsung ke action untuk ditampung, tanpa menampilkan pada URL.
app.post("/blog", function (request, response) {
    let data = request.body;

    db.connect(function (err, client, done) {
        if (err) throw err;

        // Query untuk memasukkan data baru ke database table tb_blogs
        client.query(
            `INSERT INTO tb_blog (title, content, author, image) VALUES ($1, $2, $3, $4)`,
            [data.inputTitle, data.inputContent, "Jimmy Pangalinan", "imagedummy.jpg"],
            function (errs, result) {

                if (errs) throw errs

                // Render, untuk menampilkan
                response.redirect("/blog");
            }
        );
    });
});

app.get("/edit-blog/:id", function (request, response) {
    let blogId = request.params.id;

    db.connect(function (err, client, done) {
        if (err) throw err;

        client.query(
            `SELECT * FROM tb_blog WHERE id = $1`,
            [blogId],
            function (errs, result) {
                if (errs) throw errs;

                response.render("edit-blog", {
                    blog: result.rows[0],
                });
            }
        );
    });
});

app.post("/edit-blog/:id", function (request, response) {
    // Mengubah isi dari blog berdasarkan indexnya, lalu setelah di klik submit, maka akan ke halaman blog.
    let blogId = request.params.id;
    let { inputTitle, inputContent, inputImage } = request.body;

    db.connect(function (err, client, done) {
        if (err) throw err;

        // Query untuk merubah data berdasarkan idnya di database table tb_blogs
        client.query(
            `UPDATE tb_blog SET title=$2, content=$3, image=$4 WHERE id = $1`,
            [blogId, inputTitle, inputContent, inputImage],
            function (errs, result) {
                if (errs) throw errs;

                response.redirect("/blog");
            }
        );
    });
});


// app.get('/delete-blog/:id', function (request, response) {
//     let id = request.params.id
//     // console.log(id);

//     blogs.splice(id, 1)
//     response.redirect('/blog')
// })

app.get("/delete-blog/:id", function (request, response) {
    let blogId = request.params.id;

    db.connect(function (err, client, done) {
        if (err) throw err;

        // Query untuk menghapus data berdasarkan idnya di database table tb_blogs
        client.query(
            `DELETE FROM tb_blog  WHERE id = $1`,
            [blogId],
            function (errs, result) {
                if (errs) throw errs;
                response.redirect("/blog");
            }
        );
    });
});




app.get('/contact', function (request, response) {
    response.render("contact");
});


//ketika nodejs dijalankan dengan port yang ditentukan diatas akan menjalankan function menampilkan tulisan di console 
app.listen(PORT, function () {
    console.log('Server starting on localhost Guys');
})

