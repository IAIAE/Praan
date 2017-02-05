function Sink(fn){
    this.fn = fn;
}

Sink.of = function(fn){
    return new Sink(fn);
}

Sink.prototype.event = function(value, time, scheduler, task){
    this.fn(value, time, scheduler, task)
}

export default Sink
