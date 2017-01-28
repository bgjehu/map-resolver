# map-resolver

[![NPM Version][npm-image]][npmjs-url]
[![NPM Downloads][downloads-image]][npmjs-url]
[![Node.js Version][node-version-image]][node-version-url]
[![Build Status][travis-image]][travis-url]
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/8e7d0525320c412f98bf2de06b460c99)](https://www.codacy.com/app/bgjehu/map-resolver?utm_source=github.com&utm_medium=referral&utm_content=bgjehu/map-resolver&utm_campaign=Badge_Coverage)

Let you pass a map and return a resolver to resolve for value later

## Installation

```sh
$ npm install map-resolver
```

## API

```js
const mapResolver = require('map-resolver');
const map = {
    '@': () => req.body,
    ':': () => req.params,
    '?': () => req.query,
    '*': () => process.env,
    '#': () => req.cookies
};
const resolve = mapResolver(map);
const id = resolve('@', 'id');    //  id = req.body.id
const name = resolve(':0');    //  id = req.params[0]
const sid = resolve('?session.id');    //  sid = req.query.session.id
```

### mapResolver(map)
- `map` must be an filled `object`
- `key` should be a `string`, used as a flag, tells `resolver` which `function` to call
- `value` must be a `function` that returns an `object`, `array` or `undefined`
- return `resolver: (string[, string]) => any` A `function` you call to resolve with flag and id for value. 

#### resolver(flag[, id][, useDotNotation = true])
- `flag` must be a `string` and matches flags in the `map`
- `id` is an optional `string` tells resolver what to resolve
- `useDotNotation` is an optional `boolean` indicates if id should be treat as dot notation

## Example

```js
const mapResolver = require('map-resolver');

var req = {};
const constants = {
    'maxThread': 3
};

const map = {
    '...': () => req.body,
    ':': () => req.params,
    '?': () => req.query,
    '*': () => process.env,
    '#': () => req.cookies,
    '定': () => constants,
};

const resolve = mapResolver(map);


req = {
    body: {
        'app.name': 'MP'
    },
    params: ['express', 'middleware'],
    query: {
        session: {
            id: '123'
        }
    }
};

process.env.YEAR = '2017';

console.log(resolve('...app.name', null, false));   //  'MP'
console.log(resolve(':1'));                         //  middleware
console.log(resolve('?session.id', null, true));    //  '123'
console.log(resolve('*', 'YEAR'));                  //  '2017'
console.log(resolve('#', 'id'));                    //  undefined;
console.log(resolve('定maxThread'));                //  3
```

### [MIT Licensed](LICENSE)

[npm-image]: https://img.shields.io/npm/v/map-resolver.svg
[npmjs-url]: https://npmjs.org/package/map-resolver
[downloads-image]: https://img.shields.io/npm/dm/map-resolver.svg
[node-version-image]: https://img.shields.io/node/v/map-resolver.svg
[node-version-url]: https://nodejs.org/en/download
[travis-image]: https://img.shields.io/travis/bgjehu/map-resolver/master.svg
[travis-url]: https://travis-ci.org/bgjehu/map-resolver
