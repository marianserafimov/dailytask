var mongoose = require('mongoose');

// Dailytask Schema
var ProjectSchema = mongoose.Schema({
	projectname: {
        type: String,
        required: true
    },
    realeasedate: {
        type: Date,
        default: Date.now
    }
});

var Project = module.exports = mongoose.model('Project', ProjectSchema);
