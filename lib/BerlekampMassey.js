/*
   Copyright 2020 Alexander Stokes

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

const GaloisFieldPolynomial = require('./GaloisFieldPolynomial');

const { Multiply, Invert, Log, Add, Divide } = require('./GaloisField');

class BerlekampMassey {
  constructor(rsSyndrome, BLOCKS_ECC) {
    this.t = GaloisFieldPolynomial.one();
    this.r = rsSyndrome;
    this.tNext = GaloisFieldPolynomial.zero();
    this.rNext = GaloisFieldPolynomial.monomial(BLOCKS_ECC, 1);
  }

  calculate() {
    if (this.r.leadingCoefficient() === 0) return true;

    const tNextNext = this.t;
    this.t = GaloisFieldPolynomial.zero().berlekampMassey(this.rNext, this.r).multiply(this.t).add(this.tNext);

    this.tNext = tNextNext;

    const rNextNext = this.r;
    this.r = this.rNext;
    this.rNext = rNextNext;

    return (this.r.degree() >= this.rNext.degree());
  }

  repair(array) {

    const inverse = Invert(this.t.constantCoefficient());

    const evaluator = this.r.multiplyByScalar(inverse);
    const zeroes = this.t.multiplyByScalar(inverse).findZeroes();

    this.t = undefined;
    this.r = undefined;
    this.tNext = undefined;
    this.rNext = undefined;

    for (let i = 0; i < zeroes.length; i++) {
      const eccPosition = array.length - Log(Invert(zeroes[i])) - 1;
      if (eccPosition < 0 || eccPosition > array.length) {
        continue;
      }

      let denominator = 1;
      for (var j = 0; j < zeroes.length; j++) {
        if (i === j) continue;
        denominator = Multiply(denominator, Add(1, Divide(zeroes[i], zeroes[j])));
      }

      array[eccPosition] ^= Divide(
        Multiply(evaluator.evaluateAt(zeroes[i]), zeroes[i]),
        denominator
      );
    }
  }
}

module.exports = BerlekampMassey;
