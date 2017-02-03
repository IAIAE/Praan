import Stream from '../../Functor/Stream.js'
import Just from '../../Functor/Headspring/Just'

export default function of(data){
    return Stream.of(Just.of(data));
}
