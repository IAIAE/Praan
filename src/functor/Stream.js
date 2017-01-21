function Stream(source){
    this.__value = source;
};
Stream.of = function(source){
    return new Stream(source);
};


export default Stream;