import Sink from '../Sink/Sink'

const emptyFunc = function(){}

// Source.map(function(next, value, scheduler){
//     value = ...
//     next.event(value, scheduler)
// })

function foo(fn){
    return next => Sink.of((value, time, scheduler) => fn(value, time, next, scheduler))
}


export default function reInitSink(sinkArr){
    let len = sinkArr.length;
    let next = emptyFunc
    for(var i=len-1; i>=0; i--){
        next = foo(sinkArr[i])(next);
    }
    return next;
}