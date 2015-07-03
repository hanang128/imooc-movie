var mongoose = require("mongoose")
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Promise = require('bluebird');

var CommentSchema = new Schema({
	movie:{
		type:ObjectId,
		ref:"Movies"
	},
	from:{
		type:ObjectId,
		ref:'Users'
	},
	content:{
		type:String
	},
	reply:[{
		from:{type:ObjectId,ref:'Users'},
		to:{type:ObjectId,ref:'Users'},
		content:String
	}],
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})

CommentSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt= Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}

	next();
})

CommentSchema.statics = {
	fetch:function(cb){
		return this.find({})
				.sort("meta.updateAt")
				.exec(cb);
		
	},
	findById:function(id,cb){
		return this
				.findOne({'_id':id})
				.sort("meta.updateAt")
				.exec(cb);
	}
}

var Comment = mongoose.model('Comments',CommentSchema);
Promise.promisifyAll(Comment);
Promise.promisifyAll(Comment.prototype);
module.exports = exports = Comment;