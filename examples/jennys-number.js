/*
   Copyright 2021 Alexander Stokes

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

const {
  GaloisField,
  GaloisFieldPolynomial,
  ReedSolomonEncoder,
  ReedSolomonDecoder
} = require('../main');

const origNumber = '8675309';

const DATA_SYMBOLS = origNumber.length;

const phoneNumber = origNumber.split('').map((that) => {
  return Number(that);
});

const ECC_BYTES = 15 - DATA_SYMBOLS;

function attempt(verbose) {

  let data = phoneNumber.slice(0);

  const rse = ReedSolomonEncoder.factory(ECC_BYTES);
  const eccBytes = rse.encode(data);

  if (verbose)
    console.log(`
# Reed-Solomon Explained

Jenny gave you her number, and considered that you might receive a
few additional more digits, just in case you had one pint too many.
`);

  const poly = GaloisFieldPolynomial.fromArray(eccBytes);

  // Select some positions to smudge

  const arrayOfPositiions = [];
  for (let l = eccBytes.length; l--;) {
    arrayOfPositiions.push(l);
  }

  for (let l = 3; l--;) {
    const selectedWrong = arrayOfPositiions.splice(Math.floor(Math.random() * arrayOfPositiions.length), 1);
    const orig = eccBytes[selectedWrong];
    while (eccBytes[selectedWrong] === orig) {
      eccBytes[selectedWrong] = Math.floor(Math.random() * 10);
    }
  }

  if (verbose)
    console.log(`
The next day, you see the crumpled napkin reads
\`\`\`
`, eccBytes.map(x => x.toString(16).toUpperCase()).join(' '), `
\`\`\``);

  if (verbose)
    console.log(`
A couple digits were witten down wrong. And that was the end of it.
A few days later, you share this sad sob story with the bartender,
and to your shock, she produces a detailed, magnificently typeset, note from Jenny.
`);

  if (verbose)
    console.log(`
Jenny goes on to explain that the number she gave is actually a polynomial
in a finite field of 16 integers, and that polynomial is specially constructed.
Jenny, tells you that the original polynomial given has zeroes at exactly
${ECC_BYTES} places, which conveniently are at exponents of A.
\`\`\`
g = poly.evaluateAt(GaloisField.Exp(i))

`);

  if (verbose)
    for (let i = 1; i < ECC_BYTES + 1; i++) {
      const g = poly.evaluateAt(GaloisField.Exp(i));
      console.log({ i, g });
    }

  if (verbose)
    console.log(`\`\`\``);

  ReedSolomonDecoder(eccBytes, ECC_BYTES);

  if (verbose)
    console.log(`
After error correction, you've got her number:
\`\`\`
`, eccBytes.slice(0, 7).join(' '), `
\`\`\``);

  if (eccBytes.slice(0, 7).join('') !== origNumber) {
    console.log('FAILED', eccBytes.slice(0, 7).join(''));
  }

}

for (let l = 255 * 255; l--;) {
  attempt(false);
}

attempt(true);
