//Schemas || Models
var Project = require('../models/project.js');

exports.getHome = function(req, res){

	Project.find({}, function (err, projects) {
        res.render('index', {
			projects: projects
		});
    });
}