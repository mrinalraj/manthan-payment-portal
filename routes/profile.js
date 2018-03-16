const router = require('express').Router()

router.get('/', (r, s) => {
    s.send('hello '+r.user.username)
})

module.exports = router