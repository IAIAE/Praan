import Stream from '../../Functor/Stream.js'
import Just from '../../Functor/Headspring/Just'
import FromArray from '../../Functor/Headspring/FromArray'
import FromPromise from '../../Functor/Headspring/FromPromise'
import Empty from '../../Functor/Headspring/Empty'

function getType(data){
    if(Array.isArray(data) && data.length > 0) return 'array'
    else if(typeof data === 'object' && typeof data.then === 'function') return 'promise'
    else if(data == null || (Array.isArray(data) && data.length === 0)) return 'empty'
    else return 'normal'
}

export default function of(data){
    switch(getType(data)){
        case 'array':
            return Stream.of(FromArray.of(data));
        case 'promise':
            return Stream.of(FromPromise.of(data));
        case 'empty':
            return Stream.of(Empty.of());
        case 'normal':
        default:
            return Stream.of(Just.of(data));
    }
}
