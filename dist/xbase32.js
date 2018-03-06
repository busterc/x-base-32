(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.xBase32 = mod.exports;
  }
})(this, function (module) {
  'use strict';

  module.exports = {
    encode: encode,
    decode: decode
  };

  var dict = '0123456789abcdefghjkmnpqrstvwxyz'.split('');
  var pad32 = '00000000000000000000000000000000'; // 32 bits
  var pad5 = '00000';

  function encode(src) {
    var byteSizeMin = 8;
    var byteSize = byteSizeMin;
    var bin = '';
    var checkSymbol = new CheckSymbol();

    // Create a string of padded bits
    src.split('').forEach(function (c) {
      var cp = c.codePointAt(0);
      var cc = cp.toString(2);
      byteSize = cc.length > byteSize ? cc.length : byteSize;
      var ccPadded = (pad32 + cc).slice(-pad32.length);
      bin += ccPadded;
    });

    // Trim bytes to actual byteSize
    bin = bin.match(/.{1,32}/g).map(function (b) {
      var byte = b.slice(-byteSize);
      var cp = parseInt(byte, 2);
      checkSymbol.update(cp);
      return byte;
    }).join('');

    // Encode every 5 bits (base32)
    var bytes = bin.match(/.{1,5}/g);
    var encoded = '';
    bytes.forEach(function (b) {
      if (b.length === 5) {
        var _n = parseInt(b, 2);
        encoded += dict[_n];
        return;
      }
      // Pad last byte, when there is one
      var padded = (b + pad5).substr(0, pad5.length);
      var n = parseInt(padded, 2);
      encoded += dict[n];
    });

    // Add byteSize prefix for decoding
    encoded = dict[byteSize] + encoded;

    // Add checkSymbol suffix
    encoded += checkSymbol.get();
    return encoded;
  }

  function decode(encoded) {
    var checkSymbol = new CheckSymbol();

    encoded = normalize(encoded);

    // Get byteSize from prefix
    encoded = encoded.split('');
    var byteSize = encoded.shift();
    byteSize = dict.indexOf(byteSize);

    // Get the checkSymbol from suffix
    var expectedCheckSymbol = encoded.pop();

    // Parse out the string of bits
    var decodedBin = '';
    encoded.forEach(function (c) {
      var n = dict.indexOf(c);
      var bits = parseInt(n, 10).toString(2);
      var paddedBits = (pad5 + bits).slice(-pad5.length);
      decodedBin += paddedBits;
    });

    // Decode every *byteSize byte
    var bytes = decodedBin.match(new RegExp('.{1,' + byteSize + '}', 'g'));
    var decoded = '';
    bytes.forEach(function (b) {
      var cp = parseInt(parseInt(b, 2), 10); // .toString(10);
      if (b.length === byteSize) {
        checkSymbol.update(cp);
        var char = String.fromCodePoint(cp);
        decoded += char;
      }
    });

    if (expectedCheckSymbol !== checkSymbol.get()) {
      throw Error('Failed to Pass Validation Check');
    }
    return decoded;
  }

  function normalize(encoded) {
    var normalized = '';
    encoded = encoded.replace(/[il]/gi, 1).replace(/[o]/gi, 0);
    encoded.split('').forEach(function (c) {
      if (dict.indexOf(c) > -1) {
        normalized += c;
      }
    });
    return normalized;
  }

  function CheckSymbol() {
    var currentMod = 0;
    var symbol = '';

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
});
