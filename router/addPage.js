const express = require('express');
const router = express.Router();
const {join} = require('path');
const Article = require(join(__dirname, '..', 'modal', 'articleModal.js'));



router.get('/', (req, res)=>{
    res.render('site/add');
});
router.post('/', async(req, res)=>{
    try {
        //VARIABLES
        const {content, title, year, committee, course} = req.body;

        const article = new Article({
            'author' : req.session.userID,
            'content' : content,
            'title' : title,
            'year' : year,
            'committee' : committee,
            'course' : course
        });

        //CONTROLS
        if (!req.session.userID) {
            return res.json({
                case: false,
                message: 'Oturum açılmamış. Lütfen giriş yapın.'
            });
        }
        console.log(content, title, year, committee, course);
        if (!content || !title || !year || !committee || !course) {
            return res.json({
                case: false,
                message: 'Lütfen tüm alanları doldurunuz.'
            });
        }

        //SAVE THE ARTICLE IN DATABASE
        await article.save();
        
        //AND REDIRECT TO MAIN PAGE
        return res.json({
            case: true,
            message: 'İçerik başarıyla kaydedildi.'
        });
        console.log('Veritabanına Kayıt Başarılı')

        


    } catch (error) {
        console.log(error);
        return res.json({
            case: false,
            message: 'beklenilmeyen bir hata oluştu!'
        });
    }
})



module.exports = router