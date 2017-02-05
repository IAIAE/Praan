import {method} from '../../util.js'

function Task(value, sink){
    this.value = value;
    this.sink = sink;
    this.active = true;
    this.time = null; //time will set by scheduler
}

Task.of = function(value, sink){
    return new Task(value, sink);
}

method(Task, 'run', function (scheduler){
    return this.active && this.sink.event(this.value, this.time, scheduler, this);
})
.method('err', function (err){
    throw err;
})
.method('dispose', function(){
    this.active = false;
});



export default Task;


