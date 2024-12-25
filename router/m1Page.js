const express = require('express');
const router = express.Router()


router.get('/', (req, res)=>{
    res.render('site/m1');
});



module.exports = router