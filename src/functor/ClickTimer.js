import {method} from '../util.js'
import Task from './Task.js'

export default ClickTimer

function ClickTimer(){}

method(ClickTimer, 'now', Date.now)
.method('setTimer', function(fn, delay){
    return delay <= 0 ? runAsTask(fn) : setTimeout(timer, delay);
})
.method('clearTimer', function foo(timer){
    return timer instanceof Task ? timer.stop() : clearTimeout(timer);
})


function runAsTask(taskLike){
    Promise.resolve(taskLike).then(_run);
}

function _run(taskLike){
    try{
        return taskLike.run()
    }catch(e){
        return taskLike.err(e);
    }
}
