import Stream from './Functor/Stream.js';
import {sMethod} from './util'

// static
import periodic from './api/static/periodic'
import of from './api/static/of'

function Praan(){}

sMethod(Praan, {
    of,
    periodic
});

export default Praan
