import Stream from '../../Functor/Stream.js'
import Sink from '../../Functor/Sink/Sink'

export default function error(fn) {
    return Stream.of(this.source.map({
        fn: function(value, time, nextSink, scheduler, task) {
            nextSink.event(value, time, scheduler, task)
        },
        err: function (e, nextSink) {
            let result = fn(e);
            if(result !== undefined){
                nextSink.err(result);
            }
        }
    }));
}

