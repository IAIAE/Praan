var Praan =  require('../dist/index')

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

function errPromise(){
    return Promise.reject({msg: 'reject'})
}
Praan.of(promise)
    .then(data => data + 'test')
    .then(data => Praan.of(getPromise(data)))
    .tap(_=>console.info('before delay..',_))
    .delay(3000)
    .then(data => {
        return data+1;
    })
    .then(data => Praan.of(errPromise(data)))
    .then(data => data+1)
    .then(data=> Praan.of(getPromise(data)))
    .catch(function(e){
        console.info(e)
    })
    .then(data=>{
        console.info(data)
    })
    .start()




// Praan.periodic(1000, 1)
//     .scan((seed, value) => seed+value, 0)
//     .observe(console.info)

