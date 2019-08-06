require('./models/db');

const express = require('express');

const path =require('path');

const exphbs = require ("express-handlebars");

const bosyparser = require("body-parser");


const allControllers = require('./controllers/allControllers');
var app = express();

app.use(bosyparser.urlencoded({
extended:true
}));

app.use(bosyparser.json());
app.use('/uploads', express.static('uploads'));

app.set('views',path.join(__dirname,'/views/'));
app.engine('hbs',exphbs({extname:"hbs",defaultLayout:'mainLay',layoutsDir:__dirname+'/views/layout'}));
app.set('view engine','hbs');

app.listen(3000,()=>{
    console.log("Express started at port 3000");
});

app.use('/deltax',allControllers);
