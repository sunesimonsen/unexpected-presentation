## Unexpected

#### The extensible assertion library

Note: What is Unexpected? Unexpected is an assertion library like Chai, expect.js or should.js.
But is also very different as you will see during the presentation.

---

Started in 2013 as an experiment.

Note: Unexpected started at One.com. At the time we were using expect.js. A
former colleague of mine, Morten Siebuhr, tried to use expect.js for a test
suite with several thousands assertions and concluded that is was way too slow.
I tried to investigate what was going on, and found out that each `expect` would
create 84 assertion instances. I though I could do a better job. That was
the start of Unexpected.

---

Used by One.com from v1.0.4<br>
and is used for all JavaScript testing now.

Note: Andreas Lind known for AssetGraph, quickly endorsed the project and
started contributing, if it wasn't for him the project would never have left the
ground. Today it is a split effort between Andreas and me.

---

Unexpected is starting to be used by other companies.

---

A small but very active and helpful community.

Find [Gitter](https://gitter.im/unexpectedjs/unexpected) and
[Github](https://github.com/unexpectedjs/unexpected) links on
[http://unexpected.js.org](http://unexpected.js.org).

Note: Daily activity, get your questions answered immediately.

---

We have great documentation!

http://unexpected.js.org

---

Many plugins that cover most functionality.

===

## Syntax matters

<small>
programs_should_be_written_for_people_to_read_and_only_incidentally_for_machines_to_execute<br>
programs.should.be.written.for.people.to.read.and.only.incidentally.for.machines.to.execute<br>
programsShouldBeWrittenForPeopleToReadAndOnlyIncidentallyForMachinesToExecute<br>
Programs should be written for people to read, and only incidentally for machines to execute. 
</small>

— Abelson and Sussman

Note: let's just get the syntax out of the way before we are get started.

---

Assertions are just text - feel free to express yourself.

```js#evaluate:false
expect(obj, 'to have keys', 'foo', 'bar');
```

---

Especially important when you are doing complicated stuff:

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

Note: One important theme of Unexpected is to show as much relevant information as possible.

---

```js
function Person() {
  this.names = Array.prototype.slice.call(arguments);
  Object.defineProperty(this, 'fullName', {
    get: function () {
      return this.names.join(' ');
    }
  });
}

var sune = new Person('Sune', 'Sloth', 'Simonsen');
```

Note: what happens if we expect full name to start with the family name?

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
                                  // -Sune Sloth Simonsen
                                  // +Simonsen, Sune Sloth
})
```

Note: you will have all the information you need without even opening the test.

===

## Being precise makes a difference

Note: We try to make our error messages as descriptive as possible.

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

Note: Colors is a big part of highlighting a problem to the user. We support
colors in both the console and the browser from mocha v2.3.0.

Note: We provide diffs for most things.

---

We even diff buffers:

```js
expect(new Buffer('wat?', 'utf-8'),
       'to equal',
       new Buffer('what?', 'utf-8'));
```

```output
expected Buffer([0x77, 0x61, 0x74, 0x3F])
to equal Buffer([0x77, 0x68, 0x61, 0x74, 0x3F])

-77 61 74 3F                                      │wat?│
+77 68 61 74 3F                                   │what?│
```

Note: notice that we just used 'to equal'.

---

Generally we try to be as helpful as possible:

```js
expect('Hello ugly world!', 'not to match', /ugly/);
```

```output
expected 'Hello ugly world!' not to match /ugly/

Hello ugly world!
      ^^^^
```

===

## Invalidates best practices

Note: I like to think that Unexpected changes the way you write tests.

Note: People generally has strong opinions about testing.

---

> There should only be one assertion per test!


---

> A single assert per unit test is a great way to test the reader's ability to
> scroll up and down.


Note: Not everyone agrees

---

> A test should be concise and readable.


---

Match your object hierarchy against a specification:

```js
var sune = { name: 'Sune', gender: 'mail', age: 35, children: 2 };

expect(sune, 'to satisfy', {
  name: /.+/,
  age: expect.it('to be positive'),
  gender: /male|female/
});
```

Note: we can state multiple requirements for an object.

Note: notice that is no requirement for the `children` property.

Note: this of cause nests arbitrarily.

---

```output
expected { name: 'Sune', gender: 'mail', age: 35, children: 2 } to satisfy
{
  name: /.+/,
  age: expect.it('to be positive'),
  gender: /male|female/
}

{
  name: 'Sune',
  gender: 'mail', // should match /male|female/
  age: 35,
  children: 2
}
```

===

## The world is not sequential

Note: Mocha provides a feature where you can make a test asynchronous by
returning a promise. Unexpected supports this model everywhere.

---

Asynchronous assertions:

```js#evaluate:false
it('saves a magicpen image with correct metadata', function () {
  return expect(
    'magic-pen-6-colours.jpg',
    'to have metadata satisfying', {
      format: 'JPEG',
      'Channel Depths': { Gray: '8 bits' },
      size: { width: 200, height: 400 }
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

Note: this is where we left the competition in the dust :-)

===

## Extensible from the ground up

Note: Unexpected is build from an extensible core and all the types and
assertion provided by core, is build on the same API's that will be available to
you as a plugin developer.

---

### Adding assertions

---

```js
var arr = [1, 2, 3];

expect(arr, 'to equal', [].concat(arr).sort());
```

---

```js
expect.addAssertion('<array> to be sorted <function?>',
                    function (expect, arr, cmp) {
  expect(arr, 'to equal', [].concat(arr).sort(cmp));
});
```

---

```js
expect([1, 2, 3], 'to be sorted');
expect([3, 2, 1], 'to be sorted', function (a, b) {
  return b - a;
});
```

---

```js
expect([2, 1, 3], 'to be sorted');
```

```output
expected [ 2, 1, 3 ] to be sorted

[
  2, // should equal 1
  1, // should equal 2
  3
]
```

Note: Notice how I didn't specify how the output should be. It is of cause very
possible to make completely custom output, but it is usually not necessary.

Note: The provided diff will state why the array is not sorted.

---

### Adding types

Note: this wouldn't be very powerful if we could not provide new types.

---

```js
var moment = require('moment');
expect(moment(31337), 'to equal', moment(1337));
```

---

```output
expected
Moment({
  _isAMomentObject: true,
  _i: 31337,
  _isUTC: false,
  _locale: Locale({
    _ordinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal: function (number) {
      var b = number % 10,
        output = (toInt(number % 100 / 10) === 1) ? 'th' :
        (b === 1) ? 'st' :
        (b === 2) ? 'nd' :
        (b === 3) ? 'rd' : 'th';
      return number + output;
    },
    _abbr: 'en',
    _ordinalParseLenient: /\d{1,2}(th|st|nd|rd)|\d{1,2}/
  }),
  _d: new Date('Thu, 01 Jan 1970 00:00:31.337 GMT')
})
to equal
Moment({
  _isAMomentObject: true,
  _i: 1337,
  _isUTC: false,
  _locale: Locale({
    _ordinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal: function (number) {
      var b = number % 10,
        output = (toInt(number % 100 / 10) === 1) ? 'th' :
        (b === 1) ? 'st' :
        (b === 2) ? 'nd' :
        (b === 3) ? 'rd' : 'th';
      return number + output;
    },
    _abbr: 'en',
    _ordinalParseLenient: /\d{1,2}(th|st|nd|rd)|\d{1,2}/
  }),
  _d: new Date('Thu, 01 Jan 1970 00:00:01.337 GMT')
})

Moment({
  _isAMomentObject: true,
  _i: 31337, // should equal 1337
  _isUTC: false,
  _locale: Locale({
    _ordinalParse: /\d{1,2}(th|st|nd|rd)/,
    ordinal: function (number) {
      var b = number % 10,
        output = (toInt(number % 100 / 10) === 1) ? 'th' :
        (b === 1) ? 'st' :
        (b === 2) ? 'nd' :
        (b === 3) ? 'rd' : 'th';
      return number + output;
    },
    _abbr: 'en',
    _ordinalParseLenient: /\d{1,2}(th|st|nd|rd)|\d{1,2}/
  }),
  _d: new Date('Thu, 01 Jan 1970 00:00:31.337 GMT') // should equal new Date('Thu, 01 Jan 1970 00:00:01.337 GMT')
})
```

---

```js
expect.addType({
  name: 'moment',
  base: 'object',
  identify: function (v) { return v && moment.isMoment(v); },
  inspect: function (v, depth, output) {
      output.jsFunctionName('moment').text('(')
            .jsPrimitive(v.toISOString()).text(')');
  },
  equal: function (a, b) { return a.isSame(b); },
  diff: function (actual, expected, output, diff) {
      return diff(actual.toISOString(), expected.toISOString());
  }
});
```

---

```js
expect(moment(31337), 'to equal', moment(1337));
```

```output
expected moment(1970-01-01T00:00:31.337Z)
to equal moment(1970-01-01T00:00:01.337Z)

-1970-01-01T00:00:31.337Z
+1970-01-01T00:00:01.337Z
```

---

#### Almost anything is possible

Create plugins that extends unexpected with new types, assertions, styles and themes.

===

## unexpected-sinon
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
  ) at Account.that.transferTo (content/presentation.md:510:10)
  deposit(
    250 // should equal { amount: 250, currency: 'dkk' }
  ) at Account.that.transferTo (content/presentation.md:511:24)
]
```

===

## Questions

===

## The end

Stickers for everybody :-)
