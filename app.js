const express = require('express');
const mongoose =  require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const expressHB = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const methodOverride = require('method-override');
const { formatDate, truncate, stripTags, editIC, select } = require('./helpers/hbs');
const mongoStore = require('connect-mongo')(session);

const connectDB = require('./config/db');
dotenv.config({ path: './config/config.env' });// Config file path
require('./config/passport')(passport);

connectDB();
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) { // Method Override
    // look in urlencoded POST bodies and delete it
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev')); // Log
app.engine('.hbs', expressHB({ helpers: {formatDate, truncate, stripTags, editIC, select}, defaultLayout: 'main', extname: '.hbs' })); // HandleBar
app.use(session({
     secret: 'keyboard cat',
     resave: false,
     saveUninitialized: false,
     store: new mongoStore({ mongooseConnection: mongoose.connection })
   }))
app.use(passport.initialize()); // Passport middleware
app.use(passport.session()); // Passport middleware
app.use(function (req, res, next){ // Setting global variable here, to allow hbs template have access to this variable
  res.locals.user = req.user || null;
  next();
})
app.set('view engine', '.hbs'); // set view engine
app.use(express.static(path.join(__dirname, 'public'))); // Static folder
app.use('/', require('./routes/index'));// Route
app.use('/auth', require('./routes/auth'));// Auth Route
app.use('/diaries', require('./routes/diaries'));// Diary page Route
app.use('/news', require('./routes/news'));// News page Route
const PORT = process.env.PORT || 5000; // PORT
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));