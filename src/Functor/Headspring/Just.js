/**
 * Just is the simplest source that only emit a value once
 * @author  iaiae
 */
import Sink from '../Sink/Sink'
import Task from '../Task/Task'
import reInitSink from './reInitSink'

function Just(data){
    this.value = data;
    this.sinks = [];
    this._sink = null;
}

Just.of = function(data){
    return new Just(data);
}

Just.prototype.map = function(fn){
    let newJust = Just.of(this.value)
    newJust.sinks = this.sinks.concat([fn])
    newJust._sink = reInitSink(newJust.sinks);
    return newJust
}

Just.prototype.sluice = function(scheduler){
    return scheduler.atOnce(Task.of(this.value, this._sink))
}

export default Just