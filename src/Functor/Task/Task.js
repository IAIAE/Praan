import {method} from '../../util.js'

function Task(fn){
    this.fn = fn;
    this.active = true;
}

Task.of = function(fn){
    return new Task(fn);
}

method(Task, 'run', function (){
    return this.active && this.fn();
})
.method('err', function (err){
    throw err;
})
.method('dispose', function(){
    this.active = false;
});

export default Task;


