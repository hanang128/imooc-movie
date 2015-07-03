var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Promise = require('bluebird');

var MovieSchema = new mongoose.Schema({
	director:String,
	title:String,
	language:String,
	country:String,
	summary:String,
	flash:String,
	poster:String,
	year:Number,
	category:{type:ObjectId,ref:"Categorys"},
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

MovieSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt= Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}

	next();
})

MovieSchema.statics = {
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

var Movie = mongoose.model('Movies',MovieSchema);
Promise.promisifyAll(Movie);
Promise.promisifyAll(Movie.prototype);
module.exports = exports = Movie;