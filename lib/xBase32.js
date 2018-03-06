'use strict';

module.exports = {
  encode: encode,
  decode: decode
};

const dict = '0123456789abcdefghjkmnpqrstvwxyz'.split('');
const pad32 = '00000000000000000000000000000000'; // 32 bits
const pad5 = '00000';

function encode(src) {
  let byteSizeMin = 8;
  let byteSize = byteSizeMin;
  let bin = '';
  let checkSymbol = new CheckSymbol();

  // Create a string of padded bits
  src.split('').forEach(c => {
    let cp = c.codePointAt(0);
    let cc = cp.toString(2);
    byteSize = cc.length > byteSize ? cc.length : byteSize;
    let ccPadded = (pad32 + cc).slice(-pad32.length);
    bin += ccPadded;
  });

  // Trim bytes to actual byteSize
  bin = bin
    .match(/.{1,32}/g)
    .map(b => {
      let byte = b.slice(-byteSize);
      let cp = parseInt(byte, 2);
      checkSymbol.update(cp);
      return byte;
    })
    .join('');

  // Encode every 5 bits (base32)
  let bytes = bin.match(/.{1,5}/g);
  let encoded = '';
  bytes.forEach(b => {
    if (b.length === 5) {
      let n = parseInt(b, 2);
      encoded += dict[n];
      return;
    }
    // Pad last byte, when there is one
    let padded = (b + pad5).substr(0, pad5.length);
    let n = parseInt(padded, 2);
    encoded += dict[n];
  });

  // Add byteSize prefix for decoding
  encoded = dict[byteSize] + encoded;

  // Add checkSymbol suffix
  encoded += checkSymbol.get();
  return encoded;
}

function decode(encoded) {
  let checkSymbol = new CheckSymbol();

  encoded = normalize(encoded);

  // Get byteSize from prefix
  encoded = encoded.split('');
  let byteSize = encoded.shift();
  byteSize = dict.indexOf(byteSize);

  // Get the checkSymbol from suffix
  let expectedCheckSymbol = encoded.pop();

  // Parse out the string of bits
  let decodedBin = '';
  encoded.forEach(c => {
    let n = dict.indexOf(c);
    let bits = parseInt(n, 10).toString(2);
    let paddedBits = (pad5 + bits).slice(-pad5.length);
    decodedBin += paddedBits;
  });

  // Decode every *byteSize byte
  let bytes = decodedBin.match(new RegExp(`.{1,${byteSize}}`, 'g'));
  let decoded = '';
  bytes.forEach(b => {
    let cp = parseInt(parseInt(b, 2), 10); // .toString(10);
    if (b.length === byteSize) {
      checkSymbol.update(cp);
      let char = String.fromCodePoint(cp);
      decoded += char;
    }
  });

  if (expectedCheckSymbol !== checkSymbol.get()) {
    throw Error('Failed to Pass Validation Check');
  }
  return decoded;
}

function normalize(encoded) {
  let normalized = '';
  encoded = encoded.replace(/[il]/gi, 1).replace(/[o]/gi, 0);
  encoded.split('').forEach(c => {
    if (dict.indexOf(c) > -1) {
      normalized += c;
    }
  });
  return normalized;
}

function CheckSymbol() {
  let currentMod = 0;
  let symbol = '';

  function update(codePoint) {
    currentMod = (currentMod + codePoint) % 32;
    symbol = dict[currentMod];
  }

  function get() {
    return symbol;
  }
  return {
    update: update,
    get: get
  };
}
