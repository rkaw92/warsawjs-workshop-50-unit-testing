import { DiscountCode } from "./DiscountCode";
import { sumUp } from "./Money";
import { OrderLine } from "./OrderLine";

export class Order {
    private lines: Array<OrderLine>;
    private discountCode: DiscountCode | null;
    constructor() {
        this.lines = [];
        this.discountCode = null;
    }
    addItem(line: OrderLine) {
        this.lines.push(line);
    }
    getTotal() {
        const sumBeforeDiscounts = sumUp(
            this.lines.map(
                ({ unitPrice, quantity, taxRate }) => unitPrice.times(quantity.toString()).times((100 + taxRate) / 100)
            )
        );
        if (sumBeforeDiscounts === null) {
            return sumBeforeDiscounts;
        }
        const sumAfterDiscounts = this.discountCode ? this.discountCode.apply(sumBeforeDiscounts) : sumBeforeDiscounts;
        return sumAfterDiscounts;
    }
    applyDiscountCode(code: DiscountCode) {
        this.discountCode = code;
    }
};
