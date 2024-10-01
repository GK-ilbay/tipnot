const express = require('express')
const router = express.Router()


router.get('/', (req, res)=>{
    if(!res.locals.user){
        return res.redirect('/error')
    }

    req.session.destroy()
    return res.redirect('/')
});


module.exports = router