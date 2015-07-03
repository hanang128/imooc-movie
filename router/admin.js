var express = require('express');
var router = express.Router();
var movie = require("../controller/movie");
var user = require("../controller/user");
var category = require("../controller/category");

//admin
//movie
router.get("/movie/list",user.signinRequired,user.adminRequired,movie.list);

router.get("/movie",user.signinRequired,user.adminRequired,movie.edit)

router.get("/movie/update/:id",user.signinRequired,user.adminRequired,movie.edit);

router.delete("/movie/list",user.signinRequired,user.adminRequired,movie.del);

router.post("/movie/new",user.signinRequired,user.adminRequired,movie.create);



//user 
router.get("/user/list",user.signinRequired,user.adminRequired,user.list)


//category
router.get("/category/new",user.signinRequired,user.adminRequired,category.new);
router.post("/category",user.signinRequired,user.adminRequired,category.create);
router.get("/category/update/:id",user.signinRequired,user.adminRequired,category.update);
router.get("/category/list",user.signinRequired,user.adminRequired,category.list);

module.exports = router;