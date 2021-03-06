/**
 * already no use
 * @iaiae 2017-07-14
 */

import Stream from '../../Functor/Stream.js'
import Sink from '../../Functor/Sink/Sink'

export default function flatMap(fn) {
    return Stream.of(this.source.map({
        fn: function(value, time, nextSink, scheduler, task) {
            try {
                var mapedValue = fn(value);
            } catch (e) {
                return nextSink.err({ msg: 'flatMap error', err: e });
            }
            
            if(mapedValue === undefined) return; //if no return, means you don't wanna go on.

            if (mapedValue instanceof Stream) {
                mapedValue.end(function (_value) {
                    nextSink.event(_value, time, scheduler, task)
                }, function(err){
                    nextSink.err(err)
                })
            } else {
                console.error('flatMap error:: value: `' + value + '` is not a Stream. use map instead.');
                nextSink.event(mapedValue, time, scheduler, task)
            }
        },
        err: function(e, nextSink){
            nextSink.err(e);
        }
    }));
}

