// routes/index.js

var express = require('express');
var router = express.Router();

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb+srv://skim:0909@skimsns.gwgni.mongodb.net/skimSNS?retryWrites=true&w=majority')

var Schema = mongoose.Schema;

var Post = new Schema({
  author: String,
  picture: String,
  contents: String,
  date: Date,
  like: Number,
  comments: Array
});

var postModel = mongoose.model('post', Post);

var check_user = function(req) {
  var answer;

  if (req.session.passport === undefined|| req.session.passport.user === undefined) { // 비로그인 유저
    console.log('로그인이 필요함');
    return (false);
  } else {
    return (true);
  }
};

router.use(passport.initialize());
router.use(passport.session());

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user) {
    var name = req.user.displayName;
    var picture = req.user.photos[0].value;
    res.render('index', { title: 'Express' });
  } else {
    res.render('index', { name: '비로그인 유저', picture: '/images/user.png' });
  }
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/load', function(req, res, next) {
  postModel.find({}, function(err, data) {
    res.json(data);
  });
});

router.get('/write', function(req, res, next) {
  var author = req.body.author;
  var picture = req.body.picture;
  var contents = req.body.contents;
  var date = Date.now();
  var post = new postModel();

  post.author = author;
  post.picture = picture;
  post.contents = contents;
  post.date = date;
  post.like = 0;
  post.comments = [];
  post.save(function(err) {
    if (err) {
      throw err;
    } else {
      res.json({status: "SUCCESS"});
    }
  });
});

router.get('/like', function(req, res, next) {
  var _id = req.body._id;
  var contents = req.body.contents;
  postModel.findOne({_id: _id}, function(err, data) {
    if (err) {
      throw err;
    } else {
      post.like++;

      post.save(function(err) {
        if (err) {
          throw err;
        } else {
          res.json({status: "SUCCESS"});
        }
      });
    }
  });
});

router.get('/del', function(req, res, next) {
  var _id = req.body._id;

	if(check_user(req)){
	   postModel.deleteOne({_id: _id}, function(err, result) {
			if(err){
				throw err;
			}
			else{
				res.json({status: "SUCCESS"});
			}
		});
	}
});

router.get('/modify', function(req, res, next) {
  var _id = req.body._id;
	var contents = req.body.contents;

	if(check_user(req)){
		postModel.findOne({_id: _id}, function(err, post) {
			if(err){
				throw err;
			}
			else{
				post.contents = contents;
				post.save(function(err) {
					if(err){
						throw err;
					}
					else{
						res.json({status: "SUCCESS"});
					}
				});
			}
		});
	}
});

router.get('/comment', function(req, res, next) {
  var _id = req.body._id;
	var author = req.body.author;
	var comment = req.body.comment;
	var date = Date.now();

	postModel.findOne({_id: _id}, function(err, post) {
		if(err){
			throw err;
		}
		else{
			post.comments.push({author: author, comment: comment, date: date});
			post.save(function(err) {
				if(err){
					throw err;
				}
				else{
					res.json({status: "SUCCESS"});
				}
			});
		}
	});
});


module.exports = router;
