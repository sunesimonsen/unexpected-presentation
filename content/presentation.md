## Unexpected

---

Started in 2013 as an experiment.

Developed heavily ever since.

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

## Syntax matters

before_software_can_be_reusable_it_first_has_to_be_usable<br>
before.software.can.be.reusable.it.first.has.to.be.usable<br>
beforeSoftwareCanBeReusableItFirstHasToBeUsable<br>
Before software can be reusable it first has to be usable.

– Ralph Johnson.

Note: let's just get the syntax out of the way before we are get started.

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

A nice side-effect of using strings:

```js
expect(42, 'to not be', 24);
```

```output
Unknown assertion 'to not be', did you mean: 'not to be'
```

===

## Context is important

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
expect(sune, 'to satisfy', { fullName: 'Simonsen, Sune Sloth' });
```

```output
expected Person({ names: [ 'Sune', 'Sloth', 'Simonsen' ] })
to satisfy { fullName: 'Simonsen, Sune Sloth' }
 
Person({
  names: [ 'Sune', 'Sloth', 'Simonsen' ],
  fullName: 'Sune Sloth Simonsen' // should equal 'Simonsen, Sune Sloth'
                                  // - Sune Sloth Simonsen
                                  // + Simonsen, Sune Sloth
})
```

===

## Being precise makes a difference

---

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

We even diff buffers:

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

Note: notice that we just use 'to equal'.

===

## Invalidate best practices

---

> There should only be one assertion per test!


---

> A single assert per unit test is a great way to test the reader's ability to
> scroll up and down.

Note: Not everyone agrees

---

> A test should be concise and readable.

---

Assert on sub-trees of a object hierarchy:

```js
var sune = { names: ['Sune', 'Simonsen'], gender: 'male' };
expect(sune, 'to satisfy', { names: ['Sune', 'Simonsen'], age: 35 });
```

```output
expected { name: 'Sune Simonsen', gender: 'male' }
to satisfy { name: 'Sune Simonsen', age: 35 }

{
  names: ['Sune', 'Simonsen'],
  gender: 'male',
  age: undefined // should equal 35
}
```

Note: we can state multiple requirements for an object
Note: notice that is no requirement for gender

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

===

## The world is not sequential

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

## Plugins

---

### Testing with fakes

---

```js
function Account(amount) {
  var that = this;
  that.deposit = function (amount) { /*...*/ };
  that.withdraw = function (amount) { /*...*/ };
  that.transferTo = function (amount, currency, destinationAccount) {
    that.withdraw(amount);
    destinationAccount.deposit(amount);
  };
}
```

---

```js
var srcAccount = new Account();
var destAccount = new Account();

var sinon = require('sinon');
sinon.spy(srcAccount, 'withdraw');
sinon.spy(destAccount, 'deposit');

srcAccount.transferTo(250, 'dkk', destAccount);
```

---

```js
expect.use(require('unexpected-sinon'));

expect([srcAccount.withdraw, destAccount.deposit],
       'to have calls satisfying', [
  { spy: srcAccount.withdraw, args: [ { amount: 250, currency: 'dkk' } ]},
  { spy: destAccount.deposit, args: [ { amount: 250, currency: 'dkk' }  ] }
]);
```

---

```output
expected [ withdraw, deposit ] to have calls satisfying
[
  { spy: withdraw, args: [ { amount: 250, currency: 'dkk' } ] },
  { spy: deposit, args: [ { amount: 250, currency: 'dkk' } ] }
]
 
[
  withdraw(
    250 // should equal { amount: 250, currency: 'dkk' }
  ) at Account.that.transferTo (evalmachine.<anonymous>:11:10)
    
  deposit(
    250 // should equal { amount: 250, currency: 'dkk' }
  ) at Account.that.transferTo (evalmachine.<anonymous>:12:24)
]
```


<!--

* extensibily - everything in unexpected is build from the same tool provided to
you
* assertions scoped by type
* planing to support real polymorphism

* Maybe moment case study

-->

