
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