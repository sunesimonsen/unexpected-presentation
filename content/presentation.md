## Unexpected

---

Started in 2013 as an experiment.

---

Used by One.com from version 1.0.4 and is used for all JavaScript testing now.

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

Felling confident about sub-modules.

---

Safety when refactoring.

---

API documentation.

===

## How can Unexpected help make testing better

---

Assert on sub-trees of a object hierarchy: 

```js
var sune = { name: 'Sune Simonsen' };
expect(sune, 'to satisfy', {
  name: 'Sune Simonsen',
  age: 35
});
```

```output
expected { name: 'Sune Simonsen' }
to satisfy { name: 'Sune Simonsen', age: 35 }
 
{
  name: 'Sune Simonsen', 
  age: undefined // should equal 35
}
```

===

## Readability matters

```js#evaluate:false
expect(obj).to.have.keys('foo', 'bar');
obj.should.have.keys('foo', 'bar');
expect(obj).toHaveKeys('foo', 'bar');
expect(obj, 'to have keys', 'foo', 'bar');
```

Assertions are just text, feel free to express yourself.

---

Especially when you are doing more complicated stuff:

```js#evaluate:false
expect(
    require('fs').createReadStream('foo.png'),
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
