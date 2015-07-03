var Comment = require("../models/comment");

exports.create = function(req, res) {
	var _comment = req.body.comment;
	var movieId = req.body.comment.movie;

	if (_comment.cid) {
		Comment.findOne({
			_id: _comment.cid
		}, function(err, comment) {
			var reply = {
				from: _comment.from,
				to: _comment.tid,
				content: _comment.content
			}
			console.log(reply);
			
			comment.reply.push(reply);

			comment.save(function(err, comment) {
				if (err) {
					console.log(err);
				} else {
					res.redirect("/movie/" + movieId);
				}
			})
		})
	} else {
		var comment = new Comment(_comment);
		console.log(comment)
		comment.save(function(err, comment) {
			if (err) {
				console.log(err);
			} else {
				res.redirect("/movie/" + movieId);
			}
		})
	}

}