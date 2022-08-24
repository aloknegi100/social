const express = require('express')
const app = express();
const port = 8000;
const cookieParser=require('cookie-parser');
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');


app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name:'codeial',
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:1000*60*100
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', require('./routes/index'));


app.listen(port, (err) => {
    if (err) {
        console.log(`error in running the server: ${err} `)
        return;
    }
    console.log(`port running successfully on port : ${port}`);
})
