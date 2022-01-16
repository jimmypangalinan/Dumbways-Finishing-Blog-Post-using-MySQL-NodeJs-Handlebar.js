function submitData() {
    let firstName = document.getElementById('firstName').value
    let lastName = document.getElementById('lastName').value
    let emailInfo = document.getElementById('emailInfo').value
    let phoneNumber = document.getElementById('phoneNumber').value
    let subject = document.getElementById('subject').value
    let message = document.getElementById('message').value


    // tampilkan dalam console
    console.log(firstName);


    if (firstName == "") {
        return alert("Nama Depan tidak boleh kosong")
    } else if (lastName == "") {
        return alert("Nama Belakang")
    } else if (emailInfo == "") {
        return alert("Email tidak boleh kosong")
    } else if (phoneNumber == "") {
        return alert("Nomor Handphone tidak boleh kosong")
    } else if (subject == "") {
        return alert("Silakan pilih subject")
    } else {

        let emailReceiver = 'jimmipangalinan@gmail.com'

        let koding = document.getElementById('coding');
        let makan = document.getElementById('movie');

        // Untuk mengidentifikasi element yang berisi value dari input
        coding = coding.checked;
        movie = movie.checked;

        if (coding) {
            coding = (document.getElementById('coding').value)
        } else {
            coding = ""
        }

        if (movie) {
            movie = (document.getElementById('movie').value);
        } else {
            movie = ""
        }



        // membuat element anchor /link
        let a = document.createElement('a')

        a.href = `mailto: ${emailReceiver}?subject=${subject} &body=Halo nama saya ${firstName} ${lastName},  ${message} hobi saya: ${coding} ${movie} Mohon Hubungi saya di nomor : ${phoneNumber}`

        a.click()

        let dataObject = {
            firstName: firstName,
            lastName: lastName,
            emailInfo: emailInfo,
            phoneNumber: phoneNumber,
            subject: subject,
            message: message,
            coding: coding,
            movie: movie
        }
        // Jika hanya ingin menampilkan email
        // console.log(dataObject.mail);

        console.log(dataObject);

    }
}