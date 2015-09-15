## Unexpected

---

Started in 2013 as an experiment.

---

Used by One.com from v1.0.4 and is used for all JavaScript testing now.

---

Starting to be used by other companies.

---

A small by very active and helpful community.

Meet us on [Gitter](https://gitter.im/unexpectedjs/unexpected) or
[Github](https://github.com/unexpectedjs/unexpected).

---

Many plugins that cover most functionality.

---

We have great documentation!

http://unexpected.js.org

===

## What is the purpose of testing

---

Driving out the implementation.

---

Fast feedback.

Note: Fast enough that you can run several thousand test a second.

---

Feeling confident about sub-modules.

---

Safety when refactoring.

---

API documentation.

===

## How can Unexpected make testing better

===

Context is important

---

```js
function Person(firstName, lastName) {
  this.names = Array.prototype.slice.call(arguments);
  Object.defineProperty(this, 'fullName', {
    get: function () {
      return this.names.join(' ');
    }
  });
}

var sune = new Person('Sune', 'Sloth', 'Simonsen');
```

---

```js
var expectjs = require('expect.js');
expectjs(sune.fullName).to.eql('Simonsen, Sune Sloth');
```

```output
sdf
```

<img src="content/expectjs-diff.png" alt="expect.js diff">

---

```js
expect(sune, 'to satisfy', { fullName: 'Simonsen, Sune Sloth' });
```

```output
sdf
```

===

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

Note: colors in the console and the browser from mocha v2.3.0

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

Match your object hierarchy against a specification:

```js
expect({ name: 'Sune Simonsen', gender: 'mail', age: 35 }, 'to satisfy', {
  name: /.+/, age: expect.it('to be positive'), gender: /female|male/
});
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

Note: this of cause nests arbitrarily.

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

http://unexpected.js.org/unexpected-image/

---

...and they compose:

```js#evaluate:false
it ('produces the correct png output', function () {
  return expect(
    createPngImageStream('bar.tiff'),
    'to yield output satisfying',
    expect.it('to resemble', 'bar.png', {
      mismatchPercentage: expect.it('to be less than', 10)
    }).and('to have metadata satisfying', {
      format: 'PNG'
    })
  );
});
```

http://unexpected.js.org/unexpected-stream/

Note: show some async output http://unexpected.js.org/unexpected-stream/assertions/array/when-piped-through/

===

## Syntax matters

before_software_can_be_reusable_it_first_has_to_be_usable
before.software.can.be.reusable.it.first.has.to.be.usable
beforeSoftwareCanBeReusableItFirstHasToBeUsable
Before software can be reusable it first has to be usable.

– Ralph Johnson.

---

Assertions are just text - feel free to express yourself.

```js#evaluate:false
expect(obj, 'to have keys', 'foo', 'bar');
```

---

This is especially important when you are doing more complicated stuff:

```js#evaluate:false
return expect(
  fs.createReadStream('suboptimal.png'),
  'when piped through',
  new OptiPng(['-o7']),
  'to yield output satisfying', function (optiPngBuffer) {
    expect(optiPngBuffer.length, 'to be within', 0, 152);
  }
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
* Colors in the console and the browser from mocha v2.3.0
* extensibily - everything in unexpected is build from the same tool provided to
you
* assertions scoped by type
* planing to support real polymorphism

* Maybe moment case study

-->

