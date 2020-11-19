import { Money } from "./Money";

export interface DiscountCodeValue {
    code: string;
    discountPercent: number;
};

export class DiscountCode {
    readonly code: string;
    readonly discountPercent: number;
    constructor(value: DiscountCodeValue) {
        this.code = value.code;
        this.discountPercent = value.discountPercent;
    }

    apply(value: Money) {
        return value.times(100 - this.discountPercent).times(0.01);
    }
};
