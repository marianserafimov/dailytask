//Schemas || Models
var DailyTask = require('../models/dailytask.js');
var Project = require('../models/project.js');
var User = require('../models/user.js');

exports.getExport = function (req, res) {
	Project.find({}, function (err, projects) {
        User.find({}, function (err, users) {
			res.render('export', {
				projects: projects,
				users: users
			});
		});
	});
}

exports.postExport = function (req, res) {
	var selectedUser = req.body.selecteduser;
	var selectedProject = req.body.selectedproject;
	var selectedUDateFrom = req.body.datefrom;
	var selectedUDateTo = req.body.dateto;

	DailyTask.find({ username: selectedUser, project: selectedProject, date: { $gte: selectedUDateFrom }, date: { $lte: selectedUDateTo}}, function (err, dailytasks) {
		var jsonString = "";

		for(var i = 0; i < dailytasks.length; i++){
			var username = dailytasks[i].username;
			var project = dailytasks[i].project;
			var hours = dailytasks[i].hours;
			var tasktype = dailytasks[i].tasktype;
			
			var date = dailytasks[i].date;
			var cropedDate = date.toString().substring(0, 15);

			if(i == 0){
				var singleJsonString = "[{\"name\": \"" + username + "\",\"project\": \"" + project + "\",\"hours\": \"" + hours + "\",\"tasktype\": \"" + tasktype + "\",\"date\": \"" + cropedDate + "\"},";
				jsonString+= singleJsonString;
			}else if(i == dailytasks.length-1){
				var singleJsonString = "{\"name\": \"" + username + "\",\"project\": \"" + project + "\",\"hours\": \"" + hours + "\",\"tasktype\": \"" + tasktype + "\",\"date\": \"" + cropedDate + "\"}]";
				jsonString+= singleJsonString;
			}else{
				var singleJsonString = "{\"name\": \"" + username + "\",\"project\": \"" + project + "\",\"hours\": \"" + hours + "\",\"tasktype\": \"" + tasktype + "\",\"date\": \"" + cropedDate + "\"},";
				jsonString+= singleJsonString;
			}
		  }
		var json = JSON.parse(jsonString);
		res.xls('data.xlsx', json);
	});
}