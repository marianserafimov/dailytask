//Schemas || Models
var DailyTask = require('../models/dailytask.js');

exports.sendTask = function(req, res){
	var username = req.body.username;
	var date = req.body.date;
	var projectname = req.body.projectname;
	var description = req.body.description;
	var tasktype = req.body.tasktype;
	var hours = req.body.hours;

	var newDailyTask = new DailyTask({
		username: username,
		date: date,
		project: projectname,
		description: description,
		tasktype: tasktype,
		hours: hours
	});

	//Save daily task to DB
	newDailyTask.save()
	.then(item=> {
		req.flash('success_msg', 'You have send the Daily Task!');
		res.redirect('/');
	})
	.catch(err => {
		res.status(400).send("unable to save to database");
	})

}