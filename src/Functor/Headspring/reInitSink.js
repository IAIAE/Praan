import Sink from '../Sink/Sink'

const emptyFunc = function(){}

// Source.map(function(next, value, scheduler){
//     value = ...
//     next.event(value, scheduler)
// })

function foo(fn){
    return next => Sink.of((value, time, scheduler, task) => fn(value, time, next, scheduler, task))
}


export default function reInitSink(sinkArr){
    let len = sinkArr.length;
    let next = Sink.of(emptyFunc)
    for(var i=len-1; i>=0; i--){
        next = foo(sinkArr[i])(next);
    }
    return next;
}