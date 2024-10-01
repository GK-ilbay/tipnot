const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    return res.render('site/topics')
})
router.post('/', async(req, res)=>{
    try {
        //VARIABLES
        const {year, committee, major} = req.body


        //CONTROLS


        //GETTING TITLES FROM DATABASE


        //RETURNING TOPICS PAGE

    } catch (error) {
        
    }
})


module.exports = router