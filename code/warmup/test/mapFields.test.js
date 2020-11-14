const { mapFields } = require('../src/mapFields');
const assert = require('assert').strict;

describe('mapFields', function() {
    it('should accept all fields in the nominal case', function() {
        const input = { firstName: 'Chuck', lastName: 'Testa' };
        const fields = [ 'firstName', 'lastName' ];
        const output = mapFields(input, fields);
        assert.deepEqual(output, {
            data: { firstName: 'Chuck', lastName: 'Testa' },
            rejectedKeys: []
        });
    });
    it('should reject unsupported fields', function() {
        const input = { firstName: 'Chuck', lastName: 'Testa', state: 'CA' };
        const fields = [ 'firstName', 'lastName' ];
        const output = mapFields(input, fields);
        assert.deepEqual(output, {
            data: { firstName: 'Chuck', lastName: 'Testa' },
            rejectedKeys: [ 'state' ]
        });
    });
});
