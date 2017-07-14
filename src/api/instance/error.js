import Stream from '../../Functor/Stream.js'
import Sink from '../../Functor/Sink/Sink'
import Restore from '../../Functor/Restore';

export default function error(fn) {
    return Stream.of(this.source.map({
        fn: function(value, time, nextSink, scheduler, task) {
            nextSink.event(value, time, scheduler, task)
        },
        err: function (e, time, nextSink, scheduler, task) {
            let result = fn(e);
            if(result !== undefined){
                if(result instanceof Restore){
                    nextSink.event(result.value, time, scheduler, task);
                }else{
                    nextSink.err(result, time, scheduler, task);
                }
            }
        }
    }));
}

