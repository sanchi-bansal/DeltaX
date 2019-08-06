const mongoose = require('mongoose');

var movieSchema = new mongoose.Schema({
    poster:{
        type:String,
        required:"Required!"
    },
    movieName:{
        type: String,
        required:"Required!"
    },
    yearOfRelease:{
        type: Number,
        required:"Required!",
        min: [1800, 'Year less than 1800'],
        max: [2023,'Year more than 2023']
    },
    plot:{
        type: String,
        required:"Required"
    },
    cast:{
        type: [String],
        required:"Required"
    }
   
});



mongoose.model('movie',movieSchema);
