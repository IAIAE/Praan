import Sink from '../Sink/Sink'

const emptyFunc = function(){}
const defaultErrFunc = function(e){
    console.error('### depreciate, some error throwd and no handler catch it. the error drain to the bottom!!')
}
// Source.map(function(next, value, scheduler){
//     value = ...
//     next.event(value, scheduler)
// })

function foo(obj){
    let fn = obj.fn;
    let err = obj.err;
    return next => Sink.of(
        (value, time, scheduler, task) => fn(value, time, next, scheduler, task),
        (e, time, scheduler, task) => err(e, time, next, scheduler, task));
}


export default function reInitSink(sinkArr){
    let len = sinkArr.length;
    let next = Sink.of(emptyFunc, defaultErrFunc)
    for(var i=len-1; i>=0; i--){
        next = foo(sinkArr[i])(next);
    }
    return next;
}