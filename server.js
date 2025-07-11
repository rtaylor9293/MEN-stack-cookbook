const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const isSignedIn = require('./middleware/usersignin.js');
const passUserToView = require('./middleware/passuser.js');

const path = require('path');
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

const authController = require('./controller/auth.js');
const foodsController = require('./controller/foods.js');
const usersController = require('./controller/users.js');

const port = process.env.PORT ? process.env.PORT : 3500;

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.set('view-engine', 'ejs');
app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});


app.use(passUserToView);
app.use('/auth', authController);  
app.use(isSignedIn);
app.use('/users/:userId/foods', foodsController);
app.use(usersController);

app.listen(port, () => {
  console.log('sanity check');
});