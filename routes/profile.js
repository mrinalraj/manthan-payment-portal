const router = require('express').Router(),
    AuthCheck = (r, s, n) => {
        if (!r.user) {
            s.redirect('/')
        } //not logged
        else {
            n()
        } //logged
    },
    CheckFirstTime = (r, s, n) => {
        if (r.user.basicInfo == true) {
            n()
        } else {
            s.redirect('/profile/welcome')
        }
    },
    CheckPayment = (r, s, n) => {
        if (r.user.payment) {
            s.redirect('/profile')
        } else {
            n()
        }
    },
    User = require('../models/user-model'),
    InstaMojo = require('instamojo-nodejs'),
    Qr = require('qr-image'),
    imgUri = require('image-data-uri')

router.get('/', AuthCheck, CheckFirstTime, (r, s) => {

    qr = r.user.payment ? imgUri.encode(Qr.imageSync(r.user.id, 'PNG'), 'PNG') : null;

    s.render('profile', {
        user: r.user,
        payment: r.user.payment ? 'Successful' : 'Pending',
        qr: qr,
        accomodation: r.user.accomodation ? "Yes" : "No"
    })
})

router.get('/welcome', AuthCheck, (r, s) => {
    s.render('welcome', {
        name: r.user.username,
        img: r.user.profileImage
    })
})

router.post('/welcome', AuthCheck, (r, s) => {
    if (!r.body) return s.send('invalid request')
    let newData = {
        basicInfo: true,
        college: r.body.othername ? r.body.othername : r.body.college,
        city: r.body.city,
        branch: r.body.branch,
        year: r.body.year,
        mobile: r.body.mobile,
        accomodation: (r.body.accomodation) ? true : false,
        events: r.body.events
    }

    User.findOneAndUpdate({
        'username': r.user.username
    }, newData, (err, doc) => {
        if (err) return s.send('error occured')
        let events = newData.events
        if (events.includes("Kurukshetra", 0)) return s.redirect('/profile/kuru-info')
        else return s.redirect('/profile/payment')
    })
})

router.get('/kuru-info', AuthCheck, CheckFirstTime, (r, s) => {
    s.render('kuruInfo', {
        user: r.user,
        number: [2, 3, 4, 5]
    })
})

router.post('/kuru-info', AuthCheck, CheckFirstTime, (r, s) => {
    if (r.body) {
        let newData = {
            kuruInfo: {
                teamLeader: r.user.username,
                teamName: r.body.teamname,
                game: r.body.gamename,
                members: r.body.memname,
                mobile: r.body.mob
            }
        }
        User.findOneAndUpdate({
            username: r.user.username
        }, newData, (err, doc) => {
            if (err) return s.send('error occured')
            s.redirect('/profile/payment')
        })
    } else {
        s.redirect('/profile/payment')
    }

})

router.get('/pay-now', AuthCheck, CheckPayment, (r, s) => {
    let data = new InstaMojo.PaymentData()
    data.purpose = "Manthan 18 Ticket"
    data.currency = "INR"
    data.buyer_name = r.user.username
    data.email = r.user.email
    data.phone = r.user.mobile
    data.allow_repeated_payment = 'False'
    let amount = ((r.user.college === "College of engineering roorkee") ? 100 : ((r.user.accomodation) ? 600 : 500)) + 3
    data.amount = Math.ceil(amount + (0.02 * amount)) + 0.5

    //data.webhook = 'http://' + r.get('host') + '/payment/success'
    data.redirect_url = 'http://' + r.get('host') + '/profile/payment/success'

    InstaMojo.createPayment(data, (err, res) => {
        if (err) return s.send(err)
        let response = JSON.parse(res)
        console.log(response)
        s.redirect(response.payment_request.longurl)
    })

})

router.get('/payment', AuthCheck, CheckPayment, (r, s) => {
    let amount = ((r.user.college === "College of engineering roorkee") ? 100 : ((r.user.accomodation) ? 600 : 500)) + 3,
        finalAmount = (amount + (0.02 * amount)) + 0.5
    s.render('payment', {
        user: r.user,
        amount: amount,
        handeling: (finalAmount - amount).toFixed(2),
        total: finalAmount
    })
})

router.get('/payment/success', AuthCheck, (r, s) => {

    if (Object.keys(r.query).length && r.query['payment_id']) {
        let newData = {
            payment: true,
            paymentId: r.query['payment_id'],
            paymentReq: r.query['payment_request_id'],
            qr: imgUri.encode(Qr.imageSync(r.user.id, 'PNG'), 'PNG')
        }

        User.findOneAndUpdate({
            username: r.user.username
        }, newData, (err, doc) => {
            if (err) return s.send('<h1>Error completing payment,<br>please contact +917619734988</h1>')
            require('../mailer').sendMail(r.user, err => {
                if (err) return console.log(err)
                s.render('payment-success', {
                    paymentId: newData.paymentId,
                    paymentReq: newData.paymentReq
                })
            })

        })

    } else s.send(
        '<title>Bad request </title>' +
        '<h1>403<br>invalid request</h1>'
    )
})

router.get('/mail', (r, s) => {
    require('../mailer').sendMail(r.user, err => {
        if (err) return console.log(err)
        s.send('mail sent')
    })
})
module.exports = router