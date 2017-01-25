
function method(Constructor, name, fn){
    function foo(){}
    foo.prototype.method = function(_name, _fn){
        Constructor.prototype[_name] = _fn;
        return this;
    }
    var f = new foo();
    return f.method(name, fn);
}

function sMethod(source, dist){
    for(let key in dist){
        if(dist.hasOwnProperty(key)){
            source[key] = dist[key];
        }
    }
}


export {method, sMethod}
