const express = require('express');
const router = express.Router()


router.get('/', (req, res)=>{
    res.render('site/about');
});



module.exports = router