import Stream from '../../functor/Stream.js'

export function map(fn){
    return Stream.of(this.__value.of(fn(this.__value.__value)))
}
