const filterProperties = require('../src/filterProperties').filterProperties;
const assert = require('assert').strict;

describe('filterProperties', function() {
    it('should return an empty object, given empty inputs', function() {
        const input = {};
        const keys = [];
        assert.deepEqual(filterProperties(input, keys), {});
    });
    it('should filter out a property', function() {
        const input = { a: 1, b: 'test' };
        const keys = [ 'a' ];
        assert.deepEqual(filterProperties(input, keys), { a: 1 });
    });
    it('should not modify the input object', function() {
        const input = { firstName: 'John', lastName: 'Doe' };
        filterProperties(input, []);
        assert.deepEqual(input, { firstName: 'John', lastName: 'Doe' });
    });
});
