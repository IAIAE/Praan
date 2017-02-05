import Stream from '../../Functor/Stream.js'
import Sink from '../../Functor/Sink/Sink'

export default function map(fn){
    return Stream.of(this.source.map(function(value, time, nextSink, scheduler, task){
        nextSink.event(fn(value), time, scheduler, task)
    }));
}

