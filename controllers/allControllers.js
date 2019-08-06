const express = require('express');
var router  = express.Router();
var assert = require('assert');

const mongoose = require("mongoose");
const MOVIE = mongoose.model("movie");
const CAST = mongoose.model("cast");

const multer = require('multer');
var upload = multer({ dest: 'uploads/' }) 

router.get('/movie/listmovie',(req,res)=>{
    MOVIE.find((err, docs) => {
        if (!err) {
            res.render("/movie/listMovie", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving Movie list :' + err);
        }
    });
});

router.get('/castOperation',(req,res)=>{
    res.render("cast/castOperation",{
        viewTitle : "Add Actor's!"
    });
});
router.post('/movieOperation',upload.single('poster'),(req,res,next)=>{
    
    if (req.body._id == '')
        insertMovie(req, res);
        else
        updateMovie(req, res);
   
});
router.post('/castOperation',upload.single('poster'),(req,res)=>{

    if (req.body._id == '')
        insertCast(req, res);
        else
        updateCast(req, res);
});

function insertMovie(req,res){
    var movie = new MOVIE();
    
    movie.movieName = req.body.movieName;
    movie.yearOfRelease = req.body.yearOfRelease;
    movie.plot = req.body.plot;
    movie.cast = req.body.actor;
    movie.poster=  req.file.path;

    
    movie.save((err,doc)=>{
    if(!err && req.file){
    movie.poster=  req.file.path;
    res.redirect('/deltax/listMovie');
    }
    else{
        if(err.name== "ValidationError" || !req.file ){
            handleValidationError(err,req.body);
            res.render("movie/movieOperation",{
                viewTitle : "Insert Movie",
                movie : req.body
            });
        }
        console.log("Opps! Error during inserting that movie!"+err);
    }});
}
function updateMovie(req, res) {
    MOVIE.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('movie/listMovie'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("movie/movieOperation", {
                    viewTitle: 'Update Cast',
                    movie: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}
function insertCast(req,res){
    console.log("Starting Insert Cast");
    var actor = new CAST();
    
    actor.actorName = req.body.actorName;
    actor.sex = req.body.sex;
    actor.dateOfBirth = req.body.dateOfBirth;
    actor.bio = req.body.bio;
    actor.poster=  req.file.path;

    actor.save((err,doc)=>{
    if(!err)
    res.redirect('/deltax/listCast');
    else{
        
        console.log("Opps! Error during inserting that actor!"+err);
    }});
}
function updateCast(req, res) {
    CAST.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
       
        if (!err) { res.redirect('/movie/actor/list');}
        else {
            if (err.name == 'ValidationError') {
                handleValidationErrorCast(err, req.body);
                res.render("cast/castOperation", {
                    viewTitle: 'Update Actor',
                    actordetails: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}
router.get('/listMovie',(req,res,next)=>{
    MOVIE.find((err, docs) => {
        if (!err) {
            res.render("movie/listMovie", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving Movie list :' + err);
        }
    });
});
router.get('/',(req,res,next)=>{
    MOVIE.find((err, docs) => {
        if (!err) {
            res.render("movie/listMovie", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving Movie list :' + err);
        }
    });
});
router.get('/listCast',(req,res)=>{
    CAST.find((err, docs) => {
        if (!err) {
            res.render("cast/listCast", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving Actor list :' + err);
        }
    });
});
router.get('/movieOperation',(req,res)=>{
    var resultArray = [];
    mongoose.connect('mongodb://localhost:27017/delta',{useNewUrlParser:true}, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('casts').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      res.render('movie/movieOperation', {items: resultArray, viewTitle : "Insert Movie or TV Show!"});
    });
  });
});

function handleValidationError(err,body){
    for(field in err.errors){
        switch(err.errors[field].path){
            case 'movieName':
                body['movieNameError']= err.errors[field].message;
                break;
            case 'yearOfRelease':
                body['yearOfReleaseError']= err.errors[field].message;
                break;
            case 'cast':
                body['castError']= err.errors[field].message;
                break;
            case 'plot':
                body['plotError']= err.errors[field].message;
                break;
            case 'poster':
                body['posterError']= err.errors[field].message;
                break;

            default:
                break;            
        }
    }
 }
function handleValidationErrorActor(err,body){
    for(field in err.errors){
        switch(err.errors[field].path){
            case 'actorName':
                body['actorNameError']= err.errors[field].message;
                break;
            case 'dateOfBirth':
                body['dateOfBirth']= err.errors[field].message;
                break;
            case 'cast':
                body['sex']= err.errors[field].message;
                break;
            case 'plot':
                body['bio']= err.errors[field].message;
                break;
            case 'poster':
                body['posterError']= err.errors[field].message;
                break;

            default:
                break;            
        }
    }
}

router.get('/movie/:id', (req, res) => {
    MOVIE.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("movie/movieOperation", {
                viewTitle: "Update Movie Details",
                movie: doc
            });
        }
    });
});

router.get('/cast/:id', (req, res) => {
    CAST.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("cast/castOperation", {
                viewTitle: "Update Actor Details",
                actor: doc
            });
        }
    });
});

module.exports=router;
