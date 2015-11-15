var mongoose = require('mongoose');
var taskSchema = new mongoose.Schema(
    {
        name: String,
        createdAt: {
            type: Date,
            default: Date.now
        },
        doUntil: {
            type: Date
        },
        finishedAt: {
            type: Date
        }
    }
);
mongoose.model('Task', taskSchema);