import defaultSchedular from '../../Functor/Schedular/defaultSchedular'
import Sink from '../../Functor/Sink/Sink'

function observe(fn){
    this.source = this.source.map({
        fn: function(value){
            fn && fn(value)
        },
        err: function(e, nextSink){
            nextSink.err(e);
        }
    });
    this.source.sluice(defaultSchedular())
}

export default observe;
