import {method} from '../../util.js'
import Task from '../Task/Task.js'

function ClockTimer(){}

ClockTimer.of = function(){
    return new ClockTimer();
}

method(ClockTimer, 'now', Date.now)
.method('setTimer', function(fn, delay){
    return delay <= 0 ? deferRun(fn) : setTimeout(fn, delay);
})
.method('clearTimer', function (timer){
    return timer instanceof Ap ? timer.stop() : clearTimeout(timer);
})

function deferRun(fn){
    let ap = new Ap(fn);

    Promise.resolve(ap).then(function(_ap){
        try{
            _ap.run();
        }catch(e){
            _ap.err(e);
        }
    });

    return ap;
}

function Ap(fn){
    this.fn = fn;
    this.active = true;
}
method(Ap, 'run', function(){
    this.active && this.fn()
})
.method('err', function(e){
    throw e
})
.method('stop', function(){
    this.active = false;
})


export default ClockTimer