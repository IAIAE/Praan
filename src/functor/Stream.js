function Stream(source){
    this.source = source;
};
Stream.of = function(source){
    return new Stream(source);
};


export default Stream;
