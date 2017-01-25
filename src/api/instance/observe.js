import defaultSchedular from '../../Functor/Schedular/defaultSchedular'

function observe(fn){
    this.source.run(fn, defaultSchedular())
}

export default observe;
