var express = require("express");
var router = express.Router();

var user = require("../controller/user")

//注册
router.route("/signup")
.post(user.signup)
.get(user.showSignup)

//登陆
router.route("/signin")
	.get(user.showSignin)
	.post(user.signin)

router.get("/logout",user.signinRequired,user.logout);




module.exports = router;
