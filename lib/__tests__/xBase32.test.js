'use strict';

const assert = require('assert');
const xBase32 = require('../xBase32.js');

describe('xBase32', () => {
  it('encodes and decodes', () => {
    let srcs = [
      'Lions and tigers and bears!',
      'אריות ונמרים ודובים!',
      'الأسود والنمور والدببة!',
      '獅子，老虎和熊！',
      'Львы и тигры и медведи!',
      'ライオンとトラとクマ！',
      '🦁🐯🐻'
    ];
    srcs.forEach(src => {
      let encoded = xBase32.encode(src);
      let decoded = xBase32.decode(encoded);
      assert(src === decoded, `decoding failed: ${[src, encoded, decoded]}`);
    });
  });

  it('normalizes encodings during decode', () => {
    let src = '$-*-gvoz-dvOe-r7qe-2zpl-xvgxg3';
    let decoded = xBase32.decode(src);
    assert(decoded === '🦁🐯🐻', `nomralized decoding failed: ${[src, decoded]}`);
  });

  it('throws up when invalid encoding is provided', () => {
    let src = 'gv0zdv0er7qez2p1xvgxg3';
    let hasFailed = false;
    try {
      xBase32.decode(src);
    } catch (error) {
      assert(error.message === 'Failed to Pass Validation Check');
      hasFailed = true;
    }
    assert(hasFailed, 'decode did not throw up on invalid data input');
  });
});
