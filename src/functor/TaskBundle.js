import {method} from '../util.js'
import Task from './Task.js'


function TaskBundle(task, time){
    this.bundle = [task];
    this.time = task.time? task.time: time;
}

method(TaskBundle, 'add', function(taskLike){
    this.bundle.push(taskLike);
    return this;
});

export default TaskBundle;