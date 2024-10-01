const express = require('express');
const router = express.Router()


router.get('/', (req, res)=>{
    res.render('site/index');
    console.log('ana sayfaya giriş yapıldı.')
    console.log('userID : ' + req.session.userID)
});



module.exports = router