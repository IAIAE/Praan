import {method} from '../../util.js'


function Schedular(clockTimer, taskFlow){
    this.clockTimer = clockTimer;
    this.taskFlow = taskFlow;
}

Schedular.of = function(timer, flow){
    return new Schedular(timer, flow);
}

var count = 1;


var warp = function(task, time, periodic){
    task.time = time;
    task.periodic = periodic;
    return task;
}
/**
 * get current timestamp
 */
method(Schedular, 'now', function(){
    return this.clockTimer.now();
})

/**
 * schedule a task, put a task into the taskFlow at the right time
 */
.method('schedule', function(delay, periodic, callTime, task){
    this.taskFlow.insert(task.time == undefined ? warp(task, callTime + delay, periodic) : task);
    this.runNextArrival(callTime);
})

.method('unShedule', function(){
    this.timer && this.clockTimer.clearTimer(this.timer)
    this.timer = null;
    this._lastNextArrival = null;
})

/**
 * immediately put the task into the taskFlow
 */
.method('atOnce', function(task){
    var now = this.now();
    this.schedule(0, -1, now, task);
})

/**
 * put the task into taskFlow, then the task will run periodicly
 */
.method('periodic', function(duration, task){
    this.schedule(0, duration, this.now(), task)
})

/**
 * delay
 */
.method('delay', function(delay, task){
    this.schedule(delay, -1, this.now(), task)
})

/**
 * at a accurate time
 */
.method('accurate', function(time, task){
    var now = this.now();
    this.schedule(time - now, -1, now, task)
})


.method('runNextArrival', function(now){
    var nextArrival = this.taskFlow.nextArrival();
    if(nextArrival == null) return null;
    if (this.timer && this._lastNextArrival && nextArrival < this._lastNextArrival) {
        //  there has task in ready but not execute yet.
        this.unShedule();
    }else if(this.timer){
        // if exist a ready-to-run task and the task's time is equal `nextArrival`
        // ignore this method call.
        return null;  
    }
    this._lastNextArrival = nextArrival;
    this.timer = this.clockTimer.setTimer(_=>this._runTheTask() , Math.max(0, nextArrival - now))
})

.method('_runTheTask', function(){
    this.timer = null;
    var now = this.clockTimer.now()
    this.taskFlow.runTask(now, safeRunTask, this);
    count++
    this.runNextArrival(this.clockTimer.now());
})


function safeRunTask(task, scheduler, insertCb){
    try{
        task.run(scheduler);
    }catch(e){
        task.err(e);
    }
    if(task.periodic >= 0 && task.active){
        task.time = task.time + task.periodic;
        insertCb(task)
    }
}
export default Schedular


