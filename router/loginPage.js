const express = require('express');
const router = express.Router()
const {join} = require('path');
const User = require(join(__dirname, '..', 'modal', 'userModal.js'));



router.get('/', (req, res)=>{
    if (res.locals.user) {
        return res.redirect('/error')
    }
    return res.render('site/login');
});
router.post('/', async(req, res)=>{
    try {
        //VARIABLES
        let {username, password} = req.body

        const userControl = await User.find({'username': username, 'password' : password }).exec()

        //CONTROLS
        if (res.locals.user) {
            return res.json({
                case: false,
                message: 'Kullanıcının oturumu zaten açık.'
            })
        }
        if (userControl.length !== 1) {
            return res.json({
                case: false,
                message: 'Kullanıcı adı veya şifre hatalıdır!'
            })
        }

        // LOGİN THE USER
        let ID = userControl[0]._id;
        ID = String(ID)
        req.session.userID = ID

        return res.json({
            case: true,
            message: 'Girişiniz başarılı...'
        })


    } catch (error) {
        console.log(error)
        return res.json({
            case: false,
            message: 'Beklenmeyen bir hata oluştu.'
        })
    }
})


module.exports = router