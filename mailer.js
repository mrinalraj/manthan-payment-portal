const nodemailer = require('nodemailer'),
    hbs = require('nodemailer-express-handlebars')

module.exports.sendMail = (user , callback) => {
    let auth = {
        user : 'manthandisha18@gmail.com',
        pass : process.env.UserPassword
    }
    console.log(auth)
    let transporter = nodemailer.createTransport({
        host  : 'stmp.google.com',
        port : 465,
        secure : true,
        auth : {
            user : process.env.UserEmail,
            pass : process.env.UserPassword
        }
    })
    let mailOptions = {
        from : '"Manthan 2018" ',
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
    transporter
        .sendMail(mailOptions,(err,info)=>{
            if (err) return console.log(err)
            console.log('mail sent to '+user.email,info.messageId, info.response)
            console.log(info)
            callback(err)
        })
}