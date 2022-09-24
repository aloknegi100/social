
{
    let createPost=function(){
        let newPostForm=$('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                url:'/posts/create',
                type:'post',
                data:newPostForm.serialize(),
                success: function(data){
                    let newPost=newPostDom(data.data.post);
                    createComment(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    notification("Post created!");
                    deletePost($(' .delete-post-button',newPost));
                    

                },
                error:function(error){
                    console.log(error.resposeText);
                }
            })
        }); 
    }

    let createComment=function(post){
      let newCommentForm=$(`#new-comment-form-${post._id}`);
      console.log("sdbnbs");
      newCommentForm.submit(function(e){
        e.preventDefault();
          $.ajax({
              url:'/comments/create',
              type:'post',
              data:newCommentForm.serialize(),
              success: function(data){
                console.log(data);

                  

              },
              error:function(error){
                  console.log(error.resposeText);
              }
          })
      }); 
  }

    let newPostDom=function(post){
        return $(`<li id="post-${post._id}">
        <p>
          
          <small>
            <a href="/posts/destroy/${post._id}" class="delete-post-button">X </a>
          </small>
          ${post.content}
          <br />
          <small> ${post.user.name}</small>
        </p>
        <div id="post-comments">
         
        <form action="/comments/create" method="post">
            <input 
              type="text"
              name="content"
              placeholder="Type here to add comment..."
              required
            />
            <input type="hidden" name="post" value="${post._id}" />
            <input type="submit" value="Add Comment" />
          </form>

          <div class="post-comments-list">
            <ul id="post-comments-${post._id}">
              
            </ul>
          </div>
        </div>
      </li>
      `)

    }
        

    let deletePost=function(deleteLink){
      $(deleteLink).click(function(e){
        e.preventDefault();
        $.ajax({
          url:$(deleteLink).prop('href'),
          method:'get',
          success:function(data){
            $(`#post-${data.data.post_id}`).remove();
            notification("Post deleted!");

          },
          error:function(error){
            console.log(error.responseText);
          }

        })

      })
    }

    let notification=function(data){
        new Noty({
          theme:'relax',
          text:data,
          type:'success',
          layout:'topRight',
          timeout:1500
        }).show()

    }

    let deleteAll=function(){
      $('#posts-list-container>ul>li').each(function(){
        let self=$(this);
        let deleteButton=$(' .delete-post-button',self);
        deletePost(deleteButton);
        let postId=self.prop('id').split('-')[1];
        
        

      })

    }

  

    createPost();
    deleteAll();
}