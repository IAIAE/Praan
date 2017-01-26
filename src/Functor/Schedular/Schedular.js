import {method} from '../../util.js'


function Schedular(clockTimer, taskFlow){
    this.clockTimer = clockTimer;
    this.taskFlow = taskFlow;
}

Schedular.of = function(timer, flow){
    return new Schedular(timer, flow);
}

var warp = function(task, time, periodic){
    task.time = time;
    task.periodic = periodic;
    return task;
}
method(Schedular, 'atonce', function(task){
    var now = this.now();
    this.schedule(0, -1, now, task);
})

.method('now', function(){
    return this.clockTimer.now();
})

.method('schedule', function(delay, periodic, callTime, task){
    this.taskFlow.insert(task.time === undefined ? warp(task, callTime + delay, periodic) : task);
    this.runNextArrival(callTime);
})

.method('runNextArrival', function(now){
    var nextArrival = this.taskFlow.nextArrival();
    if(nextArrival == null) return null;
    if (this._lastNextArrival && nextArrival < this._lastNextArrival) {
        //  there has task in ready but not execute yet.
        this.unShedule();
    }
    this._lastNextArrival = nextArrival;
    this.timer = this.clockTimer.setTimer(this._runTheTask.bind(this), Math.max(0, nextArrival - now))
})

.method('_runTheTask', function(){
    this.timer = null;
    var now = this.clockTimer.now()
    this.taskFlow.runTask(now, safeRunTask);
    this.runNextArrival(this.clockTimer.now());
})

/**
 * below is the instance method
 */
.method('periodic', function(duration, task){
    this.schedule(0, duration, this.now(), task)
})

function safeRunTask(taskLike, insertCb){
    try{
        console.info('this task is ', taskLike)
        taskLike.run();
    }catch(e){
        taskLike.err(e);
    }
    if(taskLike.periodic >= 0 && taskLike.active){
        taskLike.time = taskLike.time + taskLike.periodic;
        insertCb(taskLike)
    }
}
export default Schedular


