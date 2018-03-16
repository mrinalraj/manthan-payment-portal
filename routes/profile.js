const router = require('express').Router(),
    AuthCheck = (r, s, n) => {
        if(!r.user){
            s.redirect('/')
        } //not logged
        else{
            n()
        } //logged
    }

router.get('/', AuthCheck, (r, s) => {
    s.send('hello ' + r.user.username)
})

module.exports = router