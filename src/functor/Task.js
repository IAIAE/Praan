import {method} from '../util.js'

function Task(fn){
    this.__value = fn;
    this.active = true;
}

method(Task, 'run', function (){
    return this.active && this.__value();
})
.method('err', function (err){
    throw err;
})
.method('stop', function(){
    this.active = false;
    return this;
});

export default Task;


