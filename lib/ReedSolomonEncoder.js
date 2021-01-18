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

const { Multiply, Add } = require('./GaloisField');

class ReedSolomonEncoder {
  encode(array) {
    const output = new Array(array.length + this.coefficients.length);

    for (let l = array.length; l--;) {
      output[l] = array[l];
    }

    const ecc = new Array(this.coefficients.length).fill(0);

    for (let i = 0; i < array.length; i++) {
      ecc.push(0);
      const factor = Add(array[i], ecc.shift());
      for (var j = 0; j < this.coefficients.length; j++)
        ecc[j] = Add(ecc[j], Multiply(this.coefficients[j], factor));
    }

    ecc.forEach((that, i) => {
      output[array.length + i] = that;
    });

    return output;
  }
}

ReedSolomonEncoder.factory = (BLOCKS_ECC) => {
  const that = new ReedSolomonEncoder();

  that.coefficients = new Array(BLOCKS_ECC);
  that.coefficients.fill(0);
  that.coefficients[BLOCKS_ECC - 1] = 1;

  let root = 2;
  for (let i = 0; i < BLOCKS_ECC; i++) {
    for (let j = 0; j < BLOCKS_ECC; j++) {
      that.coefficients[j] = Multiply(that.coefficients[j], root);
      if (j + 1 < BLOCKS_ECC)
        that.coefficients[j] = Add(that.coefficients[j], that.coefficients[j + 1]);
    }

    root = Multiply(root, 2);
  }

  return that;
};

module.exports = ReedSolomonEncoder;
