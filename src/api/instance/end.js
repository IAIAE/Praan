import defaultSchedular from '../../Functor/Schedular/defaultSchedular'
import Sink from '../../Functor/Sink/Sink'

function end(fn, err){
    this.source = this.source.map({
        fn: function(value){
            fn(value)
        },
        err: function(e){
            err(e)
        }
    });
    this.source.sluice(defaultSchedular())
}

export default end;
