import Stream from '../../Functor/Stream.js'
import Sink from '../../Functor/Sink/Sink'

export default function map(fn) {
    return Stream.of(this.source.map({
        fn: function(value, time, nextSink, scheduler, task) {
            let _value;
            try {
                _value = fn(value)
            } catch (e) {
                return nextSink.err(e);
            }
            (_value!==undefined) && nextSink.event(_value, time, scheduler, task)
        },
        err: function (e, nextSink) {
            nextSink.err(e);
        }
    }));
}

