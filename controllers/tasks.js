//Schemas || Models
var DailyTask = require('../models/dailytask.js');

exports.getTasks = function (req, res) {
	var currentUser = req.user.name;

	DailyTask.find({ username: currentUser}, function (err, dailytasks) {
		res.render('tasks', {
			dailytasks: dailytasks
		});		
	});
}