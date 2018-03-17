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
        }
        else {
            s.redirect('/profile/welcome')
        }
    },
    User = require('../models/user-model'),
    InstaMojo = require('instamojo-nodejs')

router.get('/', AuthCheck, CheckFirstTime, (r, s) => {
    s.send(r.user.username + r.user.college)
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

    User.findOneAndUpdate({ 'username': r.user.username }, newData, (err, doc) => {
        if (err) return s.send('error occured')
        s.redirect('/profile/payment')
    })
})

router.get('/pay-now', AuthCheck, (r, s) => {
    let data = new InstaMojo.PaymentData()
    data.purpose = "Manthan 18 Ticket"
    data.currency = "INR"
    data.buyer_name = r.user.username
    data.phone = r.user.mobile
    data.allow_repeated_payment = 'False'
    data.amount = 108
    //data.webhook = 'http://' + r.get('host') + '/payment/success'
    data.redirect_url = 'http://'+r.get('host')+'/profile/payment/success'

    InstaMojo.createPayment(data, (err, res) => {
        if (err) return s.send(err)
        let response = JSON.parse(res)
        s.redirect(response.payment_request.longurl)
    })
})

router.get('/payment', (r, s) => {
    s.render('payment',{name:r.user.username})
})

router.get('/payment/success', AuthCheck, (r, s) => {
    let paymentId = r.query['payment_id'],
        paymentReq = r.query['payment_request_id']
        

    s.send('payment successful '+'payment id: '+paymentId+' payment req id: '+paymentReq)
})

module.exports = router