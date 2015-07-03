var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var Promise = require('bluebird');

var UserSchema = new mongoose.Schema({
	name:{
		type:String,
		unique:true
	},
	password:{
		type:String
	},
	// 0: nomal user
  // 1: verified user
  // 2: professonal user
  // >10: admin
  // >50: super admin
  	role: {
    	type: Number,
    	default: 0
  	},
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		}
	}
})

//use bcrypt hash the password
UserSchema.pre("save",function(next){
	var user  = this;
	bcrypt.genSalt(10,function(err,salt){
		if(err) next(err)
		console.log(salt);
		bcrypt.hash(user.password,salt,null,function(err,hash){
			if(err) next(err)
			user.password = hash;
			next();
		})
	})


})

UserSchema.statics ={
	fetch:function(cb){
		return this.find({})
				.sort("name")
				.exec(cb);
	},
	findById:function(id,cb){
		return this.findOne({_id:id})
					.sort("name")
					.exec(cb)
	}
}

UserSchema.methods ={
	checkUser:function(cb){
		var _user = this;
		this.model("Users").findOne({name:_user.name},function(err,user){

			if(err){
				console.log("err")
				return cb(err)
			}else{
				if(user){
					console.log("find user" + user)
					console.log(_user.password);
					bcrypt.compare(_user.password,user.password,function(err,res){
						console.log(err)
						console.log(res);
						if(err) return cb(err)
						return cb(null,res);
					});
				}else{
					console.log("false")
					return cb(null,false);
				}
			}
		})
	},
	comparePassword:function(password,cb){
		bcrypt.compare(password, this.password, function(err, res) {
			if (err) return cb(err)
			return cb(null, res);
		});
	}
}

var User = mongoose.model("Users",UserSchema);
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);
module.exports = User;