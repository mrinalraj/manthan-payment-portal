const nodemailer = require('nodemailer2'),
    hbs = require('nodemailer-express-handlebars')


module.exports.sendTeamMail = (user, callback) => {
    let auth = {
        user: 'manthandisha18@gmail.com',
        pass: process.env.UserPassword
    }
    console.log(auth)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: auth
    })
    let mailOptions = {
        from: '"Manthan 2018" ' + auth.user,
        to: "raj.mrnl@gmail.com",
        subject: 'New Kurukshetra Registration',
        template: 'teammail',
        context: {
            user: user
        }
    }
    let options = {
        viewEngine: {
            extname: 'handlebars',
            layoutsDir: './views/mails'
        },
        viewPath: './views/mails'
    }
    transporter.use('compile', hbs(options))
    transporter
        .sendMail(mailOptions, (err, info) => {
            if (err) return console.log(err)
            console.log('mail sent to ' + user.email, info.messageId, info.response)
            console.log(info)
            callback(err)
        })
}