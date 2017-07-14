import Stream from '../../Functor/Stream.js'
import Sink from '../../Functor/Sink/Sink'

export default function then(fn) {
    return Stream.of(this.source.map({
        fn: function(value, time, nextSink, scheduler, task) {
            try {
                var mapedValue = fn(value);
            } catch (e) {
                return nextSink.err(e);
            }
            
            if(mapedValue === undefined) return; //if no return, means you don't wanna go on.

            if (mapedValue instanceof Stream) {
                mapedValue.end(function (_value) {
                    nextSink.event(_value, time, scheduler, task)
                }, function(err){
                    nextSink.err(err)
                })
            } else {
                nextSink.event(mapedValue, time, scheduler, task)
            }
        },
        err: function(e, time, nextSink, scheduler, task){
            nextSink.err(e, time, scheduler, task);
        }
    }));
}

