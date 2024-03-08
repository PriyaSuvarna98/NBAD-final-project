const User = require('../models/user');

//callback function for landing page
exports.index = (req, res, next) => {
    let user = req.session.user;
    User.findById(user)
    .then(user=>{
        res.render('index', {user});
    })
    .catch(err=>next(err));    
};

//callback function for about page
exports.about = (req, res) => {
    let user = req.session.user;
    User.findById(user)
    .then(user=>{
        res.render('about', {user});
    })
    .catch(err=>next(err));   
};

//callback function for contact page
exports.contact = (req, res) => {
    let user = req.session.user;
    User.findById(user)
    .then(user=>{
        res.render('contact', {user});
    })
    .catch(err=>next(err));     
};

