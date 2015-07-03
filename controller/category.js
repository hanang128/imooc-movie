var Category = require("../models/category");

exports.new = function(req,res){
	res.render('category',
	{
		title:"新增类别",
		category:{} 
	});
};

exports.update = function(req,res){
	var id = req.params.id;
	console.log(id);
	Category.findById(id,function(err,category){
		console.log(category)
		res.render('category',
		{
			title:"更新类别",
			category:category
		});
	});
};

exports.create = function(req,res){
	var _category = req.body.category;
	
	var catid = req.body.category._id;
	var category;
	
	if(catid){
		category = Category.findById(catid,function(err,category){
			category.name =_category.name;
			category.save(function(err,category){
				if(err){
					console.log(err)
				}else{
					res.redirect("/admin/category/list");
				}
			})
		})
	}else{
		category = new Category(_category);
		
		console.log(category);
		category.save(function(err,category){
			console.log(category)
			if(err){
				console.log(err)
			}else{
				res.redirect("/admin/category/list");
			}
		})
	}
}

exports.list = function(req,res){
	Category.fetch(function(err,categorys){
		res.render("categorylist",{
			title:"分类列表",
			categorys:categorys
		})
	})
}