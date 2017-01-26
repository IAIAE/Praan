import Stream from '../Stream.js'
import Task from '../Task/Task.js'

function Periodic(duration, value) {
    this.duration = duration;
    this.value = value;
}
Periodic.of = function(duration, value){
    return new Periodic(duration, value);
}

function warpValue(value, task){
    task.value = value;
    return task;
}

Periodic.prototype.run = function(sink, scheduler){
    return scheduler.periodic(this.duration, warpValue(this.value, Task.of(sink)));
}

export default Periodic;
