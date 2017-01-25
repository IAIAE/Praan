import Stream from '../Stream.js'
import Task from '../Task/Task.js'

function Periodic(duration, value) {
    this.duration = duration;
    this.value = value;
}
Periodic.of = function(duration, value){
    return new Periodic(duration, value);
}

function ValueTask(value, task){
    this.task = task;
    this.value = value;
}

ValueTask.prototype.run = function(){
    this.task.run(this.value)
}

Periodic.prototype.run = function(sink, scheduler){
    return scheduler.periodic(this.duration, new ValueTask(this.value, Task.of(sink)));
}

export default Periodic;
