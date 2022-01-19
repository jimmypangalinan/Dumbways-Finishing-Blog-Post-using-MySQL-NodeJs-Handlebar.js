//mengambil modul express menggunakan require dan memasukan kedalam var express yang kan bertindak sebagai function di var app
const express = require('express');

const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')

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
app.use(flash())
app.use(session({
    cookie: {
        maxAge: 2 * 60 * 60 * 1000, //data akan tersimpan dalam session selama 2 jam
        secure: false,
        httpOnly: true
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: 'secrectValue'

}))


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


//function untuk membuat waktu post berlalu
function getDistanceTime(time) {
    let timePost = time;
    let timeNow = new Date();

    let distance = timeNow - timePost;


    let miliSecond = 1000; // 1 Second = 1000 milisecond.
    let secondInHours = 3600; // 1 Hours = 3600 second.
    let hoursInDay = 23; // 1 Day = 23 Hours because if you write 24, 24 = 00.
    let minutes = 60; // 1 jam 60 menit
    let second = 60; // 1 menit 60 detik

    let distanceDay = Math.floor(
        distance / (miliSecond * secondInHours * hoursInDay)
    );
    // menampilkan hari.
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

    db.connect(function (err, client, done) {
        if (err) throw err
        // megambil data dengan mengurutkan id dari terkecil ke terbesar  (ORDER BY id ASC)
        client.query('SELECT * FROM tb_experience', function (err, result) {
            if (err) throw err

            let blogsexp = result.rows
            console.log(blogsexp);
            response.render('index', { blogsexp })

        })
    });
});

//var bolean untuk menampilkan tombol di blog jika kondisi true
let isLogin = true

// rute halaman blog
app.get('/blog', function (request, response) {
    db.connect(function (err, client, done) {
        if (err) throw err
        // megambil data dengan mengurutkan id dari terkecil ke terbesar  (ORDER BY id ASC)
        client.query('SELECT * FROM tb_blog', function (err, result) {
            if (err) throw err
            let blogsDb = result.rows
            console.log(blogsDb);
            const blogsData = blogsDb.map((data) => ({
                ...data,
                isLogin,
                postAt: getFullTime(data.postAt),
                postAtDistance: getDistanceTime(data.postAt)
            }))
            console.log(blogsData);
            response.render('blog', { isLogin, blogs: blogsData }) //ngirim isLogin sama blogs ke halaman /blog

        })
    });
})

app.get("/blog-detail/:id", function (request, response) {
    let id = request.params.id;

    db.connect(function (err, client, done) {
        if (err) throw err

        let query = `SELECT * FROM tb_blog  WHERE id = ${id}`

        // Query untuk menghapus data berdasarkan idnya di database table tb_blogs
        client.query(query, function (err, result) {
            if (err) throw err;
            let blogsDb = result.rows
            console.log(blogsDb);
            const blogsData = blogsDb.map((data) => ({
                ...data,
                postAt: getFullTime(data.postAt),

            }))
            console.log(blogsData);
            response.render('blog-detail', { blogsData });
        }
        );
    });
});


//rute menampilkan blog detai sesuai id
// app.get("/blog-detail/:id", function (request, response) {
//     let blogId = request.params.id;

//     db.connect(function (err, client, done) {
//         if (err) throw err;
//         // Query untuk mendapatkan data dari database table tb_blogs berdasarkan idnya
//         client.query(`SELECT * FROM tb_blog WHERE id = $1`,
//             [blogId],
//             function (errs, result) {
//                 if (errs) throw errs;
//                 // Render, untuk menampilkan
//                 response.render("blog-detail", { blog: result.rows[0] });
//             }
//         );
//     });
// });



//rute untuk menambakan blog baru
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

// route untuk edit blog
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
});[]
//update data
app.post("/edit-blog/:id", function (request, response) {
    // Menampilkan  isi dari blog berdasarkan indexnya, lalu setelah di klik submit, maka akan ke halaman blog.
    let id = request.params.id;

    const { inputTitle, inputContent } = request.body;

    db.connect(function (err, client, done) {
        if (err) throw err;

        // Query untuk merubah data berdasarkan idnya di database table tb_blogs
        client.query(`UPDATE tb_blog SET  title='${inputTitle}', content='${inputContent}'   WHERE id = '${id}'`,
            (err, result) => {

                if (err) { throw err; }
                response.redirect('/blog');
            }
        );
    });
});






//routemenghapus data di database
// app.get("/delete-blog/:id", function (request, response) {
//     let blogId = request.params.id;

//     db.connect(function (err, client, done) {
//         if (err) throw err;

//         // Query untuk menghapus data berdasarkan idnya di database table tb_blogs
//         client.query(
//             `DELETE FROM tb_blog  WHERE id = $1`,
//             [blogId],
//             function (errs, result) {
//                 if (errs) throw errs;
//                 response.redirect("/blog");
//             }
//         );
//     });
// });


app.get("/delete-blog/:id", function (request, response) {
    let id = request.params.id;

    let query = `DELETE FROM tb_blog  WHERE id = ${id}`

    db.connect(function (err, client, done) {
        if (err) throw err

        // Query untuk menghapus data berdasarkan idnya di database table tb_blogs
        client.query(query, function (err, result) {
            if (err) throw err;

            response.redirect("/blog");
        }
        );
    });
});




//Route untuk menuju halaman contact
app.get('/contact', function (request, response) {
    response.render("contact");
});


app.get('/register', function (request, response) {
    response.render("register");
});

//Route untuk menuju halaman Register
app.post('/register', function (request, response) {
    // console.log(request.body.inputName);



    const { inputName, inputEmail, inputPassword } = request.body
    const hashedPassword = bcrypt.hashSync(inputPassword, 10)

    let query = `INSERT INTO tb_user(name, email, password) VALUES ('${inputName}', '${inputEmail}', '${hashedPassword}')`

    db.connect(function (err, client, done) {
        if (err) throw err

        client.query(query, function (err, result) {
            if (err) throw err

            response.redirect("/login");
        })
    })


});

//Route untuk menuju halaman Login
app.get('/login', function (request, response) {
    response.render("login");
});


app.post('/login', function (request, response) {
    const { inputEmail, inputPassword } = request.body

    let query = `SELECT * FROM tb_user WHERE email = '${inputEmail}'`

    db.connect(function (err, client, done) {
        if (err) throw err

        client.query(query, function (err, result) {
            if (err) throw err

            console.log(result.rows.length);

            if (result.rows.length == 0) {

                request.flash('danger', 'Email Belum Terdaftar silakan register')
                return response.redirect('/register')
            }

            let isMatch = bcrypt.compareSync(inputPassword, result.rows[0].password)
            console.log(result.rows);

            if (isMatch) {

                request.session.isLogin = true
                request.session.user = {
                    id: result.rows[0].id,
                    name: result.rows[0].name,
                    email: result.rows[0].email
                }

                request.flash('success', 'Login success')
                response.redirect('/blog')
            } else {
                request.flash('danger', 'Password tidak sama')

                response.redirect('/login')
            }

        })
    })

});


//ketika nodejs dijalankan dengan port yang ditentukan diatas akan menjalankan function menampilkan tulisan di console 
app.listen(PORT, function () {
    console.log('Server Running');
})
