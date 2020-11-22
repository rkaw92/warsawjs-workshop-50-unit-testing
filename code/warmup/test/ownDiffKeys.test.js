const diffKeys = require('../src/diffKeys').diffKeys;
const assert = require('assert').strict;

describe('diffKeys', function() {
    it('should return an empty array for two empty objects', function() {
        const a = {};
        const b = {};
        assert.deepEqual(diffKeys(a, b), []);
    });
    it('should return all keys when second object is empty', function() {
        const a = { name: 'Json', surname: 'Sharp' };
        const b = {};
        assert.deepEqual(diffKeys(a, b), [ 'name', 'surname' ]);
    });
    it('should return keys that are in a but not in b', function() {
        const a = { name: 'Json', surname: 'Sharp' };
        const b = { name: '' };
        assert.deepEqual(diffKeys(a, b), [ 'surname' ]);
    });
    it('should return the entire a for disjoint sets', function() {
        const a = { name: 'Json', surname: 'Sharp' };
        const b = { city: 'Warsaw', postalCode: '01-001' };
        assert.deepEqual(diffKeys(a, b), [ 'name', 'surname' ]);
    });
});
