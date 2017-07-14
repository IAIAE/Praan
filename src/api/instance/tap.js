import Stream from '../../Functor/Stream.js'
import Sink from '../../Functor/Sink/Sink'

export default function tap(fn){
    return Stream.of(this.source.map({
        fn: function(value, time, nextSink, scheduler, task){
            try{
                fn(value)
            }catch(e){
                return nextSink.err(e, time, scheduler, task);
            }
            nextSink.event(value, time, scheduler, task)
        },
        err: function(e, time, nextSink, scheduler, task){
            nextSink.err(e, time, scheduler, task)
        }
    }));
}
