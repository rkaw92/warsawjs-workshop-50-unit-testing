import Big from 'big.js';

export interface MoneyValue {
    amount: Big;
    currency: string;
};

export class Money implements MoneyValue {
    public readonly amount: Big;
    public readonly currency: string;
    constructor(value: MoneyValue) {
        this.amount = value.amount;
        this.currency = value.currency;
    }

    times(quantity: Big | string | number) {
        return new Money({
            amount: this.amount.times(quantity),
            currency: this.currency
        });
    }
};

export function sumUp(moneys: Money[]): Money | null {
    let currency;
    let amount = new Big(0);
    for (let money of moneys) {
        // Guard clause: disallow summing up different currencies!
        if (currency && money.currency !== currency) {
            throw new Error(`Currency mismatch while summing up: cannot add ${currency} and ${money.currency}`);
        }
        currency = money.currency;
        amount = amount.plus(money.amount);
    }
    return currency ? new Money({
       amount,
       currency
    }) : null;
};
