var mongoose = require('mongoose');

// Dailytask Schema
var DailytaskSchema = mongoose.Schema({
	username: {
		type: String
	},
	date: {
		type : Date
	},
	project: {
		type: String
	},
	description: {
		type: String
	},
	tasktype: {
		type: String
	},
	hours: {
		type: Number
	}
});

var User = module.exports = mongoose.model('DailyTask', DailytaskSchema);
