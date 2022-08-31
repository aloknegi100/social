const Comment=require('../models/comment');
const Post=require('../models/post');

module.exports.create=function(req,res){
    Post.findById(req.body.post,function(err,post){
        if(err)
        {
            console.log('error in findind post id for comment');
            return;
        }
        if(post){
            Comment.create({
                content:req.body.content,
                user:req.user._id,
                post:req.body.post
            },function(err,comment){
                post.comments.push(comment);
                post.save();
                res.redirect('/');
            })

        }
        

    })
    
}