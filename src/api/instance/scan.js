/**
 * already no use
 * @iaiae 2017-07-14
 */

import Stream from '../../Functor/Stream.js'
import Sink from '../../Functor/Sink/Sink'

export default function scan(reducer, seed){
    let init = seed;
    return Stream.of(this.source.map({
        fn: function(value, time, nextSink, scheduler, task){
            init = reducer(init, value);
            nextSink.event(init, time, scheduler, task)
        },
        err: function(e, nextSink){
            nextSink.err(e);
        }
    }));
}
