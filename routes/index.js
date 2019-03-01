var express = require('express');
var router = express.Router();

//Controllers
const homeController = require('../controllers/home');
const dailyTaskController = require('../controllers/dailytask');
const addProjectController = require('../controllers/addproject');
const exportController = require('../controllers/export');
const tasksController = require('../controllers/tasks');

//Get Homepage
router.get('/', ensureAuthenticated, homeController.getHome);

//Post Daily Task
router.post('/adddailytask', ensureAuthenticated, dailyTaskController.sendTask);

//Get & Post => Add Project
router.get('/addproject', isAdminFunc, addProjectController.addProjectGet);
router.post('/addproject', isAdminFunc, addProjectController.addProjectPost);
router.post('/project/delete', isAdminFunc, addProjectController.deleteProjectPost);

//Get & Post => Export
router.get('/export', isAdminFunc, exportController.getExport);
router.post('/export', isAdminFunc, exportController.postExport);

//Get Tasks
router.get('/tasks', ensureAuthenticated, tasksController.getTasks);


//GLOBAL FUNCTIONS(middlewares)
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