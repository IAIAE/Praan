import Stream from '../../Functor/Stream.js'
import Sink from '../../Functor/Sink/Sink'

export default function tap(fn){
    return Stream.of(this.source.map({
        fn: function(value, time, nextSink, scheduler, task){
            fn(value)
            nextSink.event(value, time, scheduler, task)
        },
        err: function(e, nextSink){
            nextSink.err(e)
        }
    }));
}
