// This program will allow a user to post a 'secret' anonymously, as long as they can be authenticated.
// This is level 3 of the encryption/decryption method.  It will encrypt/decrypt the password using a long string, BUT if someone can
// hack into our website and gain access to our app.js, they can identify the 'secret' encryption string and decrypt the user password.
// The workaround is to store our encryption string in a '.env' file and include it in our template version of the .getignore file

// sign up for a Robo 3T account and download the program
// Robo 3T is a MongoDB GUI that will act as our database
// create a new connection and leave it defaulted to localhost: 27017
// the 'userDB' database should be listed within the connection list

// on the first terminal:
// go to the folder within hyper/command prompt (cd "C:\Users\ssikh\OneDrive\Documents\Udemy\The Complete 2022 Web Development Bootcamp\Web Development\Secrets - Starting Code")
// 'npm init' to create a 'package.json' file
// 'npm install express' to install express
// 'npm install body-parser' to install a package that will pass the information we get from the post request;
// 'npm install ejs' to install EJS
// 'npm i mongoose' to install mongoose
// 'npm i mongoose-encryption' to install mongoose encryption
// 'npm i dotenv' to install an environment varaible, so a file can be created to store sensitive information like encryption/api keys
    // create a new folder called '.env'

// on the second terminal:
// go to the folder within hyper/command prompt (cd "C:\Users\ssikh\OneDrive\Documents\Udemy\The Complete 2022 Web Development Bootcamp\Web Development\Secrets - Starting Code")
// use 'mongod' to check for errors; if it does not finish use CTRL+C to end it;
// use 'mongo' to run the Database
// use 'show dbs' to see what databases are available
// use 'show collection' to see what collections are available
// use 'use usersDB' to switch/use the database
// use 'db.users.find()' or 'db.people.find()' to show the documents in the database

// use 'node app.js' to run the app.js file; you view the results within your web browser by going to 'localhost:3000'
require('dotenv').config();  // requires dotenv for our environment variable; always need to be on the top
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose'); // requires mongoose for a user database
const encrypt = require('mongoose-encryption'); // requires mongoose encryption
const app = express();

// if we want to get the environment variables
// console.log(process.env.API_KEY);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});


// creates a new schema/blueprint/structure we want to save within our database whenever a new record is added to the input field
// includes 'new Mongoose.schema' to create a new object from the mongoose schema class instead of just a simple javascript object
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

// installs an additional plugin to encrypt our database by using a long string within the '.env' file
// automatically encrypts when you call save and decrypt when you call find
// if you want to encrypt the entire database (including the email), not what we want to do with this program, but you can use 'userSchema.plugin(encrypt, {secret:secret});'
// encrypt only the password
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

// use the schema to create a mongoose model
// the first parameter is the name of the collection to comply with the schema; should be singular because mongoose can dynamically update it to plural
// the second parameter is the structure the first parameter has to comply by
const User = mongoose.model("User", userSchema);


app.get('/', (req, res) => {
  res.render("home");
});

app.get('/login', (req, res) => {
  res.render("login");
});

app.get('/register', (req, res) => {
  res.render("register");
});

// when a user registers (providing an email and password), they will be redirected to the secrets page to view a secret
app.post('/register', (req, res) => {
  // creates a new User using the email and password within the 'register.ejs' file
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render('secrets');
    }
  });
});

// when a user tries to log-in, locate the username within the database; if found, confirm if the password is the same and redirect to the secrets page
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username}, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
                res.render('secrets');
        }
      }
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
