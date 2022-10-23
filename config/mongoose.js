const mongoose=require('mongoose');
const env=require('./environment')
// mongoose.connect(`mongodb://localhost/${env.db}`);//i have to change this
mongoose.connect(process.env.mongo_url ||`mongodb://localhost/${env.db}`)
const db=mongoose.connection;

db.on('error',console.error.bind(console,"Error connecting to database"));
db.once('open',function(){
    console.log("Connected to database :: Mongodb");
})
module.exports=db;