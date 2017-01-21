import Stream from '../../functor/Stream.js'
import Just from '../../functor/Just.js'

export function of(data){
    return Stream.of(Just.of(data));
}
