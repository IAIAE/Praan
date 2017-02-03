import Stream from '../../Functor/Stream.js'
import Sink from '../../Functor/Sink/Sink'

export default function tap(fn){
    return Stream.of(this.source.map(function(value, time, nextSink, scheduler){
            fn(value)
            nextSink.event(value, time, scheduler)
        }
    ));
}
