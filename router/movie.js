var express = require("express");
var index = require("../controller/index");
var movie = require("../controller/movie");
var user = require("../controller/user");
var comment  = require("../controller/comment");
var category = require("../controller/category");
var router = express.Router();

//Movie


router.get("/",index.Index);
router.get("/results",index.search);

router.get("/movie/:id",movie.detail);



//comment
router.post("/comment/new",user.signinRequired,comment.create);


module.exports = router;
