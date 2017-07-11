function Sink(fn, err){
    this.fn = fn;
    this.err = err || defaultErr;
}
function defaultErr(e){
    console.error('depreciate!!!!!*****##### cannot go into the default err function in sink');
    return e;
}
Sink.of = function(fn, err){
    return new Sink(fn, err);
}

Sink.prototype.event = function(value, time, scheduler, task){
    this.fn(value, time, scheduler, task)
}
Sink.prototype.err = function(e){
    this.err(e);
}

export default Sink
