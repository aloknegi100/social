const Post=require('../models/post');
const User=require('../models/user');
module.exports.home=function(req,res){
    
    // Post.find({},(err,posts)=>{
    //     if(err)
    //     {
    //         console.log('error while passing posts to ejs file');
    //         return;
    //     }
    //     return res.render('home',{
    //         title:"Codial | home",
    //         posts:posts
    //     })  ;
    // })
    Post.find({})
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path:'user',
        }
    })
    .exec(
        (err,posts)=>{

            User.find({},function(err,users){
                return res.render('home',{
                    title:"Codial | home",
                    posts:posts,
                    all_users:users
                });
            })
            
        })
    
}