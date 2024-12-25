const express = require("express");
const { engine }= require("express-handlebars");
const expressSession = require("express-session");
const expressFileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const path = require("path");
const fileUpload = require("express-fileupload");
const dbs = require(path.join(__dirname, "dbs.js"));
const crypto = require('crypto');


// DB connect
dbs();


// Starter settings
dotenv.config();
const app = express();


// Variables
const time = 1000 * 60 * 30; // 30 minute
const SECRET_VALUE = process.env.SECRET_VALUE || 'tipnot';
const PORT = process.env.PORT || "10000";
const API_URL = process.env.API_URL || 'http://127.0.0.1:10000'



// View engine setting
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


// Middleware
app.use(express.json());
app.use(fileUpload());
app.use(expressSession({
    secret: SECRET_VALUE,
    resave: false,
    saveUninitialized: true,
    cookie: {path:'/', httpOnly: true, secure: false, maxAge: time}
}));
app.use(express.static(path.join(__dirname, 'public')));


// Describing router
const indexPage = require(path.join(__dirname, 'router', 'indexPage.js'));
const aboutPage = require(path.join(__dirname, 'router', 'aboutPage.js'));
const loginPage = require(path.join(__dirname, 'router', 'loginPage.js'));
const registerPage = require(path.join(__dirname, 'router', 'registerPage.js'));
const articleListPage = require(path.join(__dirname, 'router', 'articleListPage.js'));
const articlePage = require(path.join(__dirname, 'router', 'articlePage.js'));
const logoutPage = require(path.join(__dirname, 'router', 'logoutPage.js'));
const addPage = require(path.join(__dirname, 'router', 'addPage.js'));
const m1Page = require(path.join(__dirname, 'router', 'm1Page.js'));

app.use('/', (req, res, next)=>{
    console.log
    const {userID} = req.session;
    if (userID) {
        res.locals.user = true
    } 
    else{
        res.locals.user = false
    }
    next()
});

// Using router
app.use('/', indexPage);
app.use('/index', indexPage);
app.use('/about', aboutPage);
app.use('/login', loginPage);
app.use('/register', registerPage)
app.use('/logout', logoutPage);
app.use('/articleListPage', articleListPage);
app.use('/article', articlePage);
app.use('/add', addPage);
app.use('/m1', m1Page);
//app.use('/article', articlePage);
app.use('*', (req , res)=>{res.render('site/error')});



// Listening
app.listen(PORT, ()=> {
    console.log(`Server is running, ${API_URL}`);
});