import Big from 'big.js';

export class Money {
    readonly amount: Big;
    readonly currency: string;
    constructor({ amount, currency }: { amount: number | string | Big, currency: string }) {
        this.amount = new Big(amount);
        this.currency = currency;
    }

    static compare(a: Money, b: Money) {
        if (a.amount.lt(b.amount)) {
            return -1;
        } else if (a.amount.gt(b.amount)) {
            return 1;
        } else {
            return 0;
        }
    }
};
