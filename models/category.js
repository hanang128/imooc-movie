var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Promise = require('bluebird');
var ObjectId = Schema.Types.ObjectId;

var CategorySchema = new Schema({
	name:String,
	movies: [{type: ObjectId, ref:"Movies"}],
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

CategorySchema.pre("save",function(next){
	if(this.isNew){
		this.createAt = this.updateAt= Date.now();
	}else{
		this.updateAt = Date.now();
	}

	next();
})

CategorySchema.statics ={
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


var Category = mongoose.model("Categorys",CategorySchema);
Promise.promisifyAll(Category);
Promise.promisifyAll(Category.prototype);
module.exports = Category;