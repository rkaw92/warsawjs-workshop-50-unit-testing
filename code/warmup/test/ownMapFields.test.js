const mapFields = require('../src/mapFields').mapFields;
const assert = require('assert').strict;

describe('mapFields', function() {
    it('should return empty data and rejectedKeys for empty inputs', function() {
        const input = {};
        const supportedFields = [];
        assert.deepEqual(mapFields(input, supportedFields), {
            data: {},
            rejectedKeys: []
        });
    });
    it('should leave all keys if all keys are supported', function() {
        const input = { firstName: 'John', lastName: 'Doe' };
        const supportedFields = [ 'firstName', 'lastName' ];
        assert.deepEqual(mapFields(input, supportedFields), {
            data: { firstName: 'John', lastName: 'Doe' },
            rejectedKeys: []
        });
    });
    it('should reject a key that is not supported', function() {
        const input = { firstName: 'John', lastName: 'Doe' };
        const supportedFields = [ 'firstName' ];
        assert.deepEqual(mapFields(input, supportedFields), {
            data: { firstName: 'John' },
            rejectedKeys: [ 'lastName' ]
        });
    });
});
