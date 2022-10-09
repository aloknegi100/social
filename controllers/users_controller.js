const User=require('../models/user')
const fs=require('fs')
const path =require('path')
const crypto = require('crypto');
const queue = require('../config/kue');
const userEmailWorker = require('../workers/user_email_worker')



module.exports.profile=function(req,res){
    
    User.findById(req.params.id,function(err,user){
    return res.render('profile',{
        title:"Codeial | profile",
        profile_user:user  
         })
     })
}

module.exports.update=async function(req,res){
    // if(req.user.id==req.params.id)
    // {
    //     User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
    //         req.flash('success','Profile updated successfully!');
    //         return res.redirect('back');
    //     })
    // }
    // else
    // {
            // req.flash('error','Unauthorised!');
    //     return res.status(401).send('Unautorized');
    // }
    if(req.user.id==req.params.id)
    {
       try{
            let user=await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err)
                {
                    console.log('*****Multer error',err);
                }
                user.name=req.body.name;
                user.email=req.body.email;
                if(req.file)
                {
                    
                    if(user.avatar)
                    {
                        if (fs.existsSync(path.join(__dirname, "..", user.avatar))) {
							
							fs.unlinkSync(path.join(__dirname, "..", user.avatar));
						}
                        
                    }
                    user.avatar=User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');

            })

       }
       catch(err)
       {
            req.flash('error','err');
            console.log('Error',err);
       }
    }
    else
    {
        req.flash('error','Unauthorised!');
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
 
 module.exports.resetPassword = function(req, res)
 {
     return res.render('reset_password',
     {
         title: 'Codeial | Reset Password',
         access: false
     });
 }
 
 module.exports.resetPassMail = function(req, res)
 {
     User.findOne({email: req.body.email}, function(err, user)
     {
         if(err)
         {
             console.log('Error in finding user', err);
             return;
         }
         if(user)
         {
             if(user.isTokenValid == false)
             {
                 user.accessToken = crypto.randomBytes(30).toString('hex');
                 user.isTokenValid = true;
                 user.save();
             }
 
             let job = queue.create('user-emails', user).save(function(err)
             {
                 if(err)
                 {
                     console.log('Error in sending to the queue', err);
                     return;
                 }
                 // console.log('Job enqueued', job.id);
             });
 
             req.flash('success', 'Password reset link sent. Please check your mail');
             return res.redirect('/');
         }
         else
         {
             req.flash('error', 'User not found. Try again!');
             return res.redirect('back');
         }
     });
 }
 
 module.exports.setPassword = function(req, res)
 {
     User.findOne({accessToken: req.params.accessToken}, function(err, user)
     {
         if(err)
         {
             console.log('Error in finding user', err);
             return;
         }
         if(user.isTokenValid)
         {
             return res.render('reset_password',
             {
                 title: 'Codeial | Reset Password',
                 access: true,
                 accessToken: req.params.accessToken
             });
         }
         else
         {
             req.flash('error', 'Link expired');
             return res.redirect('/users/reset-password');
         }
     });
 }
 
 module.exports.updatePassword = function(req, res)
 {
     User.findOne({accessToken: req.params.accessToken}, function(err, user)
     {
         if(err)
         {
             console.log('Error in finding user', err);
             return;
         }
         if(user.isTokenValid)
         {
             if(req.body.newPass == req.body.confirmPass)
             {
                 user.password = req.body.newPass;
                 user.isTokenValid = false;
                 user.save();
                 req.flash('success', "Password updated. Login now!");
                 return res.redirect('/users/sign-in') 
             }
             else
             {
                 req.flash('error', "Passwords don't match");
                 return res.redirect('back');
             }
         }
         else
         {
             req.flash('error', 'Link expired');
             return res.redirect('/users/reset-password');
         }
     });
 }
