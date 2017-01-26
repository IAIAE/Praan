import {method} from '../../util.js'
import Task from '../Task/Task.js'

export default ClockTimer

function ClockTimer(){}

ClockTimer.of = function(){
    return new ClockTimer();
}

method(ClockTimer, 'now', Date.now)
.method('setTimer', function(fn, delay){
    return delay <= 0 ? runAsTask(fn) : setTimeout(fn, delay);
})
.method('clearTimer', function foo(timer){
    return timer instanceof Task ? timer.stop() : clearTimeout(timer);
})

function runAsTask(fn){
    Promise.resolve(Task.of(fn)).then(_run);
}

function _run(taskLike){
    try{
        return taskLike.run()
    }catch(e){
        return taskLike.err(e);
    }
}
