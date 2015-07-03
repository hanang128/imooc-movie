var Movie = require("../models/movie");
var Comment = require("../models/comment");
var Category = require("../models/category");
var _ = require("underscore");

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
		Movie.findByIdAsync(id).then(function(movie){
			movie = movie[0]|| movie;
			_movie =_.extend(movie,movieObj);
			return _movie.saveAsync();
		}).then(function(movie){
			movie = movie[0] || movie;
			
			return movie;
			
		}).then(function(movie){
			return [Category.findByIdAsync(movie.category),movie]
		}).spread(function(category,movie){
			category = category[0] || category;
			category.movies.push(movie);
			return [category.saveAsync(),movie];
		
		}).spread(function(category,movie){
			res.redirect("/movie/"+movie._id);
		}).catch(function(err){
			console.log(err);
		});
				
			
	}else{
		_movie = new Movie(movieObj);
		_movie.saveAsync().then(function(movie){
			//console.log('ater save movie');
			movie = movie[0] || movie;
			//console.log(movie);
			//console.log(categoryId);
			if(categoryId){
				return [Category.findByIdAsync(categoryId),movie];
			}else if(categoryName){
				//新的类别 先保存类别
				//再给电影添加类别信息
				var category = new Category({name:categoryName,movies:[movie._id]});
				return [category.saveAsync(),movie];
			}
		}).spread(function(category,movie){
			category = category[0] || category;
			//console.log('after get category');
			//console.log("categry:" + category);
			//console.log("movie:" +movie)
			//console.log(movie._id);
			category.movies.push(movie._id);

			//console.log("new category" + category)
			return [category.saveAsync(),movie];
			
		}).spread(function(category,movie){
			category = category[0] || category;
			/*console.log('movie no category' + movie)
			console.log(category)*/
			movie.category = category._id;
			return movie.save();
			
		}).then(function(movie){
			//console.log(movie)
			res.redirect("/movie/" + movie._id);

		}).catch(function(err){
			console.log(err);
		})
		
				
	}
}