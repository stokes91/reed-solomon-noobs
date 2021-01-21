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
  ReedSolomonEncoder,
  ReedSolomonDecoder
} = require('../main');

const origNumber = '4';

const data = origNumber.split('').map((that) => {
  return Number(that);
});

const DATA_SYMBOLS = origNumber.length;

const ECC_BYTES = 4 - DATA_SYMBOLS;

const rse = ReedSolomonEncoder.factory(ECC_BYTES);
const eccBytes = rse.encode(data);

eccBytes[0] = 0; // Corrupt 4 to 0.

ReedSolomonDecoder(eccBytes, ECC_BYTES, true);

console.log(eccBytes); // 0 has been restored to 4.
