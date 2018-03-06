# x-base-32 [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

> base32 encoding and decoding that optimizes byte size based on input characters and supports unicode.

## Installation

```sh
$ npm install --save x-base-32
```

## Usage

```js
const xBase32 = require('x-base-32');

xBase32.decode(xBase32.encode('🦁🐯🐻'));
// => 🦁🐯🐻

xBase32.encode('Lions and tigers and bears!');
// => 89hmpyvkk41gpws10ehmpesbjecg62vk441h6arbjecgg7
xBase32.encode('אריות ונמרים ודובים!');
// => bq8bt5v6xbfa0gbndw2xxf8qcvq842xbekqavmdv6xt116
xBase32.encode('الأسود والنمور والدببة!');
// => brkwh64f37j8rqg86932fj4s3che933210s4c9y8k2zh8rmca844b
xBase32.encode('獅子，老虎和熊！');
// => ged2npm7z1j0031jeaj6732qz047
xBase32.encode('Львы и тигры и медведи!');
// => bgdrk46a4p10gw0848a3h1kh08jr423g10gy8dc6j351ngt8e0445
xBase32.encode('ライオンとトラとクマ！');
// => g63mk191gn8rf6c3863431t9gd0rayc6yzw0gs
xBase32.encode('🦁🐯🐻');
// => gv0zdv0er7qe2zp1xvgxg3

// Ignores invalid symbols during decoding
xBase32.decode('gv0z-dv0e-r7qe-2zp1-xvgx-g3');
// => 🦁🐯🐻
```

## Scheme Requirements

* Humans can accurately transmit the symbols to other humans using a telephone.
  * Only use numeric and lowercase alpha characters: `[0-9]`, `[a-h]`, `j`, `k`, `m`, `n`, `[p-t]`, `[v-z]`
  * Re-map certain error-prone characters when they are provided for decoding:
    ```
    i -> 1
    I -> 1
    l -> 1
    L -> 1
    o -> 0
    O -> 0
    ```
  * Ignore all other characters providing during decoding
* [URI :: Path](https://tools.ietf.org/html/rfc3986#section-3.3) safe
* Case Insensitive File System safe
* Support the full 21-bit Unicode character set
* Append a check digit for validating data integrity

## TODO

* [] Accept a `Buffer`
* [] Provide a demo page

## License

ISC © [Buster Collings](https://about.me/buster)

[npm-image]: https://badge.fury.io/js/x-base-32.svg
[npm-url]: https://npmjs.org/package/x-base-32
[travis-image]: https://travis-ci.org/busterc/x-base-32.svg?branch=master
[travis-url]: https://travis-ci.org/busterc/x-base-32
[daviddm-image]: https://david-dm.org/busterc/x-base-32.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/busterc/x-base-32
[coveralls-image]: https://coveralls.io/repos/busterc/x-base-32/badge.svg
[coveralls-url]: https://coveralls.io/r/busterc/x-base-32
