const express=require('express')
const app=express();
const port=8000;
app.use('/',require('./routes/index'))

app.listen(port,(err)=>{
    if(err)
    {
        console.log(`error in running the server: ${err} `)
        return;
    }
    console.log(`port running successfully on port : ${port}`);
})
