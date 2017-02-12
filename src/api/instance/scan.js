import Stream from '../../Functor/Stream.js'
import Sink from '../../Functor/Sink/Sink'

export default function scan(reducer, seed){
    let init = seed;
    return Stream.of(this.source.map(function(value, time, nextSink, scheduler, task){
            init = reducer(init, value);
            nextSink.event(init, time, scheduler, task)
        }
    ));
}
