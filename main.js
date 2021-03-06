/*
   Copyright 2020-2021 Alexander Stokes

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
  Zero,
  One,
  Add,
  Multiply,
  Divide,
  Exp,
  Log,
  Invert,
  Size,
  Base,
  Polynomial,
  ReedSolomonDecoder,
  ReedSolomonEncoder
} = require('rs-finite-field')(0x10, 0x13, 0x2);

function toString16(array) {
  return array.map(x => x.toString(16)).join('');
}

module.exports = {
  ReedSolomonEncoder,
  ReedSolomonDecoder,
  Polynomial,
  GaloisField: { Zero, One, Add, Multiply, Divide, Exp, Log, Invert, Size, Base },
  toString16
};
