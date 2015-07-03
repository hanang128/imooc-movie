var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/imooc');

var db = mongoose.connection;
db.on('error',function(error){
	console.log('connect mongodb error:' + error)
})

db.once('connected',function(){
	console.log('connect mongodb success');
})

module.exports = db;