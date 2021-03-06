const nodemailer = require('nodemailer2'),
    hbs = require('nodemailer-express-handlebars'),
    inlineBase64 = require('nodemailer-plugin-inline-base64')

module.exports.sendMail = (user , callback) => {
    let auth = {
        user : 'manthandisha18@gmail.com',
        pass : process.env.UserPassword
    }
    console.log(auth)
    let transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : auth
    })
    let mailOptions = {
        from : '"Manthan 2018" ' + auth.user,
        to : user.email,
        subject : 'Manthan 2018 ticket',
        template: 'ticketmail',
        context : {
            user : user,
            accomodation : user.accomodation ? "Yes" : "No"
        }
    }
    let options = {
        viewEngine :{
            extname : 'handlebars',
            layoutsDir : './views/mails'
        }
        , viewPath : './views/mails'
    }
    transporter.use('compile',hbs(options))
    transporter.use('compile',inlineBase64())
    transporter
        .sendMail(mailOptions,(err,info)=>{
            if (err) return console.log(err)
            console.log('mail sent to '+user.email,info.messageId, info.response)
            console.log(info)
            callback(err)
        })
}