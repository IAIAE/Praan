import Stream from '../../Functor/Stream.js'
import Sink from '../../Functor/Sink/Sink'
import Task from '../../Functor/Task/Task'

export default function delay(time){
    return Stream.of(this.source.map(function(value, execTime, nextSink, scheduler){
        scheduler.accurate(execTime + time, Task.of(
            value, 
            Sink.of((_value, _time, _scheduler, _task) => nextSink.event(_value, _time, _scheduler, _task))
            ))
    }));
}
