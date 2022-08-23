const express = require('express')
const app = express();
const port = 8000;
const expressLayouts=require('express-ejs-layouts');

app.use(express.static('./assets'));
app.use(expressLayouts);
app.use('/', require('./routes/index'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, (err) => {
    if (err) {
        console.log(`error in running the server: ${err} `)
        return;
    }
    console.log(`port running successfully on port : ${port}`);
})
