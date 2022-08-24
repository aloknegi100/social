const User=require('../models/user')

module.exports.profile=function(req,res){
    if(req.cookies.user_id){
    User.findById(req.cookies.user_id,function(err,user)
    {
        if(user)
        {
            return res.render('profile.ejs',{
                title:"Codeial | profile",
                user:user
            });
        }
        return res.redirect('/users/sign-in');
    })   
}
else{
    return res.redirect('/users/sign-in');
}
        
}


module.exports.signUp=function(req,res){
    res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    })

}

module.exports.signIn=function(req,res){
    
    res.render('user_sign_in.ejs',{
        title:"Codeial | Sign In"
    })

}
module.exports.create=function(req,res){
    if(req.body.password!=req.body.confirm_password)
    {
        return res.redirect('back');
    }
    User.findOne({email:req.body.email},(err,user)=>{
        if(err)
        {
            console.log("error in signing up the user");
            return res.redirect('back');
        }
        if(!user)
        {
            User.create(req.body,(err,user)=>{
                if(err)
                {
                   console.log("error in creating the user for sign up"); 
                   return res.redirect('back');
                }
                return res.redirect('/users/sign-in');

            })
        }
        else{
            return res.redirect('back');
        }

    })
}


module.exports.createSession=function(req,res){
    User.findOne({email:req.body.email},function(err,user){
        if(err)
        {
            console.log("error in signing in the user");
            return ;
        }
        if(user)
        {
            if(user.password==req.body.password)
            {
                res.cookie('user_id',user.id);
                return res.redirect('/users/profile');
            }
            else
            {
            return res.redirect('back');
            }
        }
        else
        {
            return res.redirect('back');
        }
    })
}
