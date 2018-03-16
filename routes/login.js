require('dotenv').config()
const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    checkAuth = (r, s, n) => {
        if (!r.user) n()
        else s.redirect('/profile')
    }

router.get('/', passport.authenticate('google', { scope: ['profile'] }))

router.get('/auth/success', passport.authenticate('google'), (r, s) => {
    s.redirect('/profile')
})


module.exports = router