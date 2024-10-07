const express = require('express');
const router = express.Router();
const Article = require('../modal/articleModal');

router.get('/', async (req, res)=>{

    const {year, committee, course} = req.query;

    try {
        const articles = await Article.find({
            'year': year,
            'committee': committee,
            'course': course
        })

        if (articles.length > 0) {
            res.render('site/articleListPage', { articles: articles.map(article => ({ ...article.toObject() })) });
        } else {
            return res.json({
                case: false,
                message: 'İlgili alanda hiç içerik bulunmuyor.'
            });
        }
    } catch (err) {
        return res.json({
            case: false,
            message: 'Bilinmeyen bir hata oluştu.'
        });
    }
})


module.exports = router