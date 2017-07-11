import apis from '../api/instance/index.js'

function Stream(source){
    this.source = source;
};
Stream.of = function(source){
    return new Stream(source);
};

for(let key in apis){
    if(apis.hasOwnProperty(key)){
        Stream.prototype[key] = apis[key]
    }
}

export default Stream;
