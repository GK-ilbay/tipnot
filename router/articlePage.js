const express = require('express');
const router = express.Router();
const Article = require('../modal/articleModal');


router.get('/', async(req, res)=>{

    console.log("fdsfsdfsdf");
    try {
        console.log("dfsdfsdfd");
        const {id} = req.query;

        const article = await Article.findById(id).lean();

        console.log(article);

        res.render('site/article', {article});

    } catch (err) {
        res.render('site/article', {
            title: 'Hata!',
            content: 'Beklenilmeyen bir hata oluştu.'
        });
        return res.json({
            case: false,
            message: 'Beklenilmeyen bir hata oluştu!'
        });
    }
});

module.exports = router