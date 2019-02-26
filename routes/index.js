var express = require('express');
var router = express.Router();

//Schemas || Models
var DailyTask = require('../models/dailytask.js');
var Project = require('../models/project.js');
var User = require('../models/user.js');

//Get Homepage
router.get('/', ensureAuthenticated, function(req, res){

	Project.find({}, function (err, projects) {
        res.render('index', {
			projects: projects
		});
	});

});

//Post Daily Task
router.post('/adddailytask', ensureAuthenticated, function(req, res){
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

	//save daily task to DB
	newDailyTask.save()
	.then(item=> {
		req.flash('success_msg', 'You have send the Daily Task!');
		res.redirect('/');
	})
	.catch(err => {
		res.status(400).send("unable to save to database");
	})

});

//Get Add Project
router.get('/addproject', isAdminFunc, function (req, res) {

	Project.find({}, function (err, projects) {
        res.render('addproject', {
			projects: projects
		});
	});
	
});

//Post Add Project
router.post('/addproject', ensureAuthenticated, function (req, res) {
	var projectname = req.body.projectname;

	var newProject = new Project({
		projectname: projectname
	});

	newProject.save()
	.then(item=> {
		req.flash('success_msg', 'The project has been added!');
		res.redirect('/addproject');
	})
	.catch(err => {
		req.flash('error_msg', 'Somthing went wrong. The project has not been added!');
		res.redirect('/addproject');
	})
});

//Get Export
router.get('/export', isAdminFunc, function (req, res) {
	Project.find({}, function (err, projects) {
        User.find({}, function (err, users) {
			res.render('export', {
				projects: projects,
				users: users
			});
		});
	});
});

//Post Export
router.post('/export', isAdminFunc, function (req, res) {
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
});

//Get Tasks
router.get('/tasks', ensureAuthenticated, function (req, res) {
	var currentUser = req.user.name;
	
	DailyTask.find({ username: currentUser}, function (err, dailytasks) {
		// var DailyTasks = dailytasks;
		// var dates = [];

		// for(var i = 0; i < dailytasks.length; i++){
		// 	var cropedDate = dailytasks[i].date.toString().substring(0, 15);
			
		// 	dates.push(cropedDate);
		// }

		res.render('tasks', {
			dailytasks: dailytasks
		});		
	});
	

});

//GLOBAL FUNCTIONS
		//Check authentication
		function ensureAuthenticated(req, res, next){
			if(req.isAuthenticated()){
				return next();
			} else {
				req.flash('error_msg','Please login!');
				res.redirect('/users/login');
			}
		}

		//Check authentication & admin
		function isAdminFunc(req, res, next) {
			if (req.isAuthenticated()) {
				if (req.user.isAdmin) {
					return next();
				}else{
					res.redirect('/');
				}
			} 
				res.redirect('/users/login');
		}
	

module.exports = router;