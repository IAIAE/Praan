import Praan from '../src/index'

Praan.periodic(1000, 123)
    .map(data => data + 1)
    .delay(567)
    .observe(console.info);

// Praan.of(1)
//     .tap(console.info)
//     .map(data => data * 2)
//     .observe(console.info)
