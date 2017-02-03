/**
 * Periodic is a source that emit a `value` every `duration`
 * @author  iaiae
 */
import Task from '../Task/Task.js'
import Sink from '../Sink/Sink'
import reInitSink from './reInitSink'

function Periodic(duration, value) {
    this.duration = duration
    this.value = value
    this.sinks = []
    this._sink = function(){}
}

Periodic.of = function(duration, value){
    return new Periodic(duration, value)
}

Periodic.prototype.map = function(fn){
    let newP = Periodic.of(this.duration, this.value)
    newP.sinks = this.sinks.concat([fn])
    newP._sink = reInitSink(newP.sinks);
    return newP
}


Periodic.prototype.sluice = function(scheduler){
    return scheduler.periodic(this.duration, Task.of(this.value, this._sink));
}


export default Periodic;
