const express = require('express');
//const {user} = require('mongoose');
const model = require('../models/user');
const connection = require('../models/connectionsData');

const router = express.Router();

// GET /users/new: get Sign Up form 
router.get('/new', (req, res) => {
    res.render('./user/new');
})

//POST /users/new: save the sign up details in DB
router.post('/', (req, res, next)=> {
    let user = new model(req.body);
    user.save()
    .then(user=> {
        req.flash('success','Successfully registered!')
        res.redirect('/users/login');
    })
    .catch(err=> {
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('back');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('back');
        }
        next(err);
    });
});

//GET /users/login: get the login page
router.get('/login', (req, res) => {
    res.render('./user/login');
});

//POST /users/login: validate the email id and password, once authenticated redirect to Profile page
router.post('/login', (req, res, next)=> {
    let email = req.body.email;
    let password = req.body.password;

    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            req.flash('error', 'Wrong email address');  
            res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
            } else {
                req.flash('error', 'Wrong password');      
                res.redirect('/users/login');
            }
            });     
        }     
    })
    .catch(err=> next(err));
});

//GET users/profile: get the profile page of the user
router.get('/profile', (req, res, next)=>{
    let id = req.session.user;
    console.log(id);
    Promise.all([model.findById(id), connection.find({hostedBy: id})])
    .then(results=>{
        const [user, connections] = results;
        res.render('./user/profile', {user, connections});
    })
    .catch(err=>next(err));
});

//GET users/logout: logout a user
router.get('/logout', (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 });

module.exports = router;