const express = require('express');
const sn = require('servicenow-rest-api');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const session = require('express-session');
const reserve = require('./app_modules/reserver');
const homeController = require('./app_modules/init_home');

var app = express();

app.set('view engine','hbs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
hbs.registerPartials(__dirname + '/views/partials')

app.use(
  session({
    secret: "iy98hcbh489n38984y4h498", // don't put this into your code at production.  Try using saving it into environment variable or a config file.
    resave: true,
    saveUninitialized: false
  })
);

app.get('/login',(req,res)=>{
  if(req.session.user)
      res.render('index.hbs');
  else
      res.render('login.hbs');
});

app.post('/login',(req,resp)=>{
    const servicenow = new sn('dev64642',req.body.username,req.body.password);
    servicenow.Authenticate((res)=>{
      if(res.status===200){
        req.session.user = {
              username: req.body.username,
              password: req.body.password
        };

        req.session.user.expires = new Date(
            Date.now() + 3600 * 1000
        );
        homeController.goHome(req,resp);
      }
      else {
        resp.render('login.hbs',{
          errorMessage: 'Auth error. Check your username and your password'
        });
      }

    });
});

app.post('/reserve',(req,res) =>{
    reserve.check(req,res);
})


app.get('/',(req,res)=>{
    homeController.goHome(req,res);
});

app.get('/logout',(req,res)=>{
  if(req.session.user){
      var notif = {
        message : 'See you soon ' + req.session.user.username
      };
      req.session.destroy();
  }
    res.render('login.hbs',notif)
});

app.listen('3000');
console.log('application has started at localhost:3000');
