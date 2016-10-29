'use scrict';
// TODO move emails to project
var TEST_EMAILS = [
    // Тут надо добавлять почту для тестирования
    //'ai@yandex.ru',
    //'apkawa@gmail.com',
    //'natpiot@yandex.ru'
    'df@uslugi24.ru'
]

var current_date = new Date().toString()

var email_subject = 'Food Service';

var email_builder_options = {
    encodeSpecialChars: false,

    emailTest: {
        // Your Email
        from: 'no-reply@u24.services',
        to: TEST_EMAILS.join(','),
        // Your email Subject
        subject: email_subject + ' [' + current_date + ']',

        // Optional
        nodemailer: {
            transporter: {
                host: 'smtp.mailgun.org',
                port: 465,
                secure: true, // use SSL
                auth: {
                    user: 'gulp-test@u24.services',
                    pass: 'gulp-test'
                }
            }

        }
    },
}
