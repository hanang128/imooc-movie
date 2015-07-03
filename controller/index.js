var Movie = require("../models/movie");
var Category = require("../models/category");

exports.Index = function(req, res) {
	Category.find({})
		.populate("movies","name poster",null,{limit:4})
		.exec(function(err,categorys){
			console.log(categorys);
			if (err) {
				console.log(err);
			}
			res.render("index", {
				title: 'imooc home',
				categorys: categorys
			});
			
		});
	
};

exports.search = function(req,res){
	var categoryId = req.query.cate;
	var page = req.query.p;
	var count =2;
	var start = (page-1)*count;
	var q = req.query.q;
	if(categoryId){
		Category.findOne({_id:categoryId})
			.populate({
				path:'movies',
				select:'name poster',
				options:{limit:count,skip:start}
			})
			.exec(function(err,category){
				var movies = category.movies ||[];
				
				res.render('result',{
					title:"查询结果",
					movies:movies,
					query:"cate="+category._id,
					keyword:category.name,
					curpage:page
				});
			});
	}else{
		Movie.find({title:new RegExp(q + '.*', 'i')})
			.exec(function(err,movies){
				res.render('result',{
					title:"查询结果",
					movies:movies,
					query:"q="+q,
					keyword:q,
					curpage:page
				})
			});
	}
	
	
};