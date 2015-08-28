## Unexpected

---

Started in 2013 as an experiment.

---

Used by One.com from v1.0.4 and is used for all JavaScript testing now.

---

Starting to be used by other companies.

---

A small by very active community.

---

Many plugins that cover most functionality.

---

Great documentation!

http://unexpected.js.org

===

## What is the purpose of testing

---

Driving out the implementation.

---

Fast feedback.

---

Feeling confident about sub-modules.

---

Safety when refactoring.

---

API documentation.

===

## How can Unexpected make testing better

---

Awesome output

```js
expect([ 0, 1, 2, 4, 5], 'to equal', [ 1, 2, 3, 4]);
```

```output
expected [ 0, 1, 2, 4, 5 ] to equal [ 1, 2, 3, 4 ]

[
  0, // should be removed
  1,
  2,
  // missing 3
  4,
  5 // should be removed
]
```

---

...more awesome output

```js
expect(
  new Buffer('wat?', 'utf-8'),
  'to equal',
  new Buffer('what?', 'utf-8')
);
```

```output
expected Buffer([0x77, 0x61, 0x74, 0x3F])
to equal Buffer([0x77, 0x68, 0x61, 0x74, 0x3F])

-77 61 74 3F                                      │wat?│
+77 68 61 74 3F                                   │what?│
```

---

Assert on sub-trees of a object hierarchy: 

```js
var sune = { name: 'Sune Simonsen', gender: 'male' };
expect(sune, 'to satisfy', { name: 'Sune Simonsen', age: 35 });
```

```output
expected { name: 'Sune Simonsen', gender: 'male' }
to satisfy { name: 'Sune Simonsen', age: 35 }

{
  name: 'Sune Simonsen',
  gender: 'male',
  age: undefined // should equal 35
}
```

---

Asynchronous assertions:

```js#evaluate:false
it('saves a magicpen image with correct metadata', function () {
  return expect(
    'magic-pen-6-colours.jpg',
    'to have metadata satisfying', {
      format: 'JPEG',
      'Channel Depths': { Gray: '8 bits' },
      size: { height: 400, width: 200 }
    }
  });
});
```

---

...and they compose:

```js#evaluate:false
it('produces a smaller file when run with -o7 on a suboptimal PNG', () => {
  return expect(
    fs.createReadStream(Path.resolve(__dirname, 'suboptimal.png')),
    'when piped through',
    new OptiPng(['-o7']),
    'to yield output satisfying', function (optiPngBuffer) {
      expect(optiPngBuffer.length, 'to be within', 0, 152);
    }
  );
});
```

Note: show some async output http://localhost:3000/site-build/assertions/string/when-piped-through/

===

## Syntax matters

---

Assertions are just text - feel free to express yourself.

```js#evaluate:false
expect(obj, 'to have keys', 'foo', 'bar');
```

---

This is especially important when you are doing more complicated stuff:

```js#evaluate:false
expect(
  fs.createReadStream('foo.png'),
  'to yield output satisfying',
  expect.it('to resemble', 'bar.png', {
    mismatchPercentage: expect.it('to be less than', 10)
  }).and('to have metadata satisfying', {
    format: 'PNG'
  })
);
```

---

A nice side effect of using strings:

```js
expect(42, 'to not be', 24);
```

```output
Unknown assertion 'to not be', did you mean: 'not to be'
```


<!--

* Async assertions with composability
* Colors in the console and the browser from mocha v3.0.0
* extensibily - everything in unexpected is build from the same tool provided to
you
* assertions scoped by type
* planing to support real polymorphism

-->

