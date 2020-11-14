const filterProperties = require('../src/filterProperties').filterProperties;
const assert = require('assert').strict;

describe('filterProperties', function() {
    it('should only leave the appointed keys', function() {
        const input = { a: 1, b: 2, c: 3 };
        const output = filterProperties(input, [ 'a', 'c' ]);
        assert.deepEqual(output, { a: 1, c: 3 });
    });
    it('should keep undefined values', function() {
        const input = { a: 1, b: 2, c: undefined };
        const output = filterProperties(input, [ 'a', 'c' ]);
        assert.deepEqual(output, { a: 1, c: undefined });
    });
});
