# Praan
> The same stream of life that runs through my veins night and day runs through the world and dances in rhythmic measures. 
<div style="text-align:right">-Praan</div>

praan is a Functor for reactive programming. if you like functional programming, you can use of/map/flatMap/flat/ap as you like, and all the function will return a new stream.

you can associate a stream with an array that expose it's element at the right time. for example, a stream of [1,2,3,4] is an array expose 1,2,3,4 immediately. and a stream of user input is an array that expose a data when user input a value.

you can observe a stream `stream.observe(fn)`, and `fn` will be call every time there is a value in the stream to be exposed.
## Install
```shell
npm install praan
```

```javascript
// es6 
import praan from 'praan';

// es5
var praan = require('praan');
```

## example

```javascript
var stream = praan.of([1,2,3,4]);
    .map(item=>item+1);
stream.observe(console.info);   // 1,2,3,4

// start and end
praan.start("let's")
    repeat('dance', 1000)
    .end(3001)
// let's dance dance dance

/**
 * promise
 */
praan.fromPromise(Promise.resolve('praan'));

/**
 * ui event
 */
praan.fromEvent('input', input)

/**
 * customer event
 */
var stream = praan.of();
emitter.on('data', stream.recieve);
setTimeout(_=>emitter.trigger('data',{name:'praan'}),1000);
stream.observe(console.info);
// -----praan----
```







