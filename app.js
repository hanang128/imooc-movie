var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session =require("express-session");
var MongoStore = require('connect-mongo')(session);
var mongoose     = require('mongoose');
var multer = require("multer");
var morgan = require('morgan');
var app = express();
var  _ = require("underscore");

require('./db');
var routes = require("./router/movie");
var user = require("./router/user");
var admin  = require("./router/admin");


app.set("view engine","jade");
app.set("port",3000);
app.set("views","./views/pages");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multer());

app.use(cookieParser());
var half_hour = 3600000 / 2;
app.use(session({
	secret:"imooc",
	store:new MongoStore({mongooseConnection:mongoose.connection}),
	resave: true, 
	saveUninitialized: true,
	cookie:{
		maxAge:half_hour,
		secure:false
	}
}))

if ('development' === app.get('env')) {
  app.set('showStackError', true)
  //app.use(morgan("combined"));
  app.use(morgan(':method :url :response-time'));
  app.locals.pretty = true;
  mongoose.set('debug', true);
}

app.use(express.static(path.join(__dirname,'public')));
app.locals.moment = require('moment')

app.use(function(req,res,next){
	console.log("req session");
	console.log(req.session.user);
	var user = req.session.user;
	
	app.locals.user = user;
	
	next();
})

app.use("/",routes);
app.use("/user",user);
app.use("/admin",admin);

app.listen(3000);
console.log("service start at port 3000" );