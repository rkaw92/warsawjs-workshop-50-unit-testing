const diffKeys = require('../src/diffKeys').diffKeys;
const assert = require('assert').strict;

describe('diffKeys', function() {
    it('should return no keys for the same objects', function() {
        const a = { key1: true, key2: true };
        const b = { key1: true, key2: true };
        const output = diffKeys(a, b);
        assert.deepEqual(output, []);
    });
    it('should subtract one object\'s keys from another\'s', function() {
        const a = { key1: true, key2: false, key3: 1, key4: NaN };
        const b = { key1: true, key2: false };
        const output = diffKeys(a, b);
        assert.deepEqual(output, [ 'key3', 'key4' ]);
    });
});
