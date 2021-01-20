
# Reed-Solomon Explained

Jenny gave you her number, and considered that you might receive a
few additional more digits, just in case you had one pint too many.


The next day, you see the crumpled napkin reads
```
 7 6 7 4 3 0 9 9 5 4 4 0 9 E E
```

A couple digits were witten down wrong. And that was the end of it.
A few days later, you share this sad sob story with the bartender,
and to your shock, she produces a detailed, magnificently typeset, note from Jenny.

She refrences her github library.

## Back to the original problem
Jenny goes on to explain that the number she gave is actually a polynomial
in a finite field of 16 integers, and that polynomial is specially constructed.
Jenny, tells you that the original polynomial given has zeroes at exactly
8 places, which conveniently are at exponents of A.

```
g = poly.evaluateAt(GaloisField.Exp(i))


{ i: 1, g: 0 }
{ i: 2, g: 0 }
{ i: 3, g: 0 }
{ i: 4, g: 0 }
{ i: 5, g: 0 }
{ i: 6, g: 0 }
{ i: 7, g: 0 }
{ i: 8, g: 0 }
```

After error correction, you've got her number:
```
 8 6 7 5 3 0 9
```

## Jenny's gist after running examples/four.js

This polynomial was corrupted in one place.
```
 0 D 1 5
```

LaTeX can represent this original (flawed) polynomial:

![\text{D}_{16}a^2 + \text{1}_{16}a + \text{5}_{16}](https://raw.githubusercontent.com/stokes91/reed-solomon-noobs/main/resources/D15.png)

We evaluate it at differing exponents of A.

```
g = poly.evaluateAt(GaloisField.Exp(i))


{ i: 0, g: '0x6' }
{ i: 1, g: '0x5' }
{ i: 2, g: '0xe' }
```

If this were error-free, all of our evaluated values of g would equal zero.
In academia, these evaluated values are collectively called the error syndrome.
Given these results, it is possible to determine which symbol is wrong.

Indeed, it's possible in to index every possible collection of these
error syndromes, and map it to the correct value. But, we'll skip ahead
to the method used in the real world.

We begin with two polynomials, the rLast is the error syndrome.
Meanwhile, r is a monomial, and the degree is set to the number of error correction symbols.

```
/*
  t: '0',
  r: ![\text{1}_{16}a^3](https://raw.githubusercontent.com/stokes91/reed-solomon-noobs/main/resources/1A3.png)
  rLast: ![\text{E}_{16}a^2 + \text{5}_{16}a + \text{6}_{16}](https://raw.githubusercontent.com/stokes91/reed-solomon-noobs/main/resources/E56.png)
*/
```

We'll find last nonzero remainder of the long division of these two polynomials.

```
const degreeDiff = r.degree() - rLast.degree();
// 1

const scale = Divide(r.leadingCoefficient(), rLast.leadingCoefficient());
// 3

t.add(GaloisFieldPolynomial.monomial(degreeDiff, scale));
// t.add(GaloisFieldPolynomial.monomial(1, 3))

r.add(rLast.copy().multiplyByScalar(scale).shift(degreeDiff));
// r.add(rLast.copy().multiplyByScalar(3).shift(1))

/*
  t: ![\text{3}_{16}a](https://raw.githubusercontent.com/stokes91/reed-solomon-noobs/main/resources/3A.png)
  r: ![\text{F}_{16}a^2 + \text{A}_{16}a](https://raw.githubusercontent.com/stokes91/reed-solomon-noobs/main/resources/FAA.png)
  rLast: ![\text{E}_{16}a^2 + \text{5}_{16}a + \text{6}_{16}](https://raw.githubusercontent.com/stokes91/reed-solomon-noobs/main/resources/E56.png)
*/

const degreeDiff = r.degree() - rLast.degree();
// 0

const scale = Divide(r.leadingCoefficient(), rLast.leadingCoefficient());
// 2

t.add(GaloisFieldPolynomial.monomial(degreeDiff, scale));
// t.add(GaloisFieldPolynomial.monomial(0, 2))

r.add(rLast.copy().multiplyByScalar(scale).shift(degreeDiff));
// r.add(rLast.copy().multiplyByScalar(2).shift(0))

/*
  t: '![\text{3}_{16}a + \text{2}_{16}](https://raw.githubusercontent.com/stokes91/reed-solomon-noobs/main/resources/32A.png)'
  r: '![\text{C}_{16}](https://raw.githubusercontent.com/stokes91/reed-solomon-noobs/main/resources/C16.png)'
*/
```

If the calculate step runs more than once, ErrorCorrectingAlgorithm.js:34 wouldn't multiply
the error finding polynomial by the identity, and add zero.

But at this point, r's degree is zero, and we don't need to iterate further.

We'll divide both polynomials by t's constant coefficient. The constant coefficient for t is 0x2.
The so the inverse, 0x9, is multiplied with both t and r. t becomes the error locating polynomial, and
r becomes an error correcting polynomial.

```
/*
 errorLocator: \text{4}_{16}a + \text{9}_{16}
 errorCorrect: \text{3}_{16}
*/
```

The error locator has zeroes, which are found by evaluating until the number of results equals the
polynomial's degree, here, one. At a = 0xF, the errorLocator evaluates to zero.

errorPosition = array.length - Log(Invert(0xF)) - 1

Last, error correct the original array by XORing 0x0 at [0] with 0x4.


```
[ 4, D, 1, 5 ]
```