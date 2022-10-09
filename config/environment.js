const development={
    name:'development',
    asset_path:'./assets',
    session_cookie_key:'blahsomething',
    db:'codeial_development',
    smtp:{
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
            user:'aloknegi100@gmail.com',
            pass:'ulxgvumtclazcfdj'
        }
    },
    google_client_id: '24861454230-mk2lk975sq7kt22hq31hjr4bd24ik5au.apps.googleusercontent.com',
    google_client_secret: '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',
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret:'codeial'
}



const production={
    name:'production'
}

module.exports=development;