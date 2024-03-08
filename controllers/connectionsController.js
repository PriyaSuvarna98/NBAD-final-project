const { connection } = require('mongoose');
const model = require('../models/connectionsData');

//callback function to GET the connections page
exports.getConnections = (req, res, next) => {
    model.find()
    .then(connections => {
        let categories = [] 
        connections.forEach(connection => { 
            if(!categories.includes(connection.category)) { 
                categories.push(connection.category);
            }
        })
        res.render('./connections/connections', {connections, categories});
    })
    .catch(err => next(err)); 
    };


//callback function to GET the newConnections page
exports.getNewConnection = (req, res) => {
    res.render('./connections/newConnection');
};

//callback function to POST the newConnection 
exports.postNewConnection = (req, res, next) => {
    let connection = new model(req.body); //create a new connection document
    connection.hostedBy = req.session.user;
    connection.save() //insert the document into the database
    .then(connection => {
        req.flash('success', 'Reservation made successfully');
        res.redirect('/connections')})
    .catch(err=>{
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('/back');
            //err.status = 400;
        }
        next(err);
    });
    
};

//callback function to GET the connection details page
exports.getConnectionDetail = (req, res, next) => {
    let id = req.params.id;
    user = req.session.user;

    model.findById(id).populate('hostedBy', 'firstName lastName')
    .then(connection=> {
        if(connection) {
            res.render('./connections/connection', {connection, user});
        } else {
            let err = new Error('Cannot find connection with id ' +id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));

     
};

//callback function to GET the update connection page
exports.getEdit = (req, res, next) => {
    let id = req.params.id;

    model.findById(id)
    .then(connection=> {
        if(connection) {
            return res.render('./connections/edit', {connection});
        } else {
            let err = new Error('Cannot find connection with id ' +id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

//callback function to PUT the update connection
exports.updateConnection = (req, res, next) => {
    let connection = req.body;
    let id = req.params.id;

    model.findByIdAndUpdate(id, connection, {useFindAndModify: false, runValidators: true})
    .then(connection=>{
        if(connection) {
            req.flash('success', 'Reservation has been updated successfully');
            return res.redirect('/connections/' +id);
        } else {
            let err = new Error('Cannot find connection with id ' +id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=> {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('/back');
        }
        next(err);
    });
};

//callback function to DELETE the connection
exports.deleteConnection = (req, res, next) => {
    let id = req.params.id;

    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(connection => {
        if(connection) {
            res.redirect('/connections');
        } else {
            let err = new Error('Cannot find connection with id ' +id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

