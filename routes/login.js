require('dotenv').config()
const router = require('express').Router(),
    passport = require('passport'),
    checkAuth = (r, s, n) => {
        if (!r.user) n()
        else s.redirect('/profile')
    }

router.get('/',(r,s)=>{
    s.render('login')
})

router.get('/login', checkAuth, passport.authenticate('google', { scope: ['profile'] }))

router.get('/auth/success', passport.authenticate('google'), (r, s) => {
    s.redirect('/profile')
})

router.get('/logout', (r, s) => {
    r.logout()
    s.redirect('/')
})


module.exports = router