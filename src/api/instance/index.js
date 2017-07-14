import observe from './observe'
import tap from './tap'
import delay from './delay'
import error from './error'
import end from './end'
import then from './then'

export default {
    observe,
    start: observe,
    tap,
    delay,
    catch: error,
    error,
    then,
    end
}
