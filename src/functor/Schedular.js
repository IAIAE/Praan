import {method} from '../util.js'


function Schedular(clockTimer, taskFlow){
    this.clockTimer = clockTimer;
    this.taskFlow = taskFlow;
}
var warp = function(task, time, periodic){
    task.time = time;
    task.periodic = periodic;
}
method(Schedular, 'atonce', function(task){
    var now = this.now();
    this.schedule(0, -1, now, task);
})
.method('now', function(){
    return this.clockTimer.now();
})
.method('schedule', function(delay, periodic, callTime, task){
    this.taskFlow.add(task.time === undefined ? warp(task, callTime + delay, periodic) : task);
    this.runNextArrival(callTime);
})
.method('runNextArrival', function(now){
    if (this.taskFlow.queue.length === 0) {
        return null;
    }
    var nextArrival = this.taskFlow.nextArrival();
    if (this._lastNextArrival && nextArrival < this._lastNextArrival) {
        //  there has task in ready but not execute yet.
        this.unShedule();
    }
    this._lastNextArrival = nextArrival;
    this.timer = this.clockTimer.setTimer(this.runTheTaskBind, Math.max(0, nextArrival - now))
})
.method('runTheTaskBind', function(){
    this.timer = null;
    this._runTheTask(this.clockTimer.now());
})
.method('_runTheTask', function(now){
    this.taskFlow.runTask(now, safeRunTask);
    this.runNextArrival(this.clockTimer.now());
})

function safeRunTask(taskLike, insertCb){
    try{
        taskLike.run();
    }catch(e){
        taskLike.err(e);
    }
    if(taskLike.periodic >= 0 && taskLike.active){
        taskLike.time = taskLike.time + taskLike.periodic;
        insertCb(taskLike)
    }
}
