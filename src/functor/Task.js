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
.method('dispose', function(){
    this.active = false;
});

export default Task;


