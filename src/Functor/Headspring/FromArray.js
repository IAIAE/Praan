import reInitSink from './reInitSink'
import Task from '../Task/Task'

function FromArray(arr) {
    this.array = arr;
    this.sinks = [{
        fn: function (value, time, nextSink, scheduler, task) {
            console.info('IAIAE--> fromarray sink ');
            for (var i = 0, len = value.length; i < len; i++) {
                nextSink.event(value[i], time, scheduler, task);
            }
            task.dispose();
        },
        err: function(e, nextSink){
            nextSink.err(e);
        }
    }]
}
FromArray.of = function (arr) {
    return new FromArray(arr)
}
FromArray.prototype.map = function (fn) {
    let newP = FromArray.of(this.array)
    newP.sinks = this.sinks.concat([fn])
    newP._sink = reInitSink(newP.sinks);
    return newP
}

FromArray.prototype.sluice = function (scheduler) {
    scheduler.atOnce(Task.of(this.array, this._sink))
}

export default FromArray