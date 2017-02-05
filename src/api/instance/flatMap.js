import Stream from '../../Functor/Stream.js'
import Sink from '../../Functor/Sink/Sink'

export default function flatMap(fn){
    return Stream.of(this.source.map(function(value, time, nextSink, scheduler, task){
        var mapedValue = fn(value);
        if(mapedValue instanceof Stream){
            mapedValue.observe(function(_value){
                nextSink.event(_value, time, scheduler, task)
            })
        }else{
            console.error('flatMap error:: value: `'+value+'` is not a Stream');
            nextSink.event(mapedValue, time, scheduler, task)
        }
    }));
}

