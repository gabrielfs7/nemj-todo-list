var mongoose = require('mongoose');
var taskSchema = new mongoose.Schema({
    name: String,
    badge: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    doUntil: {
        type: Date
    },
    finishedAt: {
        type: Date
    },
    finishedAt: Boolean
});
mongoose.model('Task', taskSchema);