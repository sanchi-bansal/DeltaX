const mongoose= require ('mongoose');
mongoose.connect('mongodb://localhost:27017/delta',{useNewUrlParser:true},(err)=>{
    if(!err){console.log("Mongo db Connection Success!")}
    else{console.log("Opps! Error in DB Connection :"+err)}
});

require('./movie.model');
require('./cast.model');
