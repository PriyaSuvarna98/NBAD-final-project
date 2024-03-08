//require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const mainRoutes = require('./routes/mainRoute');
const connectionsRoute = require('./routes/connectionsRoute');
const userRoutes = require('./routes/userRoutes');
//const {MongoClient} = require('mongodb');

// create app
const app = express();

// configure app
const port = 8084;
const host = 'localhost';
const url = 'mongodb://localhost:27017/NBAD';
app.set('view engine', 'ejs');

//connect to Mongodb
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(()=> {
    //start the server
    app.listen(port, host, () => {
    console.log('The server is running on port ', port);
});
})
.catch(err=>console.log(err.message));

//mount middleware
app.use(
    session({
        secret: "keyboard",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/NBAD'}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

//setup routes
app.use('/', mainRoutes);

app.use('/connections', connectionsRoute);

app.use('/users', userRoutes);

//error handling
app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' +req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if(!err.status) {
        console.log(err.stack);
        err.status = 500;
        err.message = ("Internal Server Error");
    }
    res.status(err.status);
    res.render('error', {error: err});
});


