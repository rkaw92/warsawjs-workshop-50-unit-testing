import * as assert from 'assert';
import { findInsertIndex } from '../src/BoundedSet';

function compareNumbersReverse(a: number, b: number) {
    if (a < b) {
        return 1;
    } else if (a > b) {
        return -1;
    } else {
        return 0;
    }
}

describe('findInsertIndex', function() {
    it('should return 0 for an empty array', function() {
        assert.strictEqual(
            findInsertIndex(1, [], compareNumbersReverse),
            0
        );
    });
    it('should place new element after equal elements', function() {
        assert.strictEqual(
            findInsertIndex(20, [ 20, 20, 20 ], compareNumbersReverse),
            3
        );
    });
    it('should position the new element in the middle, but after equals', function() {
        assert.strictEqual(
            findInsertIndex(100, [ 500, 450, 450, 200, 100, 100, 50, 30, 30, 10 ], compareNumbersReverse),
            6
        );
    });
});
