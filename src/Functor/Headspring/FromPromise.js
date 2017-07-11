import reInitSink from './reInitSink'
import Task from '../Task/Task'

const initSink = {
    fn: function (value, time, nextSink, scheduler, task) {
        value.then(function (data) {
            nextSink.event(data, time, scheduler, task);
        }).catch(function(err){
            nextSink.err(err);
        })
        task.dispose()
    },
    err: function(e, nextSink){
        nextSink.err(e);
    }
}

function FromPromise(promise) {
    this.promise = promise;
    this.sinks = [initSink]
}
FromPromise.of = function (promise) {
    return new FromPromise(promise)
}
FromPromise.prototype.map = function (fn) {
    let newP = FromPromise.of(this.promise)
    newP.sinks = this.sinks.concat([fn])
    newP._sink = reInitSink(newP.sinks);
    return newP
}

FromPromise.prototype.sluice = function (scheduler) {
    scheduler.atOnce(Task.of(this.promise, this._sink))
}

export default FromPromise