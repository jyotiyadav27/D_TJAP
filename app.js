
//jshint esversion:6

const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const mysql = require('mysql2');
const port = 3000;
const ipAddr = '127.0.0.1';
const path = require('path');

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/public")));

app.set('view engine', 'ejs');

app.use(sessions({
    secret: "thisismysecrctekey",
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
    resave: false
}));

app.use(cookieParser());

const con = mysql.createConnection({
    user:'root',
    password:'123456',
    database: 'login',
    host:'127.0.0.1'
});


app.get("/", function(req, res){
    res.render("home");
})

app.get("/register", function(req, res){
    res.render("register");
})

app.get("/login", function(req, res){
    res.render("login");
})

app.post("/register",function(req, res){
    let email = req.body.email;
    let pass = req.body.pass;

    con.connect(function(err) {
        if (err){
            console.log(err);
        };
    // checking user already registered or no
    con.query(`SELECT * FROM accounts WHERE email = '${email}'`, function(err, result){
        if(err){
            console.log(err);
        };
        if(Object.keys(result).length > 0){
            res.render('failRegister');
        }else{
        //creating user page in userPage function
        // function userPage(){
        //     // We create a session for the dashboard (user page) page and save the user data to this session:
        //     req.session.user = {
        //         email: email,
        //         pass: pass
        //     };

        //     res.render('adminPanel');
        // }
            // inserting new user data
            var sql = `INSERT INTO accounts (email, pass) VALUES ('${email}', '${pass}')`;
            con.query(sql, function (err, result) {
                if (err){
                    console.log(err);
                }
                // else{
                //     // using userPage function for creating user page
                //     userPage();
                // };
            });

        }

    });
});

});

app.post("/login", (req, res)=>{
    var email = req.body.email;
    var pass = req.body.pass;

    con.connect(function(err) {
        if(err){
            console.log(err);
        };
//get user data from MySQL database
        con.query(`SELECT * FROM accounts WHERE email = '${email}' AND pass = '${pass}'`, function (err, result) {
          if(err){
            console.log(err);
          };
// creating userPage function to create user page
          function userPage(){
            // We create a session for the dashboard (user page) page and save the user data to this session:
            req.session.user = {
                email: email,
                pass: pass
            };

            res.render('adminPanel', {email:email});
        }

        if(Object.keys(result).length > 0){
            userPage();
        }else{
            res.render('failLogin');
        }

        });
    });
});

app.listen(3000, ipAddr, function(){
    console.log('Server Started');
})



