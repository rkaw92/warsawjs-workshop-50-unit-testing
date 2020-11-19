import { Order } from '../src/Order';
import { OrderLine } from '../src/OrderLine';
import { DiscountCode } from '../src/DiscountCode';
import Big from 'big.js';
import * as assert from 'assert';

describe('Order', function() {
    it('should be able to get instantiated', function() {
        const myOrder = new Order();
    });
    it('should support adding items', function() {
        const myOrder = new Order();
        myOrder.addItem(new OrderLine({
            itemID: 'item1',
            quantity: BigInt(1),
            unitPrice: { amount: new Big(100), currency: 'PLN' },
            taxRate: 23
        }));
    });
    it('should compute the items\' total', function() {
        const myOrder = new Order();
        myOrder.addItem(new OrderLine({
            itemID: 'item1',
            quantity: BigInt(1),
            unitPrice: { amount: new Big(100), currency: 'PLN' },
            taxRate: 23
        }));
        myOrder.addItem(new OrderLine({
            itemID: 'item2',
            quantity: BigInt(5),
            unitPrice: { amount: new Big(25), currency: 'PLN' },
            taxRate: 23
        }));
        assert.strictEqual(Number(myOrder.getTotal()!.amount), 225*1.23);
    });
    it('should apply a discount code', function() {
        const myOrder = new Order();
        myOrder.applyDiscountCode(new DiscountCode({ code: 'TEST', discountPercent: 10 }));
    });
    it('should reduce the price based on the applied discount', function() {
        const myOrder = new Order();
        myOrder.addItem(new OrderLine({
            itemID: 'promoItem1',
            quantity: BigInt(2),
            unitPrice: { amount: new Big(500), currency: 'EUR' },
            taxRate: 23
        }));
        myOrder.applyDiscountCode(new DiscountCode({ code: 'SUPERPROMO', discountPercent: 30 }));
        const total = myOrder.getTotal()!;
        assert.strictEqual(total.amount.toString(), '861');
        assert.strictEqual(total.currency, 'EUR');
    });
    it('should only apply one discount at a time', function() {
        const myOrder = new Order();
        myOrder.addItem(new OrderLine({
            itemID: 'promoItem1',
            quantity: BigInt(1),
            unitPrice: { amount: new Big(100), currency: 'EUR' },
            taxRate: 0
        }));
        myOrder.applyDiscountCode(new DiscountCode({ code: 'SUPERPROMO', discountPercent: 30 }));
        myOrder.applyDiscountCode(new DiscountCode({ code: 'NORMALPROMO', discountPercent: 25 }));
        const total = myOrder.getTotal()!;
        assert.strictEqual(total.amount.toString(), '75');
        assert.strictEqual(total.currency, 'EUR');
    });
});
