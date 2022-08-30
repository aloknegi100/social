const Post=require('../models/post');
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
    Post.find({}).populate('user').exec(
        (err,posts)=>{
            if(err)
            {
                console.log('error while passing posts to ejs file');
                return;
            }
            return res.render('home',{
                title:"Codial | home",
                posts:posts
            });
        })
    
}