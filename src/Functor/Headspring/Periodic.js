import Stream from '../Stream.js'
import Task from '../Task'

function Periodic(duration, value) {
    this.duration = duration;
    this.value = value;
}
Periodic.of = function(duration, value){
    return new Periodic(duration, value);
}

Periodic.prototype.run = function(sink, scheduler){
    return scheduler.periodic(this.duration, Task.of(sink));
}

export default Periodic;
