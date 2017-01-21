/**
 * Just is the simplest Functor that only wrap a data
 * @author  iaiae
 */

function Just(data){
    this.__value = data;
}
Just.of = function(data){
    return new Just(data);
}
export default Just