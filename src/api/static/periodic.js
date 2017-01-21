import Stream from '../../Functor/Stream.js'
import Periodic from '../../Functor/Headspring/Periodic.js'

function periodic(duration, value){
    return Stream.of(Periodic.of(duration, value))
}


export default periodic
