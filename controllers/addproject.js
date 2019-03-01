//Schemas || Models
var Project = require('../models/project.js');

exports.addProjectGet = function (req, res) {
	Project.find({}, function (err, projects) {
        res.render('addproject', {
			projects: projects
		});
	});
}

exports.addProjectPost = function (req, res) {
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
}

exports.deleteProjectPost = function (req, res) {
	console.log(req);
}