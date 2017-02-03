import defaultSchedular from '../../Functor/Schedular/defaultSchedular'
import Sink from '../../Functor/Sink/Sink'

function observe(fn){
    this.source = this.source.map(function(value){
        fn(value)
    });
    this.source.sluice(defaultSchedular())
}

export default observe;
