import Praan from '../src/index'

// Praan.periodic(1000, 123)
//     .map(data => data + 1)
//     .delay(567)
//     .observe(console.info);

// Praan.of(1)
//     .tap(console.info)
//     .map(data => data * 2)
//     .observe(console.info)

// Praan.of([1,2,3,4])
//     .map(data=>data+1)
//     .observe(console.info)

var promise = new Promise(function(done, notDone){
    setTimeout(_=>done('hello '), 1000);
});
function getPromise(value){
    return new Promise(function(done, notDone){
        done(value + ' promise');
    })
}
Praan.of(promise)
    .map(data => data + 'test')
    .flatMap(data => Praan.of(getPromise(data)))
    .delay(3000)
    .map(data => 'prefix' + data)
    .flatMap(data => Praan.of(getPromise(data)))
    .flatMap(data => data+1)
    .observe(console.info)

