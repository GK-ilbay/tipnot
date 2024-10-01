const express = require('express');
const router = express.Router();
const {join} = require('path');
const User = require(join(__dirname, '..', 'modal', 'userModal.js'));

router.get('/', (req, res)=>{
    if (res.locals.user) {
        return res.redirect('/error')
    }
    console.log('register sayfasına giriş yapıldı');
    return res.render('site/register');
});
router.post('/', async(req, res)=>{
    try{
        // VARIABLES
        const {email, username, password} = req.body;

        const gmailRGX = new RegExp(/@gmail.com/, 'g');
        const textspaceRGX = new RegExp(/ /, 'g');

        const userControl = await User.find({'email': email}).exec();

        const user = new User({'email':email, 'username':username, 'password':password});

        // CONTROLS
        if (!req.body) {
            return res.json({
                case: false, 
                message: 'veri iletilemedi! body yok'
            });
        };
        if (!email || !username || !password) {
            return res.json({
                case: false,
                message: 'veri iletilemedi! veri eksik'
            });
        };
        if (!gmailRGX.test(email)) {
            return res.json({
                case: false,
                message: 'gmail alanını hatalı girildi!'
            })
        }
        if (username.length < 3 || username.length > 19 || textspaceRGX.test(username)) {
            return res.json({
                case: false,
                message: 'kullanıcı adı 2-20 karakter uzunluğunda ve boşluk içermemelidir!'
            })
        }
        if (password.length < 8 || password.length > 29 || textspaceRGX.test(password)) {
            return res.json({
                case: false,
                message: 'şifre 7-20 karakter uzunluğunda ve boşluk içermemelidir!'
            })
        }
        if (userControl.length !== 0) {
            return res.json({
                case: false,
                message: 'bu email kullanılıyor.'
            })
        }

        // SAVE USER TO DATABASE
        // AND LOGIN THE USER
        user.save().then((data)=>{
            let ID = data._id
            ID = String(ID)
            req.session.userID = ID
            console.log('userID : ' + req.session.userID)
            return res.json({
                case: true,
                message: 'Kullanıcı adı ve kaydı başarılı bir şerkilde tamamlandı.'
            })
        }).catch((err)=>{
            return res.json({
                case: false,
                message: 'bir sorun oluştu!'
            })
        })

    } catch(error){
        console.log(error);
        return res.json({
            case: false,
            message: 'beklenilmeyen bir hata oluştu!'
        });
    };
    
})
module.exports = router