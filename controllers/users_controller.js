const User=require('../models/user')

module.exports.profile=function(req,res){
    
    User.findById(req.params.id,function(err,user){
    return res.render('profile',{
        title:"Codeial | profile",
        profile_user:user  
         })
     })
}

module.exports.update=function(req,res){
    if(req.user.id==req.params.id)
    {
        User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
            req.flash('success','Profile updated successfully!');
            return res.redirect('back');
        })
    }
    else
    {
        return res.status(401).send('Unautorized');
    }
}


module.exports.signUp=function(req,res){
    if(req.isAuthenticated())
    {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    })

}

module.exports.signIn=function(req,res){
    if(req.isAuthenticated())
    {
       return  res.redirect('/users/profile');
    }
    
    return res.render('user_sign_in.ejs',{
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
                req.flash('success','New Profile created successfully!');
                return res.redirect('/users/sign-in');

            })
        }
        else{
            return res.redirect('back');
        }

    })
}


module.exports.createSession=function(req,res){
    req.flash('success','Logged in Successfully');
   return res.redirect('/');
}

module.exports.destroySession=function(req,res){
    req.logout(function(err){

         req.flash('success','You have logged out!');
        return res.redirect('/');
    });
    
 }
