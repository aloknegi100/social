const express = require('express')
const env=require('./config/environment');
const logger=require('morgan');
const app = express();
require('./config/view-helpers')(app);

const port = process.env.PORT;
const cookieParser=require('cookie-parser');
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');

const MongoStore=require('connect-mongo');
const sassMiddleware=require('node-sass-middleware');
const flash=require('connect-flash');
const customMware=require('./config/middleware');

const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

const path=require('path');

if(env.name=="development")
{
    app.use(sassMiddleware({
        src:path.join(__dirname,env.asset_path,'scss'),
        dest:path.join(__dirname,env.asset_path,'css'),
        debug:true,
        outputStyle:'extended',
        prefix:'/css'
    }))

}

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(env.asset_path));
app.use('/uploads',express.static(__dirname +'/uploads'));

app.use(logger(env.morgan.mode,env.morgan.options))


app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', './views');
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


app.use(session({
    name:'codeial',
    secret:env.session_cookie_key,
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:1000*60*100
    },
    store: MongoStore.create(
        {
            // mongoUrl:'mongodb://localhost/codeial_development',//i have to change this
            
            mongoUrl:process.env.mongo_url || 'mongodb://localhost/codeial_development',
            autoRemove:'disabled',
            touchAfter: 24 * 3600
        },function(err){
            console.log(err||'connect mongodb setup ok')
        }
    )

}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);


app.use('/', require('./routes/index'));


app.listen(port, (err) => {
    if (err) {
        console.log(`error in running the server: ${err} `)
        return;
    }
    console.log(`port running successfully on port : ${port}`);
})
