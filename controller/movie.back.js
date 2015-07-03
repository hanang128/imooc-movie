var Movie = require("../models/movie");
var Comment = require("../models/comment");
var Category = require("../models/category");
var _ = require("underscore");
var Promise = require('bluebird');

//movie


exports.detail = function(req, res) {
	var id = req.params.id;
	if (id) {
		Movie.findOne({_id:id})
			 .populate('category','name')
			 .exec(function(err, movie) {
				console.log(movie)

				if (err) {
					console.log(err)
				} else {
					Comment.find({movie:id})
					.populate('from','name')
					.populate('reply.from reply.to','name')

					.exec(function(err,comments){
						console.log("comments:" + comments)
						res.render("detail", {
							title: "电影详情",
							movie: movie,
							comments:comments
						})
					})
					
				}
		})
	}
}

exports.list = function(req, res) {

	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err)
		}
		res.render("list", {
			title: '电影列表',
			movies: movies
		})
	})
}

exports.edit = function(req, res) {
	var id = req.params.id;
	if (id) {
		Movie.findById(id, function(err, movie) {
			console.log(movie)
			if (err) {
				console.log(err)
			}else{
				Category.fetch(function(err,categorys){
					if (err) {
						console.log(err)
					}else {
							res.render("admin", {
								title: '管理员更新',
								movie: movie,
								categorys: categorys
							})
					}
				})
			}
		})
	} else {
		Category.fetch(function(err,categorys){
			if(err){
				console.log(err)
			}else{
				res.render("admin", {
					title: '编辑电影信息',
					movie: {
						title: '',
						director: '',
						country: '',
						year: '',
						poster: '',
						flash: '',
						summary: '',
						language: ''
					},
					categorys:categorys
				})
			}
		})
		
	}
}


exports.del = function(req,res){
	var id =req.query.id;
	if(id){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}else{
				movie.remove({_id:id},function(err,movie){
					if(err){
						console.log(err);
						res.json({"status":0});
					}else{
						res.json({"status":1});
					}
				})
			}
		})
	}
}

exports.create = function(req,res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	
	var categoryId = movieObj.category;
	var categoryName = movieObj.categoryName;

	if(id){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}
			_movie =_.extend(movie,movieObj);
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}
				//类别发生变化
				//移除原类别下的电影信息
				if(movieObj.category !==_movie.category){
					Category.findById(movieObj.category,function(err,category){
						var arrMovies =category.movies;
						category.movies =[];
						arrMovies.forEach(function(item){
							if(item !=movie._id){
								category.movies.push(item);
							}
						})

						category.save(function(err,category){
							if(err){
								console.log(err)
							}
						})
					})
				}
				Category.findById(movie.category,function(err,category){
					category.movies.push(movie);
					category.save(function(err,category){
						if(err){
							console.log(err)
						}else{
							res.redirect("/movie/"+movie._id);
						}
					})
				})
			})
		})
	}else{
		_movie = new Movie(movieObj);
		
		_movie.save(function(err, movie) {
			if (err) {
				console.log(err);
			}
			if(categoryId){
				Category.findById(movie.category, function(err, category) {
					category.movies.push(movie._id);
					category.save(function(err, category) {
						if (err) {
							console.log(err);
						} else {
							res.redirect("/movie/" + movie._id);
						}
					})
				});

			}else if(categoryName){
				var category = new Category({name:categoryName});
				category.movies =[movie._id];
				category.save(function(err, category) {

						if (err) {
							console.log(err);
						} else {
							movie.category = category._id;
							movie.save(function(err,movie){
								res.redirect("/movie/" + movie._id);
							})
							
						}
					});
			}

		})
				
	}
}