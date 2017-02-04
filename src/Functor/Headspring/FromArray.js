function FromArray(arr){
    this.array = arr;
    this.sinks = [function(value, time, nextSink, scheduler){
        for(var i=0,len=value.length; i<len; i++){
            nextSink.event(value[i], time, scheduler);
        }
        
    }]
}

FromArray.prototype.map = function(fn){
    let newP = FromArray.of(this.array)
    newP.sinks = this.sinks.concat([fn])
    newP._sink = reInitSink(newP.sinks);
    return newP
}

FromArray.prototype.sluice = function(scheduler){
    scheduler.atOnce
}