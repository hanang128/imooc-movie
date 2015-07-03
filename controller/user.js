var User = require("../models/user");


//signup   注册
exports.showSignup = function(req,res){
	res.render("userSignup",{title:"用户注册"})
}
exports.signup = function(req,res){
	var _user  = req.body.user;
	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err)
		}else{
			
			if(user){
				res.redirect("/user/signin");
			}else{
				console.log(_user);
				user  = new User(_user);
				user.save(function(err,user){
					if(err){
						console.log(err)

					}else{
						res.redirect("/user/signin")
					}
				})
			}
		}
	})
}

//signin 登陆
exports.showSignin = function(req,res){
	res.render("userSignin",{title:"用户登陆"})
}
exports.signin = function(req,res){
	var _user = req.body.user;
	console.log(_user)
	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err)
		}else{
			user.comparePassword(_user.password, function(err, result) {

				if (err) {
					console.log(err);
					return res.redirect("/user/signin");
				} else {
					console.log(user);
					if (result) {
						req.session.user = user;
						return res.redirect("/")

					} else {
						return res.redirect("/user/signin");
					}
				}
			})
		}
	})
	
}

//logout  
exports.logout = function(req,res){
	req.session.user =null;
	res.redirect("/");
}

exports.list = function(req,res){
	var users = User.fetch(function(err,users){
		if(err){
			console.log(err)
		}else{
			res.render("userList",{
				title:"用户列表",
				users:users
			})
		}
	})
}

exports.signinRequired = function(req,res,next){
	var user = req.session.user;
	if(!user){
		return res.redirect("/user/signin");
	}
	next();
}

exports.adminRequired  = function(req,res,next){
	var user = req.session.user;

	if(user.role <=10){
		return res.redirect("/user/signin");
	}

	next();
}