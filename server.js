var express = require('express');
var app = express();
var path = require("path")
var passport = require('passport')
var session = require('express-session')
var env = require('dotenv').config();
var models = require("./app/models");
var exphbs = require('express-handlebars')
app.use(express.urlencoded({
    extended: true
})
);
app.use(express.json());

// For Passport
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
})); // session secret

app.use(passport.initialize());

app.use(passport.session()); // persistent login sessions
//STYLING
app.use(express.static(path.join(__dirname, '/app/public')));

app.get('/', function (req, res) {
    res.send('Welcome to Passport with Sequelize');
});

//For Handlebars
app.set('views', './app/views');
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: false,
    layoutsDir: "views/layouts/"
}));
app.set('view engine', '.hbs');

require('./app/config/passport/passport.js')(passport, models.user);

//Sync Database
models.sequelize.sync()
    .then(function () {
        console.log('Nice! Database looks fine')
    }).catch(function (err) {
        console.log(err, "Something went wrong with the Database Update!")
});

//Routes
var authRoute = require('./app/routes/auth.js')(app,passport);

app.listen(5000, function (err) {
    if (!err)
        console.log("Site is live");
    else console.log(err)
});