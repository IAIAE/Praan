import Stream from '../../functor/Stream.js'
import Periodic from '../../functor/Periodic.js'

function periodic(duration, value){
    return Stream.of(Periodic.of(duration, value))
}


export default periodic