const express=require('express');
const router=express.Router();

const postController=require('../controllers/post_controller');

router.get('/',postController.post);

module.exports=router
