//Schemas || Models
var Project = require('../models/project.js');

exports.addProjectGet = function (req, res) {
	Project.find({}, function (err, projects) {
        res.render('projects', {
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
		res.redirect('/projects');
	})
	.catch(err => {
		req.flash('error_msg', 'Somthing went wrong. The project has not been added!');
		res.redirect('/projects');
	})
}

exports.deleteProjectPost = function (req, res) {
	Project.findById({_id: req.body.projId}).remove().exec();
	
	res.redirect('/projects');
}

exports.editProjectPost = function (req, res){
	res.send(req.body);
	var query = {projectname: req.body.newProjName};
	req.newData.projectname = req.body.newProjName;

	Project.findOneAndUpdate(query, req.newData, {upsert:true}, function(err, doc){
		req.flash('success_msg', 'The project has been edited!');
		res.redirect('/projects');
	});
}