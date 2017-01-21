import Stream from './Stream.js'

function Periodic(duration, value) {
    this.duration = duration;
    this.value = value;
}
Periodic.of = function(duration, value){
    return new Periodic(duration, value);
}


Periodic.prototype.run = function(sink, scheduler){

}

export default Periodic;
