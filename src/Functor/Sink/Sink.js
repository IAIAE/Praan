function Sink(fn){
    this.fn = fn;
}

Sink.of = function(fn){
    return new Sink(fn);
}

Sink.prototype.event = function(value, time, scheduler){
    this.fn(value, time, scheduler)
}

export default Sink
