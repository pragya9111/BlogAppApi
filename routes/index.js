var express = require('express')
var router = express.Router()
var passport = require('passport')
const userModel = require('./users')
const blogModel = require('./blogs')
const localStrategy = require('passport-local')

passport.use(new localStrategy(userModel.authenticate()))


//Register user
router.post('/register', function (req, res) {
  var data = new userModel({
    name: req.body.name,
    username: req.body.username,
    contact: req.body.contact,
    gender: req.body.gender,
    email: req.body.email,
  })
  userModel.register(data, req.body.password)
    .then(function (user) {
      passport.authenticate('local')(req, res, function () {
        res.status(200).json({
          success: true,
          user
        })
      })
    })
    .catch(function (err) {
      res.send(err)
    })
});


//Login user route
router.get('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/'

}), function (req, res, next) { });


//Showing user profile,which shows the details of loggedin user and blogs created by that user
router.get('/profile', isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (user) {
      blogModel.find()
        .then(function (blogs) {
          res.status(200).json({
            success: true,
            user,blogs
          })
        })
    })
});


//Creating blog
router.post('/createblog', isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (user) {
      blogModel.create({
        title: req.body.title,
        blog: req.body.blog,
        username: user._id
      })
        .then(function (blogdata) {
          user.blog.push(blogdata)
          user.save()
            .then(function (blogdata) {
              res.status(200).json({
                success: true,
                user
              })
            })
        })
    })

});


//Show all blogs
router.get('/showallblogs', isLoggedIn, function (req, res) {
  blogModel.find()
    .then(function (alldata) {
      res.status(200).json({
        success: true,
        alldata
      })
    })
});
1
router.get('/like/:id', isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (user) {
      blogModel.findOne({ _id: req.params.id })
        .then(function (blog) {
          if (blog.likes.indexOf(user._id) == -1 && blog.dislikes.indexOf(user._id) == -1) {
            blog.likes.push(user._id);
          }
          else {
            blog.likes.splice(user._id, 1);
          }
          blog.save()
            .then(function (user) {
              res.status(200).json({
                success: true,
                blog
              })
            })
        })
    })
});


//Dislike the blog
router.get('/dislike/:id', isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (user) {
      blogModel.findOne({ _id: req.params.id })
        .then(function (blog) {
          if (blog.dislikes.indexOf(user._id) == -1 && blog.likes.indexOf(user._id) == -1) {
            blog.dislikes.push(user._id);
          }
          else {
            blog.dislikes.splice(user._id, 1);
          }
          blog.save()
            .then(function () {
              res.status(200).json({
                success: true,
                blog
              })
            })
        })
    })
});

//Saving the blog which we want to save
router.get('/saveblog/:id', isLoggedIn, function(req,res){
  userModel.findOne({ username: req.session.passport.user })
  .then(function(user){
    blogModel.findOne({_id:req.params.id})
    .then(function(blog){
      user.savedblog.push(user._id)
      user.save()
      .then(function(){
        res.status(200).json({
          success:true,
          message:"Blog Saved Successfully"
        })
      })
    })
  })
})

//Deleting the blog
router.delete('/delete/:id', function (req, res) {
  blogModel.findOneAndDelete({ _id: req.params.id })
    .then(function (deletedblog) {
      res.status(200).json({
        success: true,
        deletedblog
      })
    })
});


//Updating the blog
router.put('/update/:id', function (req, res) {
  var a = {
    title: req.body.title,
    blog: req.body.blog
  }
  blogModel.findOneAndUpdate({ _id: req.params.id }, a)
    .then(function (updatedBlog) {
      res.status(200).json({
        success: true,
        message: "Blog Updated"
      })
    })
});


//Logout user route
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  else {
    res.redirect('/')
  }
}

module.exports = router;
